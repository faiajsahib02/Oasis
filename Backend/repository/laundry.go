package repository

import (
	"database/sql"
	"fmt"

	"oasis/backend/domain"
	"oasis/backend/laundry"

	"github.com/jmoiron/sqlx"
)

type LaundryRepo interface {
	laundry.LaundryRepo
}

type laundryRepo struct {
	db *sqlx.DB
}

func NewLaundryRepo(db *sqlx.DB) LaundryRepo {
	return &laundryRepo{
		db: db,
	}
}

func (r *laundryRepo) FetchMenu() ([]domain.MenuItem, error) {
	var items []domain.MenuItem
	query := `SELECT id, name, price, is_dry_clean FROM laundry_items ORDER BY name ASC`

	// Removed Context
	err := r.db.Select(&items, query)
	if err != nil {
		return nil, err
	}
	return items, nil
}

func (r *laundryRepo) SaveRequest(req *domain.ServiceRequest) error {
	query := `
	INSERT INTO laundry_requests (
		guest_id, room_number, notes, status, total_price, created_at
	) VALUES (
		:guest_id, :room_number, :notes, :status, :total_price, :created_at
	) RETURNING id
	`

	// Removed Context
	rows, err := r.db.NamedQuery(query, req)
	if err != nil {
		return fmt.Errorf("failed to insert laundry request: %w", err)
	}
	defer rows.Close()

	if rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			return err
		}
		req.ID = id
	}
	return nil
}

func (r *laundryRepo) FetchRequestsByGuest(guestID int) ([]domain.ServiceRequest, error) {
	var requests []domain.ServiceRequest
	query := `
	SELECT id, guest_id, room_number, notes, status, total_price, created_at 
	FROM laundry_requests 
	WHERE guest_id = $1 
	ORDER BY created_at DESC
	`

	// Removed Context
	err := r.db.Select(&requests, query, guestID)
	if err != nil {
		if err == sql.ErrNoRows {
			return []domain.ServiceRequest{}, nil
		}
		return nil, err
	}
	return requests, nil
}

// SaveItemsAndUpdateTotal does two things
func (r *laundryRepo) SaveItemsAndUpdateTotal(reqID int, items []domain.RequestItem, total float64) error {
	// 1. Insert the items one by one
	queryItems := `INSERT INTO laundry_request_items (request_id, item_id, quantity, snap_price) VALUES ($1, $2, $3, $4)`
	for _, item := range items {
		_, err := r.db.Exec(queryItems, item.RequestID, item.ItemID, item.Quantity, item.SnapPrice)
		if err != nil {
			return err
		}
	}

	// 2. Update the parent request bill
	queryUpdate := `UPDATE laundry_requests SET total_price = $1, status = 'WASHING' WHERE id = $2`
	_, err := r.db.Exec(queryUpdate, total, reqID)
	return err
}

func (r *laundryRepo) UpdateStatus(reqID int, status string) error {
	query := `UPDATE laundry_requests SET status = $1 WHERE id = $2`
	_, err := r.db.Exec(query, status, reqID)
	return err
}

func (r *laundryRepo) GetAllRequests() ([]domain.ServiceRequest, error) {
	// Staff needs to see EVERYONE'S laundry
	var requests []domain.ServiceRequest
	query := `SELECT * FROM laundry_requests ORDER BY created_at DESC`
	err := r.db.Select(&requests, query)
	return requests, err
}

