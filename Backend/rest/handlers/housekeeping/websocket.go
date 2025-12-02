package housekeeping

import (
	"net/http"
)

// GET /ws
// The Frontend calls this to connect: new WebSocket("ws://localhost:8080/ws")
func (h *Handler) ServeWebSocket(w http.ResponseWriter, r *http.Request) {
	h.hub.ServeWs(w, r)
}
