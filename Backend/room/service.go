package room

import (
	"ocean-paradise/backend/domain"
)

// service implements the Service interface defined in port.go
type service struct {
	rmRepo RoomRepo
}

// NewService creates a new instance of the room service
func NewService(rmRepo RoomRepo) *service {
	return &service{
		rmRepo: rmRepo,
	}
}

// Find retrieves a room by its Room Number (e.g. "101")
func (svc *service) Find(roomNumber string) (*domain.Room, error) {
	rm, err := svc.rmRepo.Find(roomNumber)
	if err != nil {
		return nil, err
	}
	if rm == nil {
		return nil, nil
	}
	return rm, nil
}

// Create adds a new room to the system
func (svc *service) Create(room domain.Room) (*domain.Room, error) {
	rm, err := svc.rmRepo.Create(room)
	if err != nil {
		return nil, err
	}
	if rm == nil {
		return nil, nil
	}
	return rm, nil
}

// FindByID retrieves a room by its UUID
func (svc *service) FindByID(id string) (*domain.Room, error) {
	rm, err := svc.rmRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if rm == nil {
		return nil, nil
	}
	return rm, nil
}

func (svc *service) GetAll(status string) ([]domain.Room, error) {
	return svc.rmRepo.GetAll(status)
}