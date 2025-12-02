package invoice

import (
	"net/http"

	"ocean-paradise/backend/util"
)

// GET /invoice/preview
// Used by Guest ("View Bill") or Staff ("Prepare Checkout")
// If ?room=101 query param is provided, lookup by room number (for staff)
// Otherwise, use JWT token (for guest)
func (h *Handler) GetPreview(w http.ResponseWriter, r *http.Request) {
	// Check for room query parameter (staff checkout flow)
	roomNumber := r.URL.Query().Get("room")

	if roomNumber != "" {
		// Staff flow: lookup by room number
		preview, err := h.svc.GeneratePreviewByRoom(roomNumber)
		if err != nil {
			util.SendError(w, http.StatusNotFound, "Guest not found in room "+roomNumber)
			return
		}
		util.SendData(w, http.StatusOK, preview)
		return
	}

	// Guest flow: use JWT token
	guestID, err := h.extractGuestID(r)
	if err != nil {
		util.SendError(w, http.StatusUnauthorized, "Invalid Token")
		return
	}

	preview, err := h.svc.GeneratePreview(guestID)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Failed to generate preview")
		return
	}

	util.SendData(w, http.StatusOK, preview)
}
