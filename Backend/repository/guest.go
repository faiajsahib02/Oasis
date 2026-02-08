package repository

import (
	"database/sql"
	"fmt"

	"oasis/backend/domain"
	"oasis/backend/guest"

	"github.com/jmoiron/sqlx"
)

// GuestRepo implements the guest.GuestRepo interface

type GuestRepo interface {
	guest.GuestRepo
}
type guestRepo struct {
	db *sqlx.DB
}

func NewGuestRepo(db *sqlx.DB) GuestRepo {
	return &guestRepo{
		db: db,
	}
}

func (r guestRepo) Create(g domain.Guest) (*domain.Guest, error) {
	query := `
	INSERT INTO guests (
		name, 
		phone_number, 
		room_number,
		check_in_date,
		check_out_date,
		created_at
	) VALUES (
		:name, 
		:phone_number, 
		:room_number,
		:check_in_date,
		:check_out_date,
		:created_at
	) RETURNING id
	`

	// Execute named query
	var guestID int
	rows, err := r.db.NamedQuery(query, g)
	if err != nil {
		fmt.Println("Error creating guest:", err)
		return nil, err
	}
	defer rows.Close()

	if rows.Next() {
		if err := rows.Scan(&guestID); err != nil {
			return nil, err
		}
	}

	g.ID = guestID
	return &g, nil
}

// Find is used for Login (Room Number + Phone Number)
func (r *guestRepo) Find(roomNumber, phoneNumber string) (*domain.Guest, error) {
	var g domain.Guest
	query := `
	SELECT id, name, phone_number, room_number, check_in_date, check_out_date, created_at
	FROM guests 
	WHERE room_number = $1 AND phone_number = $2 
	LIMIT 1
	`

	err := r.db.Get(&g, query, roomNumber, phoneNumber)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // no guest found
		}
		return nil, err
	}

	return &g, nil
}

// FindByID is used for the Dashboard (Get Guest Info)
func (r *guestRepo) FindByID(id int) (*domain.Guest, error) {
	var g domain.Guest
	query := `
	SELECT id, name, phone_number, room_number, check_in_date, check_out_date, created_at
	FROM guests 
	WHERE id = $1
	LIMIT 1
	`

	err := r.db.Get(&g, query, id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // no guest found
		}
		return nil, err
	}

	return &g, nil
}

// FindByRoomNumber is used for Staff Checkout (Get Guest by Room Number only)
func (r *guestRepo) FindByRoomNumber(roomNumber string) (*domain.Guest, error) {
	var g domain.Guest
	query := `
	SELECT id, name, phone_number, room_number, check_in_date, check_out_date, created_at
	FROM guests 
	WHERE room_number = $1
	ORDER BY created_at DESC
	LIMIT 1
	`

	err := r.db.Get(&g, query, roomNumber)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // no guest found
		}
		return nil, err
	}

	return &g, nil
}

