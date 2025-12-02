package laundry

import (
	"ocean-paradise/backend/domain"
	"time"
)

type service struct {
	lndryRepo LaundryRepo
}

func NewService(lndryRepo LaundryRepo) Service {
	return &service{
		lndryRepo: lndryRepo,
	}
}

func (s *service) GetMenu() ([]domain.MenuItem, error) {
	return s.lndryRepo.FetchMenu()
}

func (s *service) CreateRequest(guestID int, roomNumber, notes string) (*domain.ServiceRequest, error) {
	// 1. Construct the object
	req := &domain.ServiceRequest{
		GuestID:    guestID,
		RoomNumber: roomNumber,
		Notes:      notes,
		Status:     "PENDING",
		TotalPrice: 0.00,
		CreatedAt:  time.Now(),
	}

	// 2. Save it
	err := s.lndryRepo.SaveRequest(req)
	if err != nil {
		return nil, err
	}

	return req, nil
}

func (s *service) GetGuestRequests(guestID int) ([]domain.ServiceRequest, error) {
	return s.lndryRepo.FetchRequestsByGuest(guestID)
}

func (s *service) GetAllRequests() ([]domain.ServiceRequest, error) {
	return s.lndryRepo.GetAllRequests()
}

// AddItemsToRequest handles the billing logic
func (s *service) AddItemsToRequest(reqID int, items []domain.AddItemInput) error {
	// 1. Fetch the Menu to get current prices
	menu, err := s.lndryRepo.FetchMenu()
	if err != nil {
		return err
	}

	// Create a map for fast price lookup
	priceMap := make(map[int]float64)
	for _, m := range menu {
		priceMap[m.ID] = m.Price
	}

	var totalBill float64
	var domainItems []domain.RequestItem

	// 2. Calculate Total and Prepare Structs
	for _, input := range items {
		price := priceMap[input.ItemID]
		cost := price * float64(input.Quantity)
		totalBill += cost

		domainItems = append(domainItems, domain.RequestItem{
			RequestID: reqID,
			ItemID:    input.ItemID,
			Quantity:  input.Quantity,
			SnapPrice: price, // Save the price NOW in case menu changes later
		})
	}

	// 3. Call Repository to Save Items AND Update Total Price
	return s.lndryRepo.SaveItemsAndUpdateTotal(reqID, domainItems, totalBill)
}

func (s *service) UpdateStatus(reqID int, status string) error {
	return s.lndryRepo.UpdateStatus(reqID, status)
}
