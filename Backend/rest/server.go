package rest

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"ocean-paradise/backend/config"
	"ocean-paradise/backend/rest/handlers/guest"
	"ocean-paradise/backend/rest/handlers/housekeeping"
	"ocean-paradise/backend/rest/handlers/invoice"
	"ocean-paradise/backend/rest/handlers/laundry"
	"ocean-paradise/backend/rest/handlers/restaurant"
	"ocean-paradise/backend/rest/handlers/room"
	"ocean-paradise/backend/rest/handlers/staff"
	middleware "ocean-paradise/backend/rest/middlewares"
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
