package guest

import (
	"encoding/json"
	"fmt"
	"net/http"

	"ocean-paradise/backend/util"
)

type ReqLogin struct {
	RoomNumber  string `json:"room_number"`
	PhoneNumber string `json:"phone_number"`
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req ReqLogin
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&req)
	if err != nil {
		fmt.Println(err)
		util.SendError(w, http.StatusBadRequest, "Invalid Request Data")
		return
	}

	// Call the Service using Room Number and Phone Number
	gst, err := h.svc.Find(req.RoomNumber, req.PhoneNumber)
	if err != nil {
		// If error (or nil guest), return Unauthorized
		util.SendError(w, http.StatusUnauthorized, "Invalid room number or phone number")
		return
	}

	// Create JWT
	// Note: You may need to update your util.Payload struct to accept 'Name' and 'RoomNumber'
	accessToken, err := util.CreateJwt(h.cnf.JwtSecretKey, util.Payload{
		Sub:         gst.ID,
		Name:        gst.Name,
		PhoneNumber: gst.PhoneNumber,
		RoomNumber:  req.RoomNumber,
	})

	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Internal Server Error")
	}

	util.SendData(w, http.StatusOK, accessToken)
}
