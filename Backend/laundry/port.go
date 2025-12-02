package laundry

import ("ocean-paradise/backend/domain"
 laundryHandler "ocean-paradise/backend/rest/handlers/laundry"
)

// Service Port (Inbound)
type Service interface {
	laundryHandler.Service
}

// Repository Port (Outbound)
type LaundryRepo interface {
	FetchMenu() ([]domain.MenuItem, error)
	SaveRequest(req *domain.ServiceRequest) error
	FetchRequestsByGuest(guestID int) ([]domain.ServiceRequest, error)
	SaveItemsAndUpdateTotal(reqID int, items []domain.RequestItem, total float64) error
	UpdateStatus(reqID int, status string) error
	GetAllRequests() ([]domain.ServiceRequest, error)
}
