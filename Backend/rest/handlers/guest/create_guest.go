package guest

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"ocean-paradise/backend/domain"
	"ocean-paradise/backend/util"
)

// ReqCreateGuest defines the JSON payload sent by the Front Desk staff
type ReqCreateGuest struct {
	Name         string `json:"name"`
	PhoneNumber  string `json:"phone_number"`
	RoomNumber   string `json:"room_number"`
	CheckInDate  string `json:"check_in_date"`  // Format: "2025-12-03"
	CheckOutDate string `json:"check_out_date"` // Format: "2025-12-05"
}

func (h *Handler) CreateGuest(w http.ResponseWriter, r *http.Request) {

	var req ReqCreateGuest
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Parse check-in date (default to today if not provided)
	var checkInDate time.Time
	if req.CheckInDate != "" {
		checkInDate, err = time.Parse("2006-01-02", req.CheckInDate)
		if err != nil {
			util.SendError(w, http.StatusBadRequest, "Invalid check-in date format. Use YYYY-MM-DD")
			return
		}
	} else {
		checkInDate = time.Now()
	}

	// Parse check-out date (required)
	var checkOutDate time.Time
	if req.CheckOutDate != "" {
		checkOutDate, err = time.Parse("2006-01-02", req.CheckOutDate)
		if err != nil {
			util.SendError(w, http.StatusBadRequest, "Invalid check-out date format. Use YYYY-MM-DD")
			return
		}
	} else {
		util.SendError(w, http.StatusBadRequest, "Check-out date is required")
		return
	}

	// Validate check-out is after check-in
	if !checkOutDate.After(checkInDate) {
		util.SendError(w, http.StatusBadRequest, "Check-out date must be after check-in date")
		return
	}

	// Map the Request DTO to the Domain Entity
	gst, err := h.svc.Create(domain.Guest{
		Name:         req.Name,
		PhoneNumber:  req.PhoneNumber,
		RoomNumber:   req.RoomNumber,
		CheckInDate:  checkInDate,
		CheckOutDate: checkOutDate,
		CreatedAt:    time.Now(),
	})

	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal server error: "+err.Error())
		return
	}

	util.SendData(w, http.StatusCreated, gst)
}
