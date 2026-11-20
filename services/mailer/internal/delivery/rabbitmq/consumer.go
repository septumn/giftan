package rabbitmq

import (
	"context"
	"encoding/json"
	"log"
	"mailer/internal/service"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Consumer struct {
	channel   *amqp.Channel
	queueName string
	emailSvc  *service.MailerService
}

func NewConsumer(conn *amqp.Connection, queueName string, emailSvc *service.MailerService) (*Consumer, error) {
	ch, err := conn.Channel()
	if err != nil {
		return nil, err
	}

	_, err = ch.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return nil, err
	}

	err = ch.Qos(
		1,
		0,
		false,
	)
	if err != nil {
		return nil, err
	}

	return &Consumer{
		channel:   ch,
		queueName: queueName,
		emailSvc:  emailSvc,
	}, nil
}

func (c *Consumer) Start(ctx context.Context) error {
	msgs, err := c.channel.Consume(
		c.queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	log.Printf("[RabbitMQ] Consumer started. Listening to queue: %s", c.queueName)

	for {
		select {
		case <-ctx.Done():
			log.Println("[RabbitMQ] Stopping consumer...")
			return nil
		case msg, ok := <-msgs:
			if !ok {
				log.Println("[RabbitMQ] Channel closed")
				return nil
			}

			var task service.EmailTask
			if err := json.Unmarshal(msg.Body, &task); err != nil {
				log.Printf("[Error] Failed to unmarshal JSON: %v", err)
				_ = msg.Nack(false, false)
				continue
			}

			err := c.emailSvc.ProccessEmailTask(ctx, task)
			if err != nil {
				log.Panicf("[Error] Failed to process email task: %v", err)
				_ = msg.Nack(false, false)
			}

			_ = msg.Ack(false)
		}
	}
}
