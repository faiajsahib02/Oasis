package restaurant

import "oasis/backend/domain"

type Service interface {
	// --- GUEST FEATURES ---

	// GetFullMenu returns the tree structure (Categories -> Items)
	// Requires: domain.CategoryWithItems struct
	GetFullMenu() ([]domain.CategoryWithItems, error)

	// PlaceOrder handles the guest adding food to cart
	// Requires: domain.RestaurantOrderItemInput struct
	PlaceOrder(guestID int, roomNumber, notes string, items []domain.RestaurantOrderItemInput) (*domain.Order, error)

	// GetGuestOrders shows history (My Orders)
	GetGuestOrders(guestID int) ([]domain.Order, error)

	// --- STAFF / ADMIN FEATURES ---

	// GetKitchenOrders shows active tickets for the KDS (Kitchen Display System)
	GetKitchenOrders() ([]domain.OrderWithItems, error)

	// UpdateStatus moves order from PREPARING -> READY -> DELIVERED
	UpdateStatus(orderID int, status string) error

	// Menu CRUD (For Menu Manager Page)
	AddMenuItem(item *domain.RestaurantMenuItem) error
	UpdateMenuItem(item *domain.RestaurantMenuItem) error
	RemoveMenuItem(id int) error
}

