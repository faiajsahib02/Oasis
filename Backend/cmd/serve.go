package cmd

import (
	"fmt"
	"os"

	"oasis/backend/config"
	"oasis/backend/guest"
	"oasis/backend/housekeeping"
	"oasis/backend/infra/db"
	"oasis/backend/invoice"
	"oasis/backend/laundry"
	"oasis/backend/repository"
	"oasis/backend/rest"
	"oasis/backend/restaurant"
	"oasis/backend/room"
	"oasis/backend/staff"
	"oasis/backend/ws"

	guesthandler "oasis/backend/rest/handlers/guest"
	housekeepinghandler "oasis/backend/rest/handlers/housekeeping"
	invoicehandler "oasis/backend/rest/handlers/invoice"
	laundryhandler "oasis/backend/rest/handlers/laundry"
	restauranthandler "oasis/backend/rest/handlers/restaurant"
	roomhandler "oasis/backend/rest/handlers/room"
	staffhandler "oasis/backend/rest/handlers/staff"
	middleware "oasis/backend/rest/middlewares"
)

func Serve() {
	// 1. Load Config
	cnf := config.GetConfig()

	// 2. Database Connection
	dbCon, err := db.NewConnection(cnf.DB)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// 3. Database Migrations
	err = db.MigrateDB(dbCon, "./migrations")
	if err != nil {
		fmt.Println("Failed to migrate database:", err)
		os.Exit(1)
	}

	// 4. Initialize WebSocket Hub
	hub := ws.NewHub()
	go hub.Run() // Run in background goroutine

	// 5. Initialize Repositories (Adapters)
	guestRepo := repository.NewGuestRepo(dbCon)
	staffRepo := repository.NewStaffRepo(dbCon)
	roomRepo := repository.NewRoomRepo(dbCon)
	laundryRepo := repository.NewLaundryRepo(dbCon)
	restaurantRepo := repository.NewRestaurantRepo(dbCon)
	housekeepingRepo := repository.NewHousekeepingRepo(dbCon)

	// 6. Initialize Services (Domain Logic)
	guestSvc := guest.NewService(guestRepo)
	staffSvc := staff.NewService(staffRepo, cnf.JwtSecretKey)
	roomSvc := room.NewService(roomRepo)
	laundrySvc := laundry.NewService(laundryRepo)
	restaurantSvc := restaurant.NewService(restaurantRepo)
	housekeepingSvc := housekeeping.NewService(housekeepingRepo, hub)

	// Initialize Invoice Repository and Service
	invoiceRepo := repository.NewInvoiceRepo(dbCon)
	invoiceSvc := invoice.NewService(invoiceRepo, guestSvc, roomSvc, laundrySvc, restaurantSvc)

	// 7. Initialize Middlewares
	middlewares := middleware.NewMiddlewares(cnf)

	// 8. Initialize Handlers (Ports)
	guestHandler := guesthandler.NewHandler(cnf, guestSvc)
	staffHandler := staffhandler.NewHandler(cnf, staffSvc)
	roomHandler := roomhandler.NewHandler(cnf, roomSvc)
	laundryHandler := laundryhandler.NewHandler(middlewares, laundrySvc)
	restaurantHandler := restauranthandler.NewHandler(middlewares, restaurantSvc)
	housekeepingHandler := housekeepinghandler.NewHandler(middlewares, housekeepingSvc, hub)
	invoiceHandler := invoicehandler.NewHandler(middlewares, invoiceSvc)

	// 9. Initialize Server
	server := rest.NewServer(
		cnf,
		guestHandler,
		staffHandler,
		roomHandler,
		laundryHandler,
		restaurantHandler,
		housekeepingHandler,
		invoiceHandler,
	)

	server.Start()
}

