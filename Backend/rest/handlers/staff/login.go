package staff



import (
	"encoding/json"
	"net/http"
	"oasis/backend/config"
	"oasis/backend/staff"
	"oasis/backend/util"
)

type Handler struct {
	cnf *config.Config
	svc staff.Service
}

func NewHandler(cnf *config.Config, svc staff.Service) *Handler {
	return &Handler{cnf: cnf, svc: svc}
}

// Request Payload
type ReqLogin struct {
	StaffID  int    `json:"staff_id"`
	Password string `json:"password"`
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req ReqLogin
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		util.SendError(w, http.StatusBadRequest, "Invalid body")
		return
	}

	stf, token, err := h.svc.Login(req.StaffID, req.Password)
	if err != nil {
		util.SendError(w, http.StatusUnauthorized, "Invalid ID or Password")
		return
	}

	// Return Token + Staff Info
	resp := map[string]interface{}{
		"token": token,
		"staff": stf,
	}
	util.SendData(w, http.StatusOK, resp)
}
