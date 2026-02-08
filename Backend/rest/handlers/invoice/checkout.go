package invoice

import (
	"net/http"

	"oasis/backend/util"
)

// POST /invoice/checkout
// Used by Staff (or Guest self-checkout) to finalize the stay
// If ?room=101 query param is provided, lookup by room number (for staff)
// Otherwise, use JWT token (for guest)
func (h *Handler) Checkout(w http.ResponseWriter, r *http.Request) {
	// Check for room query parameter (staff checkout flow)
	roomNumber := r.URL.Query().Get("room")

	if roomNumber != "" {
		// Staff flow: lookup by room number
		inv, err := h.svc.ProcessCheckoutByRoom(roomNumber)
		if err != nil {
			util.SendError(w, http.StatusInternalServerError, "Checkout failed: "+err.Error())
			return
		}
		util.SendData(w, http.StatusOK, inv)
		return
	}

	// Guest flow: use JWT token
	guestID, err := h.extractGuestID(r)
	if err != nil {
		util.SendError(w, http.StatusUnauthorized, "Invalid Token")
		return
	}

	inv, err := h.svc.ProcessCheckout(guestID)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Checkout Transaction Failed: "+err.Error())
		return
	}

	util.SendData(w, http.StatusOK, inv)
}

