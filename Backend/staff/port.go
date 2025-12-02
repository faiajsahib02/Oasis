package staff

import "ocean-paradise/backend/domain"




// Service Port
type Service interface {
	Login(staffID int, password string) (*domain.Staff, string, error) // Returns Staff + Token
}

// Repository Port
type Repository interface {
	FindByID(staffID int) (*domain.Staff, error)
}