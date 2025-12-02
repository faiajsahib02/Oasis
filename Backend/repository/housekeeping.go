package repository

import (
	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/housekeeping"

	"github.com/jmoiron/sqlx"
)

type HousekeepingRepo interface {
	housekeeping.Repository
}

type hkRepo struct {
	db *sqlx.DB
}

func NewHousekeepingRepo(db *sqlx.DB) HousekeepingRepo {
	return &hkRepo{db: db}
}

func (r *hkRepo) UpdateRoomStatus(roomNumber, status string) error {
	_, err := r.db.Exec("UPDATE rooms SET housekeeping_status = $1 WHERE room_number = $2", status, roomNumber)
	return err
}

func (r *hkRepo) FetchAllRoomStatuses() ([]domain.RoomsStatus, error) {
	var rooms []domain.RoomsStatus
	err := r.db.Select(&rooms, `SELECT room_number, COALESCE(housekeeping_status, 'CLEAN') as housekeeping_status FROM rooms ORDER BY room_number ASC`)
	return rooms, err
}

func (r *hkRepo) SaveAmenityRequest(req *domain.AmenityRequest) error {
	query := `INSERT INTO amenity_requests (guest_id, room_number, item_name, quantity, status, created_at) 
	          VALUES (:guest_id, :room_number, :item_name, :quantity, :status, :created_at)`
	_, err := r.db.NamedExec(query, req)
	return err
}

func (r *hkRepo) SaveTicket(ticket *domain.MaintenanceTicket) error {
	query := `INSERT INTO maintenance_tickets (room_number, issue_type, description, priority, status, created_at) 
	          VALUES (:room_number, :issue_type, :description, :priority, :status, :created_at)`
	_, err := r.db.NamedExec(query, ticket)
	return err
}

func (r *hkRepo) FetchAmenityRequests() ([]domain.AmenityRequest, error) {
	var requests []domain.AmenityRequest
	err := r.db.Select(&requests, "SELECT * FROM amenity_requests WHERE status = 'PENDING' ORDER BY created_at DESC")
	return requests, err
}

func (r *hkRepo) FetchMaintenanceTickets() ([]domain.MaintenanceTicket, error) {
	var tickets []domain.MaintenanceTicket
	err := r.db.Select(&tickets, "SELECT id, room_number, issue_type, description, priority, status, created_at FROM maintenance_tickets WHERE status != 'RESOLVED' ORDER BY priority DESC, created_at DESC")
	return tickets, err
}

func (r *hkRepo) UpdateAmenityStatus(id int, status string) error {
	_, err := r.db.Exec("UPDATE amenity_requests SET status = $1 WHERE id = $2", status, id)
	return err
}

func (r *hkRepo) UpdateTicketStatus(id int, status string) error {
	_, err := r.db.Exec("UPDATE maintenance_tickets SET status = $1 WHERE id = $2", status, id)
	return err
}
