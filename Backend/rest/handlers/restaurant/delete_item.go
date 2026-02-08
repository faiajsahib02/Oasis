package restaurant

import (
	"net/http"
	"oasis/backend/util"
	"strconv"
)

// DELETE /restaurant/items/{id}
func (h *Handler) DeleteItem(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, _ := strconv.Atoi(idStr)

	err := h.svc.RemoveMenuItem(id)
	if err != nil {
		util.SendError(w, 500, "Failed to delete")
		return
	}
	util.SendData(w, 200, "Item Deleted")
}

