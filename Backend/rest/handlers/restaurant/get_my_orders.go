package restaurant

import (
	"net/http"
	"ocean-paradise/backend/util"
	"strings"
)

// GET /restaurant/orders/me
func (h *Handler) GetMyOrders(w http.ResponseWriter, r *http.Request) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, _ := util.ParseJwtClaims(tokenString)

	orders, err := h.svc.GetGuestOrders(claims.Sub)
	if err != nil {
		util.SendError(w, 500, "Error")
		return
	}
	util.SendData(w, 200, orders)
}
