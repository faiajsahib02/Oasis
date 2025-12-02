package restaurant

import (
	"encoding/json"
	"net/http"
	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/util"
)

// POST /restaurant/items
func (h *Handler) CreateItem(w http.ResponseWriter, r *http.Request) {
	var item domain.RestaurantMenuItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		util.SendError(w, 400, "Invalid JSON")
		return
	}

	err := h.svc.AddMenuItem(&item)
	if err != nil {
		util.SendError(w, 500, "Failed to create item")
		return
	}
	util.SendData(w, 201, item)
}
