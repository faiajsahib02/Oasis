package housekeeping

import (
	"net/http"
	"strconv"

	"ocean-paradise/backend/util"
)

// PATCH /housekeeping/amenities/{id}/deliver
func (h *Handler) MarkAmenityDelivered(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.SendError(w, 400, "Invalid amenity ID")
		return
	}

	err = h.svc.MarkAmenityDelivered(id)
	if err != nil {
		util.SendError(w, 500, "Failed to mark amenity as delivered")
		return
	}

	util.SendData(w, 200, map[string]string{"message": "Amenity marked as delivered"})
}

// PATCH /housekeeping/tickets/{id}/resolve
func (h *Handler) ResolveTicket(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.SendError(w, 400, "Invalid ticket ID")
		return
	}

	err = h.svc.ResolveTicket(id)
	if err != nil {
		util.SendError(w, 500, "Failed to resolve ticket")
		return
	}

	util.SendData(w, 200, map[string]string{"message": "Ticket resolved"})
}
