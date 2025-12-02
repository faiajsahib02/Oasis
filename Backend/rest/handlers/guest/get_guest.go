package guest

import (
	"ocean-paradise/backend/util"
	"net/http"
	"strconv"
)

func (h *Handler) GetGuest(w http.ResponseWriter, r *http.Request) {
	guestID := r.PathValue("id")

	gId, err := strconv.Atoi(guestID)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid guest id")
		return
	}

	gst, err := h.svc.Get(gId)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal server error")
		return
	}
	if gst == nil {
		util.SendError(w, http.StatusNotFound, "Guest not found")
		return
	}

	util.SendData(w, 200, gst)
}