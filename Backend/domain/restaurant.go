package domain

import "time"

// Database Entities
type MenuCategory struct {
	ID       int    `json:"id" db:"id"`
	Name     string `json:"name" db:"name"`
	Priority int    `json:"priority" db:"priority"`
}

type RestaurantMenuItem struct {
	ID          int     `json:"id" db:"id"`
	CategoryID  int     `json:"category_id" db:"category_id"`
	Name        string  `json:"name" db:"name"`
	Description string  `json:"description" db:"description"`
	Price       float64 `json:"price" db:"price"`
	IsAvailable bool    `json:"is_available" db:"is_available"`
	ImageURL    string  `json:"image_url" db:"image_url"`
	IsDeleted   bool    `json:"-" db:"is_deleted"`
}

type Order struct {
	ID         int       `json:"id" db:"id"`
	GuestID    int       `json:"guest_id" db:"guest_id"`
	RoomNumber string    `json:"room_number" db:"room_number"`
	Notes      string    `json:"notes" db:"notes"`
	Status     string    `json:"status" db:"status"`
	TotalPrice float64   `json:"total_price" db:"total_price"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// Complex Structs for API Responses
type CategoryWithItems struct {
	Category MenuCategory         `json:"category"`
	Items    []RestaurantMenuItem `json:"items"`
}

type RestaurantOrderItemInput struct {
	ItemID   int `json:"item_id"`
	Quantity int `json:"quantity"`
}

// Response for Kitchen Display
type OrderItemDetail struct {
	Name     string  `json:"name" db:"name"`
	Quantity int     `json:"quantity" db:"quantity"`
	Price    float64 `json:"price" db:"snap_price"`
}

type OrderWithItems struct {
	Order
	Items []OrderItemDetail `json:"items"`
}
