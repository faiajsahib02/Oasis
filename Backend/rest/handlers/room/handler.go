package room

import (
	"ocean-paradise/backend/config"
)

type Handler struct {
	cnf *config.Config
	svc Service
}

func NewHandler(cnf *config.Config, svc Service) *Handler {
	return &Handler{
		cnf: cnf,
		svc: svc,
	}
}