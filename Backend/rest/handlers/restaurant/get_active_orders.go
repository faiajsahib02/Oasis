package restaurant

import (
	"net/http"
	"ocean-paradise/backend/util"
)

// GET /restaurant/orders/active (Kitchen Feed)
func (h *Handler) GetActiveOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := h.svc.GetKitchenOrders()
	if err != nil {
		util.SendError(w, 500, "Error")
		return
	}
	util.SendData(w, 200, orders)
}
