package housekeeping

import (
	"net/http"

	"oasis/backend/domain"
)

// Service defines the methods the Handler needs from the Business Logic layer.
type Service interface {
	// Guest Actions
	RequestCleaning(roomNumber string) error
	RequestAmenity(guestID int, roomNumber, item string, qty int) error
	ReportIssue(roomNumber, issueType, desc string) error

	// Staff Actions
	GetLiveStatus() ([]domain.RoomsStatus, error)
	UpdateRoomStatus(roomNumber, status string) error
	GetAmenityRequests() ([]domain.AmenityRequest, error)
	GetMaintenanceTickets() ([]domain.MaintenanceTicket, error)
	MarkAmenityDelivered(id int) error
	ResolveTicket(id int) error
}

// WebSocketHub defines the methods the Handler needs for WebSocket functionality.
type WebSocketHub interface {
	ServeWs(w http.ResponseWriter, r *http.Request)
}

