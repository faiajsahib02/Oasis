package laundry

import (
	"encoding/json"
	"net/http"
	"oasis/backend/domain"
	"oasis/backend/util"
	"strconv"
)

// POST /laundry/requests/{id}/items
func (h *Handler) AddItems(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid Request ID")
		return
	}

	var payload domain.AddItemsPayload

	// Decode logic
	err = json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid payload format")
		return
	}

	// Validation: Don't allow adding empty lists
	if len(payload.Items) == 0 {
		util.SendError(w, http.StatusBadRequest, "No items provided")
		return
	}

	// Call Service
	err = h.svc.AddItemsToRequest(id, payload.Items)
	if err != nil {
		// You might want to log the error here: fmt.Println(err)
		util.SendError(w, http.StatusInternalServerError, "Error processing items")
		return
	}
	
	util.SendData(w, http.StatusOK, "Items added successfully")
}

// PATCH /laundry/requests/{id}/status
func (h *Handler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid Request ID")
		return
	}

	status := r.URL.Query().Get("status") // e.g. ?status=READY
	
	if status == "" {
		util.SendError(w, http.StatusBadRequest, "Status parameter is required")
		return
	}

	err = h.svc.UpdateStatus(id, status)
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Error updating status")
		return
	}
	
	util.SendData(w, http.StatusOK, "Status updated successfully")
}

// GET /laundry/requests/all (Staff Feed)
func (h *Handler) GetAllRequests(w http.ResponseWriter, r *http.Request) {
	requests, err := h.svc.GetAllRequests()
	if err != nil {
		util.SendError(w, http.StatusInternalServerError, "Failed to fetch requests")
		return
	}
	util.SendData(w, http.StatusOK, requests)
}
