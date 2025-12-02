package restaurant

import "ocean-paradise/backend/domain"

// Service Port
type Service interface {
	GetFullMenu() ([]domain.CategoryWithItems, error)
	PlaceOrder(guestID int, roomNumber, notes string, items []domain.RestaurantOrderItemInput) (*domain.Order, error)
	GetGuestOrders(guestID int) ([]domain.Order, error)
	UpdateStatus(orderID int, status string) error // For Kitchen Staff
	GetKitchenOrders() ([]domain.OrderWithItems, error)
	AddMenuItem(item *domain.RestaurantMenuItem) error
	UpdateMenuItem(item *domain.RestaurantMenuItem) error
	RemoveMenuItem(id int) error
}

// Repository Port
type Repository interface {
	FetchCategories() ([]domain.MenuCategory, error)
	FetchAllItems() ([]domain.RestaurantMenuItem, error)
	SaveOrder(order *domain.Order, items []domain.RestaurantOrderItemInput) error
	FetchOrdersByGuest(guestID int) ([]domain.Order, error)
	UpdateStatus(orderID int, status string) error
	FetchActiveOrders() ([]domain.OrderWithItems, error)
	CreateItem(item *domain.RestaurantMenuItem) error
	UpdateItem(item *domain.RestaurantMenuItem) error
	DeleteItem(id int) error
}
