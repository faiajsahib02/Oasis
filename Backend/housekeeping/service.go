package housekeeping

import (
	"oasis/backend/domain"
	"oasis/backend/ws" // Import the WebSocket package
	"time"
)

type service struct {
	repo Repository
	hub  *ws.Hub // <--- INJECTED DEPENDENCY
}

// We ask for the Hub in the constructor
func NewService(repo Repository, hub *ws.Hub) Service {
	return &service{
		repo: repo,
		hub:  hub,
	}
}

// 1. Request Cleaning (Guest -> Staff)
func (s *service) RequestCleaning(roomNumber string) error {
	status := "REQUESTED_CLEANING"

	// A. Update DB
	err := s.repo.UpdateRoomStatus(roomNumber, status)
	if err != nil {
		return err
	}

	// B. REAL-TIME BROADCAST 📡
	// This makes the Staff iPad blink instantly
	s.hub.BroadcastToStaff("ROOM_UPDATE", map[string]string{
		"room_number": roomNumber,
		"status":      status,
	})

	return nil
}

// 2. Staff Marks Clean (Staff -> Map Update)
func (s *service) UpdateRoomStatus(roomNumber, status string) error {
	err := s.repo.UpdateRoomStatus(roomNumber, status)
	if err != nil {
		return err
	}

	// Broadcast the fix (e.g. turning Green)
	s.hub.BroadcastToStaff("ROOM_UPDATE", map[string]string{
		"room_number": roomNumber,
		"status":      status,
	})
	return nil
}

func (s *service) GetLiveStatus() ([]domain.RoomsStatus, error) {
	return s.repo.FetchAllRoomStatuses()
}

func (s *service) RequestAmenity(guestID int, roomNumber, item string, qty int) error {
	req := &domain.AmenityRequest{
		GuestID:    guestID,
		RoomNumber: roomNumber,
		ItemName:   item,
		Quantity:   qty,
		Status:     "PENDING",
		CreatedAt:  time.Now(),
	}
	// Save to DB
	err := s.repo.SaveAmenityRequest(req)

	// Broadcast "New Task" event
	if err == nil {
		s.hub.BroadcastToStaff("NEW_TASK", req)
	}
	return err
}

func (s *service) ReportIssue(roomNumber, issueType, desc string) error {
	ticket := &domain.MaintenanceTicket{
		RoomNumber:  roomNumber,
		IssueType:   issueType,
		Description: desc,
		Priority:    "NORMAL",
		Status:      "OPEN",
		ReportedAt:  time.Now(),
	}
	err := s.repo.SaveTicket(ticket)

	if err == nil {
		s.hub.BroadcastToStaff("NEW_TICKET", ticket)
	}
	return err
}

func (s *service) GetAmenityRequests() ([]domain.AmenityRequest, error) {
	return s.repo.FetchAmenityRequests()
}

func (s *service) GetMaintenanceTickets() ([]domain.MaintenanceTicket, error) {
	return s.repo.FetchMaintenanceTickets()
}

func (s *service) MarkAmenityDelivered(id int) error {
	return s.repo.UpdateAmenityStatus(id, "DELIVERED")
}

func (s *service) ResolveTicket(id int) error {
	return s.repo.UpdateTicketStatus(id, "RESOLVED")
}

