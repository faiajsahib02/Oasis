package housekeeping

import (
	"encoding/json"
	"net/http"

	"oasis/backend/util"
)

// POST /housekeeping/clean
// Payload: { "room_number": "101", "status": "REQUESTED_CLEANING" | "DND" | "CLEAN" }
func (h *Handler) RequestCleaning(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RoomNumber string `json:"room_number"`
		Status     string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.SendError(w, 400, "Invalid JSON")
		return
	}

	// Default to REQUESTED_CLEANING if no status provided
	status := req.Status
	if status == "" {
		status = "REQUESTED_CLEANING"
	}

	err := h.svc.UpdateRoomStatus(req.RoomNumber, status)
	if err != nil {
		util.SendError(w, 500, "Failed to update room status")
		return
	}
	util.SendData(w, 200, "Room status updated")
}

