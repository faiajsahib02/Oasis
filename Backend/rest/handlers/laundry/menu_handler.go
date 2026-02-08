package laundry


import (
	"oasis/backend/util" // Replace with your actual module
	"net/http"
)

func (h *Handler) GetMenu(w http.ResponseWriter, r *http.Request) {
	// Updated: No context passed
	menu, err := h.svc.GetMenu()
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Failed to fetch menu")
		return
	}
	util.SendData(w, http.StatusOK, menu)
}
