package service

import (
	"context"
	"encoding/json"
	"fmt"
)

type MailSender interface {
	Send(to, templateName string, rawData json.RawMessage) error
}

type MailerService struct {
	mailer MailSender
}

func NewEmailService(mailer MailSender) *MailerService {
	return &MailerService{mailer: mailer}
}

type EmailTask struct {
	To       string          `json:"to"`       // example@gmail.com
	Template string          `json:"template"` // change_email, reset_password, verify_email
	Data     json.RawMessage `json:"data"`     // {"Name": "Иван", "ActionURL": "..."}
}

func (s *MailerService) ProccessEmailTask(ctx context.Context, task EmailTask) error {
	switch task.Template {
	case "change_email":
		return s.mailer.Send(task.To, "change_email.html", task.Data)
	case "reset_password":
		return s.mailer.Send(task.To, "reset_password.html", task.Data)
	case "verify_email":
		return s.mailer.Send(task.To, "verify_email.html", task.Data)
	default:
		return fmt.Errorf("Unknown email temlate type: %s", task.Template)
	}
}
