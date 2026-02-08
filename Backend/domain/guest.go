package domain

import "time"

type Guest struct {
	ID           int       `json:"id" db:"id"`
	Name         string    `json:"name" db:"name"`
	PhoneNumber  string    `json:"phone_number" db:"phone_number"`
	RoomNumber   string    `json:"room_number" db:"room_number"`
	CheckInDate  time.Time `json:"check_in_date" db:"check_in_date"`
	CheckOutDate time.Time `json:"check_out_date" db:"check_out_date"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

