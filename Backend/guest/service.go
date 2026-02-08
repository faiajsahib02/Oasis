package guest

import "oasis/backend/domain"

// service implements the Service interface defined in port.go
type service struct {
	gstRepo GuestRepo
}

// NewService creates a new instance of the guest service
func NewService(gstRepo GuestRepo) *service {
	return &service{
		gstRepo: gstRepo,
	}
}

func (svc *service) Find(roomNumber, phoneNumber string) (*domain.Guest, error) {
	gst, err := svc.gstRepo.Find(roomNumber, phoneNumber)
	if err != nil {
		return nil, err
	}
	if gst == nil {
		return nil, nil
	}
	return gst, nil
}

func (svc *service) Create(guest domain.Guest) (*domain.Guest, error) {
	gst, err := svc.gstRepo.Create(guest)
	if err != nil {
		return nil, err
	}
	if gst == nil {
		return nil, nil
	}
	return gst, nil
}

func (svc *service) Get(id int) (*domain.Guest, error) {
	gst, err := svc.gstRepo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if gst == nil {
		return nil, nil
	}
	return gst, nil
}

func (svc *service) GetByRoomNumber(roomNumber string) (*domain.Guest, error) {
	gst, err := svc.gstRepo.FindByRoomNumber(roomNumber)
	if err != nil {
		return nil, err
	}
	if gst == nil {
		return nil, nil
	}
	return gst, nil
}

