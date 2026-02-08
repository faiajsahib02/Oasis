package housekeeping

import (
	"net/http"

	"oasis/backend/util"
)

// PATCH /housekeeping/rooms/{room}/clean
func (h *Handler) MarkClean(w http.ResponseWriter, r *http.Request) {
	roomNumber := r.PathValue("room")
	err := h.svc.UpdateRoomStatus(roomNumber, "CLEAN")
	if err != nil {
		util.SendError(w, 500, "Error updating status")
		return
	}
	util.SendData(w, 200, "Room Marked Clean")
}

