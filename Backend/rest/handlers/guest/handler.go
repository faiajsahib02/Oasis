package guest

import (
	"oasis/backend/config"
)

type Handler struct {
	// Changed from *config.Config to *middleware.Middlewares
	cnf *config.Config
	svc Service
}

// Update constructor to accept middlewares
func NewHandler(cnf *config.Config, svc Service) *Handler {
	return &Handler{
		cnf: cnf,
		svc: svc,
	}
}

