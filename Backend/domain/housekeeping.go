package domain

import "time"

// AmenityRequest (e.g., "I need 2 Towels")
type AmenityRequest struct {
	ID         int       `json:"id" db:"id"`
	GuestID    int       `json:"guest_id" db:"guest_id"`
	RoomNumber string    `json:"room_number" db:"room_number"`
	ItemName   string    `json:"item_name" db:"item_name"`
	Quantity   int       `json:"quantity" db:"quantity"`
	Status     string    `json:"status" db:"status"` // PENDING, DELIVERED
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// MaintenanceTicket (e.g., "Broken AC")
type MaintenanceTicket struct {
	ID          int       `json:"id" db:"id"`
	RoomNumber  string    `json:"room_number" db:"room_number"`
	IssueType   string    `json:"issue_type" db:"issue_type"`
	Description string    `json:"description" db:"description"`
	Priority    string    `json:"priority" db:"priority"`
	Status      string    `json:"status" db:"status"`
	ReportedAt  time.Time `json:"created_at" db:"created_at"`
}

// RoomsStatus for the Live Map
type RoomsStatus struct {
	RoomNumber string `json:"room_number" db:"room_number"`
	Status     string `json:"status" db:"housekeeping_status"` // CLEAN, DIRTY, REQUESTED_CLEANING
}
