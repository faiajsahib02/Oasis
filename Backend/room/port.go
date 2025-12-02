package room

import (
	"ocean-paradise/backend/domain"
	roomHandler "ocean-paradise/backend/rest/handlers/room"
)

// Service defines what the "Room Module" is capable of doing.
type Service interface {
	roomHandler.Service
}

// RoomRepo defines how the "Room Module" talks to the database.
type RoomRepo interface {
	Create(room domain.Room) (*domain.Room, error)
	Find(roomNumber string) (*domain.Room, error)
	FindByID(id string) (*domain.Room, error)
	GetAll(status string) ([]domain.Room, error)
}