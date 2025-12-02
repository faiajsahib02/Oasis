package invoice

import (
	middleware "ocean-paradise/backend/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	// Guest/Staff can view the bill
	mux.Handle("GET /invoice/preview", manager.With(http.HandlerFunc(h.GetPreview)))
	
	// Staff performs the final checkout (Action)
	// In a real app, you might restrict this to Staff Only
	mux.Handle("POST /invoice/checkout", manager.With(http.HandlerFunc(h.Checkout)))
}