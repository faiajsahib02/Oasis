package repository

import (
	"database/sql"
	"oasis/backend/staff" // Replace with your path
	"github.com/jmoiron/sqlx"
	"oasis/backend/domain"
)

type StaffRepo interface {
	staff.Repository
}

type staffRepo struct {
	db *sqlx.DB
}

func NewStaffRepo(db *sqlx.DB) StaffRepo {
	return &staffRepo{db: db}
}

func (r *staffRepo) FindByID(staffID int) (*domain.Staff, error) {
	var s domain.Staff
	query := `SELECT id, name, password, role FROM staff WHERE id = $1 LIMIT 1`
	
	err := r.db.Get(&s, query, staffID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &s, nil
}
