-- +migrate Up
-- 1. Create the Laundry Menu (Prices)
CREATE TABLE IF NOT EXISTS laundry_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_dry_clean BOOLEAN DEFAULT FALSE
);

-- 2. Create the Requests (The Ticket)
CREATE TABLE IF NOT EXISTS laundry_requests (
    id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, READY, DELIVERED
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Seed Data (So the Estimator works immediately)
INSERT INTO laundry_items (name, price, is_dry_clean) VALUES
('T-Shirt', 5.00, false),
('Dress Shirt', 8.00, true),
('Trousers', 10.00, true),
('Jeans', 9.00, false),
('Suit Jacket', 15.00, true),
('Underwear', 3.00, false),
('Socks (Pair)', 2.00, false)
ON CONFLICT DO NOTHING;


-- 4. Create Request Items (The Details for Billing)
-- This links a Request (Ticket #101) to specific Menu Items (3 Shirts)
CREATE TABLE IF NOT EXISTS laundry_request_items (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES laundry_requests(id),
    item_id INT NOT NULL REFERENCES laundry_items(id),
    quantity INT NOT NULL,
    snap_price DECIMAL(10, 2) NOT NULL -- Price at time of cleaning (preserves history if menu changes)
);