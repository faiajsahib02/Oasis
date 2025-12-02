package restaurant

import (
	"ocean-paradise/backend/domain"
	"time"
)

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

// GetFullMenu stitches categories and items into a tree
func (s *service) GetFullMenu() ([]domain.CategoryWithItems, error) {
	// 1. Get All Categories
	cats, err := s.repo.FetchCategories()
	if err != nil {
		return nil, err
	}

	// 2. Get All Items
	items, err := s.repo.FetchAllItems()
	if err != nil {
		return nil, err
	}

	// 3. Group items by CategoryID
	itemsByCat := make(map[int][]domain.RestaurantMenuItem)
	for _, item := range items {
		itemsByCat[item.CategoryID] = append(itemsByCat[item.CategoryID], item)
	}

	// 4. Build Result Tree
	var result []domain.CategoryWithItems
	for _, cat := range cats {
		result = append(result, domain.CategoryWithItems{
			Category: cat,
			Items:    itemsByCat[cat.ID],
		})
	}

	return result, nil
}

func (s *service) PlaceOrder(guestID int, roomNumber, notes string, items []domain.RestaurantOrderItemInput) (*domain.Order, error) {
	// Note: In a real app, we would re-calculate the price here from the DB.
	// For this MVP, we will let the Repository handle the price lookup/insert or assume frontend passes details (Risky).
	// To keep it simple but safe: The Repo Logic below will re-fetch prices.

	order := &domain.Order{
		GuestID:    guestID,
		RoomNumber: roomNumber,
		Notes:      notes,
		Status:     "RECEIVED",
		TotalPrice: 0.00, // Repo will calculate this
		CreatedAt:  time.Now(),
	}

	err := s.repo.SaveOrder(order, items)
	return order, err
}

func (s *service) GetGuestOrders(guestID int) ([]domain.Order, error) {
	return s.repo.FetchOrdersByGuest(guestID)
}

func (s *service) UpdateStatus(orderID int, status string) error {
	return s.repo.UpdateStatus(orderID, status)

}

func (s *service) AddMenuItem(item *domain.RestaurantMenuItem) error {
	return s.repo.CreateItem(item)
}

func (s *service) UpdateMenuItem(item *domain.RestaurantMenuItem) error {
	return s.repo.UpdateItem(item)
}

func (s *service) RemoveMenuItem(id int) error {
	return s.repo.DeleteItem(id)
}

func (s *service) GetKitchenOrders() ([]domain.OrderWithItems, error) {
	return s.repo.FetchActiveOrders()
}
