package restaurant

import (
	"encoding/json"
	"net/http"
	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/util"
	"strconv"
)

// PUT /restaurant/items/{id}
func (h *Handler) UpdateItem(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, _ := strconv.Atoi(idStr)

	var item domain.RestaurantMenuItem
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		util.SendError(w, 400, "Invalid JSON")
		return
	}
	item.ID = id // Ensure ID matches URL

	err := h.svc.UpdateMenuItem(&item)
	if err != nil {
		util.SendError(w, 500, "Failed to update")
		return
	}
	util.SendData(w, 200, "Item Updated")
}
