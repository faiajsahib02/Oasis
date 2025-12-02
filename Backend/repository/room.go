package repository

import (
	"database/sql"
	"fmt"
	
	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/room"

	"github.com/jmoiron/sqlx"
)

// RoomRepo matches the interface defined in internal/room/port.go
type RoomRepo interface {
	room.RoomRepo
}

type roomRepo struct {
	db *sqlx.DB
}

func NewRoomRepo(db *sqlx.DB) RoomRepo {
	return &roomRepo{
		db: db,
	}
}

func (r *roomRepo) Create(rm domain.Room) (*domain.Room, error) {
	query := `
	INSERT INTO rooms (
		room_number, 
		type, 
		status, 
		price
	) VALUES (
		:room_number, 
		:type, 
		:status, 
		:price
	) RETURNING id
	`
	
	var roomID int
	// NamedQuery is great for inserting structs
	rows, err := r.db.NamedQuery(query, rm)
	if err != nil {
		fmt.Println("Error creating room:", err)
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(&roomID); err != nil {
			return nil, err
		}
	}

	rm.ID = roomID
	return &rm, nil
}

// Find retrieves a room by its visible Number (e.g. "101")
func (r *roomRepo) Find(roomNumber string) (*domain.Room, error) {
	var rm domain.Room
	query := `
	SELECT id, room_number, type, status, price
	FROM rooms 
	WHERE room_number = $1
	LIMIT 1
	`

	err := r.db.Get(&rm, query, roomNumber)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Return nil if room doesn't exist
		}
		return nil, err
	}

	return &rm, nil
}

// FindByID retrieves a room by its primary key
func (r *roomRepo) FindByID(id string) (*domain.Room, error) {
	var rm domain.Room
	// Note: If you switched to Int IDs, change the query argument type here
	query := `
	SELECT id, room_number, type, status, price
	FROM rooms 
	WHERE id = $1
	LIMIT 1
	`

	err := r.db.Get(&rm, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &rm, nil
}

func (r *roomRepo) GetAll(status string) ([]domain.Room, error) {
	var rooms []domain.Room
	var err error

	// Dynamic Query: Check if we are filtering or fetching all
	if status == "" {
		query := `SELECT id, room_number, type, status, price FROM rooms`
		err = r.db.Select(&rooms, query)
	} else {
		query := `SELECT id, room_number, type, status, price FROM rooms WHERE status = $1`
		err = r.db.Select(&rooms, query, status)
	}

	if err != nil {
		return nil, err
	}

	return rooms, nil
}