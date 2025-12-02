package util

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
)

type Header struct {
	Alg string `json:"alg"`
	Typ string `json:"typ"`
}

// Payload updated for Hotel Guest Context
type Payload struct {
	Sub         int    `json:"sub"`          // Guest ID
	Name        string `json:"name"`         // Guest Name
	PhoneNumber string `json:"phone_number"` // Part of Login
	RoomNumber  string `json:"room_number"`  // Part of Login
}

func CreateJwt(secret string, data Payload) (string, error) {
	header := Header{
		Alg: "HS256",
		Typ: "JWT",
	}

	byteArrHeader, err := json.Marshal(header)
	if err != nil {
		return "", err
	}
	headerB64 := base64UrlEncode(byteArrHeader)

	byteArrData, err := json.Marshal(data)
	if err != nil {
		return "", err
	}
	payloadB64 := base64UrlEncode(byteArrData)

	message := headerB64 + "." + payloadB64

	byteArrSecret := []byte(secret)

	byteArrMessage := []byte(message)

	h := hmac.New(sha256.New, byteArrSecret)
	h.Write(byteArrMessage)

	signature := h.Sum(nil)
	signatureB64 := base64UrlEncode(signature)

	jwt := headerB64 + "." + payloadB64 + "." + signatureB64

	return jwt, nil
}

func base64UrlEncode(data []byte) string {
	return base64.URLEncoding.WithPadding(base64.NoPadding).EncodeToString(data)
}