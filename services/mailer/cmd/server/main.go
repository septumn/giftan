package main

import (
	"context"
	"log"
	"mailer/internal/config"
	"mailer/internal/delivery/rabbitmq"
	"mailer/internal/sender"
	"mailer/internal/service"
	"os"
	"os/signal"
	"syscall"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	cfg := config.Load()

	log.Printf("Connecting to RabbitMQ: %s", cfg.RabbitMQURL)
	conn, err := amqp.Dial(cfg.RabbitMQURL)
	if err != nil {
		log.Fatalf("Failer to connect to RabbitMQ %v", err)
	}
	defer conn.Close()

	mailer := sender.NewMailer("smtp.gmail.com", "465", "giftangmail@gmail.com", "xtfm ymgk cpqg xvrn")
	emailSvc := service.NewEmailService(mailer)

	consumer, err := rabbitmq.NewConsumer(conn, "email_queue", emailSvc)
	if err != nil {
		log.Fatalf("Failed to create RabbitMQ consumer: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		if err := consumer.Start(ctx); err != nil {
			log.Fatalf("Consumer error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Printf("Shutting down email-service...")
	cancel()
}
