package domain

import "time"

// MenuItem represents a specific clothing item available for cleaning
type MenuItem struct {
	ID         int     `json:"id" db:"id"`
	Name       string  `json:"name" db:"name"`
	Price      float64 `json:"price" db:"price"`
	IsDryClean bool    `json:"is_dry_clean" db:"is_dry_clean"`
}

// ServiceRequest represents a Guest's order to pick up laundry
type ServiceRequest struct {
	ID         int       `json:"id" db:"id"`
	GuestID    int       `json:"guest_id" db:"guest_id"`
	RoomNumber string    `json:"room_number" db:"room_number"`
	Notes      string    `json:"notes" db:"notes"`
	Status     string    `json:"status" db:"status"` // PENDING, COLLECTED, WASHING, DELIVERED
	TotalPrice float64   `json:"total_price" db:"total_price"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// ... existing structs ...

// RequestItem represents a specific line item (e.g., 3 Shirts)
type RequestItem struct {
	ID        int     `json:"id" db:"id"`
	RequestID int     `json:"request_id" db:"request_id"`
	ItemID    int     `json:"item_id" db:"item_id"`
	ItemName  string  `json:"item_name" db:"name"` // Joined from items table
	Quantity  int     `json:"quantity" db:"quantity"`
	SnapPrice float64 `json:"snap_price" db:"snap_price"`
}

// AddItemInput represents a single item being added to a request
type AddItemInput struct {
	ItemID   int `json:"item_id"`
	Quantity int `json:"quantity"`
}

// AddItemsPayload is what the Frontend sends to the Backend
type AddItemsPayload struct {
	Items []AddItemInput `json:"items"`
}

