package guest

import "oasis/backend/domain"

// Service defines the methods the Handler needs from the Business Logic layer.
type Service interface {
	Find(roomNumber, phoneNumber string) (*domain.Guest, error)
	Create(guest domain.Guest) (*domain.Guest, error)
	Get(id int) (*domain.Guest, error)
	GetByRoomNumber(roomNumber string) (*domain.Guest, error)
}

