package housekeeping

import (
	"encoding/json"
	"net/http"

	"ocean-paradise/backend/util"
)

// POST /housekeeping/ticket
func (h *Handler) ReportIssue(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RoomNumber  string `json:"room_number"`
		IssueType   string `json:"issue_type"`
		Description string `json:"description"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.SendError(w, 400, "Invalid JSON")
		return
	}

	err := h.svc.ReportIssue(req.RoomNumber, req.IssueType, req.Description)
	if err != nil {
		util.SendError(w, 500, "Failed to report issue")
		return
	}
	util.SendData(w, 200, "Issue Reported")
}
