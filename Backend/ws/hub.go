package ws

import (
	"fmt"
	"net/http"
	"sync"
)

// Message defines what we send over the wire
type Message struct {
	Type    string      `json:"type"`    // e.g., "ROOM_UPDATE", "NEW_TICKET"
	Payload interface{} `json:"payload"` // The actual data (Room #, Status)
}

// Hub maintains the set of active clients and broadcasts messages
type Hub struct {
	// Registered clients (Staff members)
	clients map[*Client]bool

	// Inbound messages from the system to broadcast
	broadcast chan Message

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Lock for thread safety
	mu sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			fmt.Println("New Staff Connected to WebSocket")

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()
			fmt.Println("Staff Disconnected")

		case message := <-h.broadcast:
			// Send the message to ALL connected staff
			h.mu.Lock()
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

// BroadcastToStaff is the method your Services will call
func (h *Hub) BroadcastToStaff(msgType string, data interface{}) {
	msg := Message{
		Type:    msgType,
		Payload: data,
	}
	h.broadcast <- msg
}

// ServeWs handles websocket requests - implements WebSocketHub interface
func (h *Hub) ServeWs(w http.ResponseWriter, r *http.Request) {
	ServeWs(h, w, r)
}

