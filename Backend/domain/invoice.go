package domain

import "time"

type Invoice struct {
	ID               int       `json:"id" db:"id"`
	GuestID          int       `json:"guest_id" db:"guest_id"`
	RoomNumber       string    `json:"room_number" db:"room_number"`
	RoomCharge       float64   `json:"room_charge" db:"room_charge"`
	LaundryCharge    float64   `json:"laundry_charge" db:"laundry_charge"`
	RestaurantCharge float64   `json:"restaurant_charge" db:"restaurant_charge"`
	TotalAmount      float64   `json:"total_amount" db:"total_amount"`
	PaymentMethod    string    `json:"payment_method" db:"payment_method"`
	CreatedAt        time.Time `json:"created_at" db:"created_at"`
}

// Helper for the Frontend Preview
type InvoicePreview struct {
	GuestName        string  `json:"guest_name"`
	StayDays         int     `json:"stay_days"`
	RoomTotal        float64 `json:"room_total"`
	LaundryTotal     float64 `json:"laundry_total"`
	RestaurantTotal  float64 `json:"restaurant_total"`
	GrandTotal       float64 `json:"grand_total"`
}