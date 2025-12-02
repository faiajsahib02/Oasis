package housekeeping

import (
	"net/http"

	"ocean-paradise/backend/util"
)

// GET /housekeeping/live
// Polling fallback for the Live Map
func (h *Handler) GetLiveStatus(w http.ResponseWriter, r *http.Request) {
	statuses, err := h.svc.GetLiveStatus()
	if err != nil {
		util.SendError(w, 500, "Error fetching map")
		return
	}
	util.SendData(w, 200, statuses)
}
