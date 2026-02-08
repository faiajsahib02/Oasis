package rest

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"oasis/backend/config"
	"oasis/backend/rest/handlers/guest"
	"oasis/backend/rest/handlers/housekeeping"
	"oasis/backend/rest/handlers/invoice"
	"oasis/backend/rest/handlers/laundry"
	"oasis/backend/rest/handlers/restaurant"
	"oasis/backend/rest/handlers/room"
	"oasis/backend/rest/handlers/staff"
	middleware "oasis/backend/rest/middlewares"
)

type Server struct {
	cnf                 *config.Config
	guestHandler        *guest.Handler
	staffHandler        *staff.Handler
	roomHandler         *room.Handler
	laundryHandler      *laundry.Handler
	restaurantHandler   *restaurant.Handler
	housekeepingHandler *housekeeping.Handler
	invoiceHandler      *invoice.Handler
}

func NewServer(
	cnf *config.Config,
	guestHandler *guest.Handler,
	staffHandler *staff.Handler,
	roomHandler *room.Handler,
	laundryHandler *laundry.Handler,
	restaurantHandler *restaurant.Handler,
	housekeepingHandler *housekeeping.Handler,
	invoiceHandler *invoice.Handler,
) *Server {
	return &Server{
		cnf:                 cnf,
		guestHandler:        guestHandler,
		staffHandler:        staffHandler,
		roomHandler:         roomHandler,
		laundryHandler:      laundryHandler,
		restaurantHandler:   restaurantHandler,
		housekeepingHandler: housekeepingHandler,
		invoiceHandler:      invoiceHandler,
	}
}

func (server *Server) Start() {
	manager := middleware.NewManager()

	// Apply Global Middleware (like CORS)
	manager.Use(
		middleware.Cors,
	)

	mux := http.NewServeMux()

	// If your middleware manager wraps the mux for global middleware:
	wrappedMux := manager.WrapMux(mux)

	// Register Routes for Guest, Room, Staff, and Laundry modules
	server.guestHandler.RegisterRoutes(mux, manager)
	server.staffHandler.RegisterRoutes(mux, manager)
	server.roomHandler.RegisterRoutes(mux, manager)
	server.laundryHandler.RegisterRoutes(mux, manager)
	server.restaurantHandler.RegisterRoutes(mux, manager)
	server.housekeepingHandler.RegisterRoutes(mux, manager)
	server.invoiceHandler.RegisterRoutes(mux, manager)

	addr := ":" + strconv.Itoa(server.cnf.HttpPort)
	fmt.Println("Server running on port", addr)

	// Listen
	err := http.ListenAndServe(addr, wrappedMux)

	if err != nil {
		fmt.Println("Error starting the server", err)
		os.Exit(1)
	}
}

