package laundry


import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"ocean-paradise/backend/util" // Replace with your actual module
)

type ReqCreateRequest struct {
	RoomNumber string `json:"room_number"`
	Notes      string `json:"notes"`
}

func (h *Handler) CreateRequest(w http.ResponseWriter, r *http.Request) {
	// 1. Parse Body
	var req ReqCreateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// 2. Extract Guest ID from JWT
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	
	// Assuming you implemented the ParseJwtClaims helper in util
	claims, err := util.ParseJwtClaims(tokenString) 
	if err != nil {
		util.SendError(w, http.StatusUnauthorized, "Invalid token")
		return
	}
	guestID := claims.Sub 

	// 3. Call Service (Updated: No Context passed)
	ticket, err := h.svc.CreateRequest(guestID, req.RoomNumber, req.Notes)
	if err != nil {
		fmt.Println("Error creating laundry request:", err)
		util.SendError(w, http.StatusInternalServerError, "Failed to create request")
		return
	}

	util.SendData(w, http.StatusCreated, ticket)
}

func (h *Handler) GetHistory(w http.ResponseWriter, r *http.Request) {
	// Extract ID again
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, _ := util.ParseJwtClaims(tokenString) 
	
	// Updated: No Context passed
	history, err := h.svc.GetGuestRequests(claims.Sub)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Could not fetch history")
		return
	}
	util.SendData(w, http.StatusOK, history)
}