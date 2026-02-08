package repository

import (
	"database/sql"
	"oasis/backend/domain" // Replace with your path
	"oasis/backend/restaurant"

	"github.com/jmoiron/sqlx"
)

type RestaurantRepo interface {
	restaurant.Repository
}

type restaurantRepo struct {
	db *sqlx.DB
}

func NewRestaurantRepo(db *sqlx.DB) RestaurantRepo {
	return &restaurantRepo{db: db}
}

func (r *restaurantRepo) FetchCategories() ([]domain.MenuCategory, error) {
	var cats []domain.MenuCategory
	err := r.db.Select(&cats, "SELECT * FROM menu_categories ORDER BY priority ASC")
	return cats, err
}

func (r *restaurantRepo) FetchAllItems() ([]domain.RestaurantMenuItem, error) {
	var items []domain.RestaurantMenuItem
	err := r.db.Select(&items, "SELECT * FROM menu_items WHERE is_deleted = false")
	return items, err
}

func (r *restaurantRepo) SaveOrder(order *domain.Order, items []domain.RestaurantOrderItemInput) error {
	// 1. Insert Order
	queryOrder := `
		INSERT INTO restaurant_orders (guest_id, room_number, notes, status, total_price, created_at)
		VALUES (:guest_id, :room_number, :notes, :status, :total_price, :created_at)
		RETURNING id`

	// Create map for price lookup
	allMenu, _ := r.FetchAllItems()
	priceMap := make(map[int]float64)
	for _, m := range allMenu {
		priceMap[m.ID] = m.Price
	}

	var total float64

	// Prepare items and calc total
	// Note: This logic assumes we have a transaction, simplifying for MVP
	rows, err := r.db.NamedQuery(queryOrder, order)
	if err != nil {
		return err
	}
	if rows.Next() {
		rows.Scan(&order.ID)
	}
	rows.Close()

	// 2. Insert Items & Calc Total
	queryItem := `INSERT INTO restaurant_order_items (order_id, item_id, quantity, snap_price) VALUES ($1, $2, $3, $4)`

	for _, item := range items {
		price := priceMap[item.ItemID]
		lineTotal := price * float64(item.Quantity)
		total += lineTotal

		r.db.Exec(queryItem, order.ID, item.ItemID, item.Quantity, price)
	}

	// 3. Update Order Total
	r.db.Exec("UPDATE restaurant_orders SET total_price = $1 WHERE id = $2", total, order.ID)
	order.TotalPrice = total

	return nil
}

func (r *restaurantRepo) FetchOrdersByGuest(guestID int) ([]domain.Order, error) {
	var orders []domain.Order
	err := r.db.Select(&orders, "SELECT * FROM restaurant_orders WHERE guest_id = $1 ORDER BY created_at DESC", guestID)
	if err == sql.ErrNoRows {
		return []domain.Order{}, nil
	}
	return orders, err
}

func (r *restaurantRepo) UpdateStatus(orderID int, status string) error {
	_, err := r.db.Exec("UPDATE restaurant_orders SET status = $1 WHERE id = $2", status, orderID)
	return err
}

// Add New Item
func (r *restaurantRepo) CreateItem(item *domain.RestaurantMenuItem) error {
	query := `
		INSERT INTO menu_items (category_id, name, description, price, image_url, is_available)
		VALUES (:category_id, :name, :description, :price, :image_url, :is_available)
		RETURNING id`

	rows, err := r.db.NamedQuery(query, item)
	if err != nil {
		return err
	}
	if rows.Next() {
		rows.Scan(&item.ID)
	}
	return rows.Close()
}

// Edit Existing Item
func (r *restaurantRepo) UpdateItem(item *domain.RestaurantMenuItem) error {
	query := `
		UPDATE menu_items 
		SET category_id=:category_id, name=:name, description=:description, 
		    price=:price, image_url=:image_url, is_available=:is_available
		WHERE id=:id`
	_, err := r.db.NamedExec(query, item)
	return err
}

// Delete Item
func (r *restaurantRepo) DeleteItem(id int) error {
	_, err := r.db.Exec("UPDATE menu_items SET is_deleted = true WHERE id = $1", id)
	return err
}

// Fetch All Active Orders (For Kitchen Display)
func (r *restaurantRepo) FetchActiveOrders() ([]domain.OrderWithItems, error) {
	var orders []domain.Order
	// Get everything NOT delivered
	query := `SELECT * FROM restaurant_orders WHERE status != 'DELIVERED' ORDER BY created_at ASC`
	err := r.db.Select(&orders, query)
	if err != nil {
		return nil, err
	}

	result := []domain.OrderWithItems{}

	for _, o := range orders {
		// Fetch Items for this order
		var items []domain.OrderItemDetail
		qItems := `
			SELECT m.name, i.quantity, i.snap_price 
			FROM restaurant_order_items i
			JOIN menu_items m ON i.item_id = m.id
			WHERE i.order_id = $1`

		err = r.db.Select(&items, qItems, o.ID)
		if err != nil {
			return nil, err
		}

		result = append(result, domain.OrderWithItems{
			Order: o,
			Items: items,
		})
	}

	return result, nil
}

