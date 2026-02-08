package housekeeping

import (
	"encoding/json"
	"net/http"

	"oasis/backend/util"
)

// POST /housekeeping/amenity
// Payload: { "guest_id": 1, "room_number": "101", "amenity": "towels", "quantity": 2 }
func (h *Handler) RequestAmenity(w http.ResponseWriter, r *http.Request) {
	var req struct {
		GuestID    int    `json:"guest_id"`
		RoomNumber string `json:"room_number"`
		Amenity    string `json:"amenity"`
		Quantity   int    `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.SendError(w, 400, "Invalid JSON")
		return
	}

	err := h.svc.RequestAmenity(req.GuestID, req.RoomNumber, req.Amenity, req.Quantity)
	if err != nil {
		util.SendError(w, 500, "Failed to request amenity")
		return
	}
	util.SendData(w, 200, "Amenity Requested")
}

