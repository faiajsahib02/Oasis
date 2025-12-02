package guest

import (
	middleware "ocean-paradise/backend/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	// Endpoint for Staff to Register a new Guest
	mux.Handle(
		"POST /guests",
		manager.With(
			http.HandlerFunc(h.CreateGuest),
		),
	)

	// Endpoint for Guest to Login using Room# and Phone#
	mux.Handle(
		"POST /guests/login",
		manager.With(
			http.HandlerFunc(h.Login),
		),
	)
	mux.Handle(
		"GET /guests/{id}",
		manager.With(
			http.HandlerFunc(h.GetGuest),
		),
	)
}