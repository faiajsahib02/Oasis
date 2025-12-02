package staff

import (
	"errors"
	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/util" // Replace with your path
)

type service struct {
	repo   Repository
	jwtKey string
}

func NewService(repo Repository, jwtKey string) Service {
	return &service{
		repo:   repo,
		jwtKey: jwtKey,
	}
}

func (s *service) Login(staffID int, password string) (*domain.Staff, string, error) {
	// 1. Find Staff
	staff, err := s.repo.FindByID(staffID)
	if err != nil {
		return nil, "", errors.New("staff not found")
	}

	// 2. Check Password (Simple string comparison for MVP)
	// In production, use bcrypt.CompareHashAndPassword()
	if staff.Password != password {
		return nil, "", errors.New("invalid password")
	}

	// 3. Generate Token
	// We reuse the Payload struct. We put "STAFF" in RoomNumber field as a hack,
	// or ideally, you add a 'Role' field to your Payload struct.
	payload := util.Payload{
		Sub:         staff.ID,
		Name:        staff.Name,
		PhoneNumber: "STAFF",    // Placeholder
		RoomNumber:  staff.Role, // Storing Role here so frontend knows permissions
	}

	token, err := util.CreateJwt(s.jwtKey, payload)
	if err != nil {
		return nil, "", err
	}

	return staff, token, nil
}
