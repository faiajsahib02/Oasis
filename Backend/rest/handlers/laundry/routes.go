package laundry

import (
	middleware "oasis/backend/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	// Public: Anyone can see prices
	mux.Handle("GET /laundry/menu", manager.With(http.HandlerFunc(h.GetMenu)))

	// Protected: Only logged-in guests can request pickup
	// We assume 'manager.With' applies your Auth middleware if configured
	mux.Handle("POST /laundry/requests", manager.With(http.HandlerFunc(h.CreateRequest), h.middlewares.AuthinticateJWT))
	
	mux.Handle("GET /laundry/requests/me", manager.With(http.HandlerFunc(h.GetHistory), h.middlewares.AuthinticateJWT))

	mux.Handle("GET /laundry/requests/all", manager.With(http.HandlerFunc(h.GetAllRequests)))

    // 2. Add Items (Billing)
    mux.Handle("POST /laundry/requests/{id}/items", manager.With(http.HandlerFunc(h.AddItems)))

    // 3. Update Status
    // Note: We use PATCH for partial updates
    mux.Handle("PATCH /laundry/requests/{id}/status", manager.With(http.HandlerFunc(h.UpdateStatus)))
}
