package housekeeping

import "oasis/backend/domain"

// Service Interface
type Service interface {
	// Guest Actions
	RequestAmenity(guestID int, roomNumber, item string, qty int) error
	ReportIssue(roomNumber, issueType, desc string) error
	RequestCleaning(roomNumber string) error

	// Staff Actions
	GetLiveStatus() ([]domain.RoomsStatus, error)
	UpdateRoomStatus(roomNumber, status string) error
	GetAmenityRequests() ([]domain.AmenityRequest, error)
	GetMaintenanceTickets() ([]domain.MaintenanceTicket, error)
	MarkAmenityDelivered(id int) error
	ResolveTicket(id int) error
}

// Repository Interface
type Repository interface {
	SaveAmenityRequest(req *domain.AmenityRequest) error
	SaveTicket(ticket *domain.MaintenanceTicket) error
	UpdateRoomStatus(roomNumber, status string) error
	FetchAllRoomStatuses() ([]domain.RoomsStatus, error)
	FetchAmenityRequests() ([]domain.AmenityRequest, error)
	FetchMaintenanceTickets() ([]domain.MaintenanceTicket, error)
	UpdateAmenityStatus(id int, status string) error
	UpdateTicketStatus(id int, status string) error
}

