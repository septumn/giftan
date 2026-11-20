package sender

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/smtp"
	"path/filepath"
	"sync"
	"time"
)

type Mailer struct {
	host string
	port string
	from string
	pass string

	mu        sync.Mutex
	client    *smtp.Client
	conn      *tls.Conn
	idleTimer *time.Timer
}

func NewMailer(host, port, from, pass string) *Mailer {
	return &Mailer{
		host: host,
		port: port,
		from: from,
		pass: pass,
	}
}

func (m *Mailer) Send(to string, templateName string, rawData json.RawMessage) error {
	meta, exists := EmailRegistry[templateName]
	if !exists {
		return fmt.Errorf("Шаблон '%s' не зарегистрирован в EmailRegistry", templateName)
	}

	var templateData map[string]interface{}
	if len(rawData) > 0 {
		if err := json.Unmarshal(rawData, &templateData); err != nil {
			return fmt.Errorf("Ошибка парсинга data для шаблона: %w", err)
		}
	}

	templatePath := filepath.Join("templates", meta.TemplateFile)
	tmpl, err := template.ParseFiles(templatePath)
	if err != nil {
		return fmt.Errorf("Ошибка чтения шаблона %s: %w", templatePath, err)
	}

	var body bytes.Buffer
	if err := tmpl.Execute(&body, templateData); err != nil {
		return fmt.Errorf("Ошибка заполнения шаблона данными: %w", err)
	}

	headers := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n", m.from, to, meta.Subject)
	message := append([]byte(headers), body.Bytes()...)

	m.mu.Lock()
	defer m.mu.Unlock()

	if m.idleTimer != nil {
		m.idleTimer.Stop()
	}

	client, err := m.ensureConnection()
	if err != nil {
		return fmt.Errorf("Ошибка получения SMTP-клиента: %w", err)
	}

	if err := client.Mail(m.from); err != nil {
		m.internalClose()
		return fmt.Errorf("ошибка MAIL FROM: %w", err)
	}

	if err := client.Rcpt(to); err != nil {
		m.internalClose()
		return fmt.Errorf("ошибка RCPT TO: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		m.internalClose()
		return fmt.Errorf("ошибка DATA: %w", err)
	}

	if _, err = w.Write(message); err != nil {
		m.internalClose()
		return fmt.Errorf("ошибка записи тела письма: %w", err)
	}

	if err = w.Close(); err != nil {
		m.internalClose()
		return fmt.Errorf("ошибка закрытия writer: %w", err)
	}

	m.startIdleTimer()

	return nil
}

func (m *Mailer) ensureConnection() (*smtp.Client, error) {
	if m.client != nil {
		if err := m.client.Noop(); err == nil {
			return m.client, nil
		}

		log.Println("[SMTP] Соединение разорвано или неактивно. Переподключение...")
		m.internalClose()
	}

	log.Println("[SMTP] Ленивая инициализация: открываем новое TLS-соединение...")
	addr := fmt.Sprintf("%s:%s", m.host, m.port)
	tlsConfig := &tls.Config{
		ServerName: m.host,
	}

	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		return nil, fmt.Errorf("Ошибка TLS соединения: %w", err)
	}
	m.conn = conn

	client, err := smtp.NewClient(conn, m.host)
	if err != nil {
		m.internalClose()
		return nil, fmt.Errorf("Ошибка создания SMTP клиента: %w", err)
	}
	m.client = client

	auth := smtp.PlainAuth("", m.from, m.pass, m.host)
	if err := client.Auth(auth); err != nil {
		m.internalClose()
		return nil, fmt.Errorf("Ошибка аутентификации SMTP: %w", err)
	}

	return m.client, nil
}

func (m *Mailer) startIdleTimer() {
	if m.idleTimer != nil {
		m.idleTimer.Stop()
	}

	m.idleTimer = time.AfterFunc(30*time.Second, func() {
		m.mu.Lock()
		defer m.mu.Unlock()

		if m.client != nil {
			log.Println("[SMTP] Нет задач в течение 30 секунд. Безопасное закрытие TLS-соединения...")
			m.internalClose()
		}
	})
}

func (m *Mailer) internalClose() {
	if m.client != nil {
		_ = m.client.Quit()
		_ = m.client.Close()
		m.client = nil
	}
	if m.conn != nil {
		_ = m.conn.Close()
		m.conn = nil
	}
}

func (m *Mailer) Close() {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.idleTimer != nil {
		m.idleTimer.Stop()
		m.idleTimer = nil
	}

	m.internalClose()
}
