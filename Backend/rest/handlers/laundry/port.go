package laundry

import (
	"ocean-paradise/backend/domain" // Import your domain logic
)

type Service interface {
	GetMenu() ([]domain.MenuItem, error)
	CreateRequest(guestID int, roomNumber, notes string) (*domain.ServiceRequest, error)
	GetGuestRequests(guestID int) ([]domain.ServiceRequest, error)
	GetAllRequests() ([]domain.ServiceRequest, error)
	UpdateStatus(reqID int, status string) error
	AddItemsToRequest(reqID int, items []domain.AddItemInput) error
}
