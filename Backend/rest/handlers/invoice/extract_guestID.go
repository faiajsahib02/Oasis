package invoice

import (
	"net/http"
	"strings"

	"oasis/backend/util"
)

// Helper to extract Guest ID from JWT token
func (h *Handler) extractGuestID(r *http.Request) (int, error) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := util.ParseJwtClaims(tokenString)
	if err != nil {
		return 0, err
	}
	return claims.Sub, nil
}

