package restaurant

import (
	middleware "ocean-paradise/backend/rest/middlewares"
	"net/http"
)

func (h *Handler) RegisterRoutes(mux *http.ServeMux, manager *middleware.Manager) {
	// Guest Routes
	mux.Handle("GET /restaurant/menu", manager.With(http.HandlerFunc(h.GetMenu)))
	mux.Handle("POST /restaurant/orders", manager.With(http.HandlerFunc(h.PlaceOrder))) // Add Auth middleware
	mux.Handle("GET /restaurant/orders/me", manager.With(http.HandlerFunc(h.GetMyOrders))) // Add Auth middleware

	// Staff Routes
	mux.Handle("PATCH /restaurant/orders/{id}/status", manager.With(http.HandlerFunc(h.UpdateStatus)))
	// STAFF / ADMIN ROUTES
    mux.Handle("GET /restaurant/orders/active", manager.With(http.HandlerFunc(h.GetActiveOrders)))
    mux.Handle("POST /restaurant/items", manager.With(http.HandlerFunc(h.CreateItem)))
    mux.Handle("PUT /restaurant/items/{id}", manager.With(http.HandlerFunc(h.UpdateItem)))
    mux.Handle("DELETE /restaurant/items/{id}", manager.With(http.HandlerFunc(h.DeleteItem)))
}