package restaurant

import (
	"net/http"
	"oasis/backend/util"
	"strconv"
)

// PATCH /restaurant/orders/{id}/status (Staff Only)
func (h *Handler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, _ := strconv.Atoi(idStr)
	status := r.URL.Query().Get("status")

	err := h.svc.UpdateStatus(id, status)
	if err != nil {
		util.SendError(w, 500, "Error")
		return
	}
	util.SendData(w, 200, "Status Updated")
}

