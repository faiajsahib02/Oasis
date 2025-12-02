package restaurant

import (
	"net/http"
	"ocean-paradise/backend/util"
)

// GET /restaurant/menu
func (h *Handler) GetMenu(w http.ResponseWriter, r *http.Request) {
	menu, err := h.svc.GetFullMenu()
	if err != nil {
		util.SendError(w, 500, "Error fetching menu")
		return
	}
	util.SendData(w, 200, menu)
}
