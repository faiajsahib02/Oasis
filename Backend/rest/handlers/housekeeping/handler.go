package housekeeping

import (
	middleware "oasis/backend/rest/middlewares"
)

type Handler struct {
	middlewares *middleware.Middlewares
	svc         Service
	hub         WebSocketHub
}

func NewHandler(middlewares *middleware.Middlewares, svc Service, hub WebSocketHub) *Handler {
	return &Handler{
		middlewares: middlewares,
		svc:         svc,
		hub:         hub,
	}
}

