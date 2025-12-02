package staff

import (
	middleware "ocean-paradise/backend/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	mux.Handle("POST /staff/login", manager.With(http.HandlerFunc(h.Login)))
}