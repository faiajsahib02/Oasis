package invoice

import (
	"errors"
	"oasis/backend/domain"
	"oasis/backend/guest"
	"oasis/backend/laundry"
	"oasis/backend/restaurant"
	"oasis/backend/room"
)

type service struct {
	repo          Repository
	guestSvc      guest.Service
	roomSvc       room.Service
	laundrySvc    laundry.Service
	restaurantSvc restaurant.Service
}

// We inject EVERYTHING here. This is the central hub.
func NewService(
	repo Repository,
	g guest.Service,
	r room.Service,
	l laundry.Service,
	rest restaurant.Service,
) Service {
	return &service{
		repo:          repo,
		guestSvc:      g,
		roomSvc:       r,
		laundrySvc:    l,
		restaurantSvc: rest,
	}
}

// 1. GeneratePreview (Read-Only Aggregation)
func (s *service) GeneratePreview(guestID int) (*domain.InvoicePreview, error) {
	// A. Get Guest Info
	gst, _ := s.guestSvc.Get(guestID)

	// B. Calculate Room Charge based on check-in and check-out dates
	days := int(gst.CheckOutDate.Sub(gst.CheckInDate).Hours() / 24)
	if days == 0 {
		days = 1
	}

	roomPrice := 100.00 // In real app, fetch from Room Service
	roomTotal := float64(days) * roomPrice

	// C. Get Pending Laundry (We need to add this method to Laundry Svc!)
	laundryReqs, _ := s.laundrySvc.GetGuestRequests(guestID)
	var laundryTotal float64
	for _, req := range laundryReqs {
		if req.Status != "PAID" {
			laundryTotal += req.TotalPrice
		}
	}

	// D. Get Pending Food (We need to add this method to Restaurant Svc!)
	foodOrders, _ := s.restaurantSvc.GetGuestOrders(guestID)
	var foodTotal float64
	for _, ord := range foodOrders {
		if ord.Status != "PAID" {
			foodTotal += ord.TotalPrice
		}
	}

	return &domain.InvoicePreview{
		GuestName:       gst.Name,
		StayDays:        days,
		RoomTotal:       roomTotal,
		LaundryTotal:    laundryTotal,
		RestaurantTotal: foodTotal,
		GrandTotal:      roomTotal + laundryTotal + foodTotal,
	}, nil
}

// GeneratePreviewByRoom looks up guest by room number and generates preview
func (s *service) GeneratePreviewByRoom(roomNumber string) (*domain.InvoicePreview, error) {
	gst, err := s.guestSvc.GetByRoomNumber(roomNumber)
	if err != nil {
		return nil, err
	}
	if gst == nil {
		return nil, errors.New("no guest found in this room")
	}
	return s.GeneratePreview(gst.ID)
}

func (s *service) ProcessCheckout(guestID int) (*domain.Invoice, error) {
	// 1. Re-calculate totals (Security check)
	preview, err := s.GeneratePreview(guestID)
	if err != nil {
		return nil, err
	}

	// 2. Build the Invoice Object
	inv := &domain.Invoice{
		GuestID:          guestID,
		RoomCharge:       preview.RoomTotal,
		LaundryCharge:    preview.LaundryTotal,
		RestaurantCharge: preview.RestaurantTotal,
		TotalAmount:      preview.GrandTotal,
		PaymentMethod:    "CREDIT_CARD",
	}

	// 3. RUN THE ACID TRANSACTION
	// This calls the Repository which wraps everything in BEGIN/COMMIT
	err = s.repo.CreateInvoiceTx(inv)
	if err != nil {
		return nil, errors.New("checkout transaction failed")
	}

	return inv, nil
}

// ProcessCheckoutByRoom looks up guest by room number and processes checkout
func (s *service) ProcessCheckoutByRoom(roomNumber string) (*domain.Invoice, error) {
	gst, err := s.guestSvc.GetByRoomNumber(roomNumber)
	if err != nil {
		return nil, err
	}
	if gst == nil {
		return nil, errors.New("no guest found in this room")
	}
	return s.ProcessCheckout(gst.ID)
}

