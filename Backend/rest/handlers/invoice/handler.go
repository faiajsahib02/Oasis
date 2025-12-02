package invoice

import (
	middleware "ocean-paradise/backend/rest/middlewares"
)

type Handler struct {
	middlewares *middleware.Middlewares
	svc         Service
}

func NewHandler(middlewares *middleware.Middlewares, svc Service) *Handler {
	return &Handler{
		middlewares: middlewares,
		svc:         svc,
	}
}
