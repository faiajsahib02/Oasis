package room

import "oasis/backend/domain"

type Service interface {
	Create(room domain.Room) (*domain.Room, error)
	Find(roomNumber string) (*domain.Room, error)
	FindByID(id string) (*domain.Room, error)
    // Add this line:
	GetAll(status string) ([]domain.Room, error)
}
