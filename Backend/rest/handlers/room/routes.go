package room

import (
	middleware "oasis/backend/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	// Endpoint to get all rooms or filter by status
	// Usage: GET /rooms or GET /rooms?status=VACANT
	mux.Handle(
		"GET /rooms",
		manager.With(
			http.HandlerFunc(h.GetRooms),
		),
	)

    // TODO: Implement CreateRoom handler
    // Usage: POST /rooms (To add new inventory)
    // mux.Handle(
	// 	"POST /rooms",
	// 	manager.With(
	// 		http.HandlerFunc(h.CreateRoom),
	// 	),
	// )
}
