package guest

import (
	"ocean-paradise/backend/domain"
	guestHandler "ocean-paradise/backend/rest/handlers/guest"
)

// Service defines what the "Guest Module" is capable of doing.
// This is the interface your API Handlers will use.
type Service interface {
	guestHandler.Service
}

// GuestRepo defines how the "Guest Module" talks to the database.
// This is the interface your PostgreSQL adapter will implement.
type GuestRepo interface {
	Create(guest domain.Guest) (*domain.Guest, error)
	Find(roomNumber, phoneNumber string) (*domain.Guest, error)
	FindByID(id int) (*domain.Guest, error)
	FindByRoomNumber(roomNumber string) (*domain.Guest, error)
}
