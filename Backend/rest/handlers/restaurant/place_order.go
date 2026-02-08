package restaurant

import (
	"encoding/json"
	"net/http"
	"oasis/backend/domain"
	"oasis/backend/util"
	"strings"
)

type ReqPlaceOrder struct {
	RoomNumber string                  `json:"room_number"`
	Notes      string                  `json:"notes"`
	Items      []domain.RestaurantOrderItemInput `json:"items"`
}

// POST /restaurant/orders
func (h *Handler) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	// 1. Decode Body
	var req ReqPlaceOrder
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.SendError(w, 400, "Invalid Payload")
		return
	}

	// 2. Get Guest ID
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, _ := util.ParseJwtClaims(tokenString)

	// 3. Call Service
	order, err := h.svc.PlaceOrder(claims.Sub, req.RoomNumber, req.Notes, req.Items)
	if err != nil {
		util.SendError(w, 500, "Failed to place order")
		return
	}
	util.SendData(w, 200, order)
}

