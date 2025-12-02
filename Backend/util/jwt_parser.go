// Add this to your util folder (e.g., inside create_jwt.go or jwt_parser.go)
package util

import (
	"encoding/base64"
	"encoding/json"
)
import (
    "strings"
    "errors"
)

// ParseJwtClaims blindly decodes the payload to get the Guest ID
// (We assume the Middleware checked the signature already)
func ParseJwtClaims(token string) (*Payload, error) {
    // 1. Split the token (Header.Payload.Signature)
    parts := strings.Split(token, ".")
    if len(parts) != 3 {
        return nil, errors.New("invalid token format")
    }

    // 2. Decode the Payload (the middle part)
    payloadPart := parts[1]
    
    // Fix padding if needed for standard Base64 decoding
    if l := len(payloadPart) % 4; l > 0 {
        payloadPart += strings.Repeat("=", 4-l)
    }

    decoded, err := base64.URLEncoding.DecodeString(payloadPart)
    if err != nil {
        return nil, err
    }

    // 3. Unmarshal into the Struct
    var claims Payload
    if err := json.Unmarshal(decoded, &claims); err != nil {
        return nil, err
    }

    return &claims, nil
}