package domain

type RoomStatus string

const (
	RoomStatusVacant   RoomStatus = "VACANT"
	RoomStatusOccupied RoomStatus = "OCCUPIED"
	RoomStatusCleaning RoomStatus = "CLEANING"
)

type Room struct {
	ID         int        `json:"id" db:"id"`
	RoomNumber string     `json:"room_number" db:"room_number"`
	Type       string     `json:"type" db:"type"`
	Status     RoomStatus `json:"status" db:"status"`
	Price      float64    `json:"price" db:"price"`
}

