package config

import (
	"log"
	"os"
)

type Config struct {
	RabbitMQURL string
}

func Load() *Config {
	rabbitMQURL, isFallback := getEnv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
	if isFallback {
		log.Println("Не удалось найти RABBITMQ_URL в .env, использовано резервное значение")
	}

	return &Config{
		RabbitMQURL: rabbitMQURL,
	}
}

func getEnv(key, fallback string) (string, bool) {
	if val, ok := os.LookupEnv(key); ok {
		return val, false
	}

	return fallback, true
}
