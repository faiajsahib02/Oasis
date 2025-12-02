package room

import (
	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/util"
	"net/http"
)

func (h *Handler) GetRooms(w http.ResponseWriter, r *http.Request) {
	// 1. Check for query param (e.g., ?status=VACANT)
	status := r.URL.Query().Get("status")

	// 2. Call Service
	// If status is empty "", the service should return ALL rooms.
	rooms, err := h.svc.GetAll(status)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}

	// 3. Handle empty list case (not an error, just empty JSON)
	if rooms == nil {
		// Initialize empty slice so JSON returns [] instead of null
		rooms = []domain.Room{} 
	}

	util.SendData(w, 200, rooms)
}