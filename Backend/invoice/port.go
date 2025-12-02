package invoice

import "ocean-paradise/backend/domain"

// Service Port (Inbound)
// This is what the API Handler calls
type Service interface {
	// 1. Read-Only: Calculates the bill but saves nothing
	GeneratePreview(guestID int) (*domain.InvoicePreview, error)
	GeneratePreviewByRoom(roomNumber string) (*domain.InvoicePreview, error)

	// 2. Write: Performs the ACID transaction to close the stay
	ProcessCheckout(guestID int) (*domain.Invoice, error)
	ProcessCheckoutByRoom(roomNumber string) (*domain.Invoice, error)
}

// Repository Port (Outbound)
// This is what the Database Adapter implements
type Repository interface {
	// The Transactional Save
	CreateInvoiceTx(inv *domain.Invoice) error
}
