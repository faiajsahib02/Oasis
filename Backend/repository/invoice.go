package repository

import (
	"oasis/backend/domain"
	"github.com/jmoiron/sqlx"
)

type InvoiceRepo interface {
	CreateInvoiceTx(inv *domain.Invoice) error
}

type invoiceRepo struct {
	db *sqlx.DB
}

func NewInvoiceRepo(db *sqlx.DB) InvoiceRepo {
	return &invoiceRepo{db: db}
}

// CreateInvoiceTx performs the Grand Checkout atomically
func (r *invoiceRepo) CreateInvoiceTx(inv *domain.Invoice) error {
	// 1. START TRANSACTION (The "ACID" Boundary)
	tx, err := r.db.Beginx()
	if err != nil {
		return err
	}
	// Safety Net: If function panics or errors, Rollback changes
	defer tx.Rollback() 

	// 2. Insert Invoice Record
	queryInv := `INSERT INTO invoices (guest_id, room_number, room_charge, laundry_charge, restaurant_charge, total_amount) 
	             VALUES (:guest_id, :room_number, :room_charge, :laundry_charge, :restaurant_charge, :total_amount)`
	_, err = tx.NamedExec(queryInv, inv)
	if err != nil { return err }

	// 3. Mark Laundry as PAID
	// Note: We are touching other module's tables here. 
	// In strict Microservices, this is forbidden (you'd use API calls). 
	// In Modular Monolith with shared DB, this is acceptable for transactions.
	_, err = tx.Exec("UPDATE laundry_requests SET status = 'PAID' WHERE guest_id = $1 AND status != 'PAID'", inv.GuestID)
	if err != nil { return err }

	// 4. Mark Restaurant as PAID
	_, err = tx.Exec("UPDATE restaurant_orders SET status = 'PAID' WHERE guest_id = $1 AND status != 'PAID'", inv.GuestID)
	if err != nil { return err }

	// 5. Checkout Guest
	_, err = tx.Exec("UPDATE guests SET status = 'CHECKED_OUT' WHERE id = $1", inv.GuestID)
	if err != nil { return err }

	// 6. Mark Room as DIRTY (Trigger Housekeeping!)
	// Assuming inv has RoomNumber populated
	// We might need to fetch RoomNumber from guest table inside TX if not present
	// For MVP, assuming we passed it in.
	
	// 7. COMMIT (Save everything permanently)
	return tx.Commit()
}
