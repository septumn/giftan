package consumer

import "encoding/json"

type Event struct {
	To       string          `json:"to"`
	Template string          `json:"template"`
	Data     json.RawMessage `json:"data"`
}

type NestPayload struct {
	Pattern string `json:"pattern"`
	Data    Event  `json:"data"`
}
