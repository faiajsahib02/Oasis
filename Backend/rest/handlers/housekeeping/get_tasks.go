package housekeeping

import (
	"net/http"

	"ocean-paradise/backend/util"
)

// GET /housekeeping/amenities
func (h *Handler) GetAmenityRequests(w http.ResponseWriter, r *http.Request) {
	requests, err := h.svc.GetAmenityRequests()
	if err != nil {
		util.SendError(w, 500, "Failed to fetch amenity requests")
		return
	}
	util.SendData(w, 200, requests)
}

// GET /housekeeping/tickets
func (h *Handler) GetMaintenanceTickets(w http.ResponseWriter, r *http.Request) {
	tickets, err := h.svc.GetMaintenanceTickets()
	if err != nil {
		util.SendError(w, 500, "Failed to fetch maintenance tickets")
		return
	}
	util.SendData(w, 200, tickets)
}
