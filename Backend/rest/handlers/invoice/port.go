package invoice

import "ocean-paradise/backend/domain"

// Service defines the methods the Handler needs from the Business Logic layer.
type Service interface {
	GeneratePreview(guestID int) (*domain.InvoicePreview, error)
	GeneratePreviewByRoom(roomNumber string) (*domain.InvoicePreview, error)
	ProcessCheckout(guestID int) (*domain.Invoice, error)
	ProcessCheckoutByRoom(roomNumber string) (*domain.Invoice, error)
}
