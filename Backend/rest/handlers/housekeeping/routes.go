package housekeeping

import (
	"net/http"
	middleware "ocean-paradise/backend/rest/middlewares"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	// 1. The WebSocket Endpoint (Public or Token-Based logic inside)
	mux.Handle("GET /ws", http.HandlerFunc(h.ServeWebSocket))

	// 2. Guest Actions
	mux.Handle("POST /housekeeping/clean", manager.With(http.HandlerFunc(h.RequestCleaning)))
	mux.Handle("POST /housekeeping/amenity", manager.With(http.HandlerFunc(h.RequestAmenity)))
	mux.Handle("POST /housekeeping/ticket", manager.With(http.HandlerFunc(h.ReportIssue)))

	// 3. Staff Actions
	mux.Handle("GET /housekeeping/live", manager.With(http.HandlerFunc(h.GetLiveStatus)))
	mux.Handle("GET /housekeeping/amenities", manager.With(http.HandlerFunc(h.GetAmenityRequests)))
	mux.Handle("GET /housekeeping/tickets", manager.With(http.HandlerFunc(h.GetMaintenanceTickets)))
	mux.Handle("PATCH /housekeeping/rooms/{room}/clean", manager.With(http.HandlerFunc(h.MarkClean)))
	mux.Handle("PATCH /housekeeping/amenities/{id}/deliver", manager.With(http.HandlerFunc(h.MarkAmenityDelivered)))
	mux.Handle("PATCH /housekeeping/tickets/{id}/resolve", manager.With(http.HandlerFunc(h.ResolveTicket)))
}
