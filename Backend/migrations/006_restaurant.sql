-- +migrate Up

-- 1. Categories (Breakfast, Lunch, Dinner)
CREATE TABLE IF NOT EXISTS menu_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g. "Breakfast"
    priority INT DEFAULT 0            -- To sort tabs (Breakfast first)
);

-- 2. Menu Items (The Food) - Updated with image_url
CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES menu_categories(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,                   -- NEW COLUMN for Food Photos
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Restaurant Orders (The Ticket)
CREATE TABLE IF NOT EXISTS restaurant_orders (
    id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'RECEIVED', -- RECEIVED, PREPARING, READY, DELIVERED
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Line Items (What they ate)
CREATE TABLE IF NOT EXISTS restaurant_order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES restaurant_orders(id),
    item_id INT NOT NULL REFERENCES menu_items(id),
    quantity INT NOT NULL,
    snap_price DECIMAL(10, 2) NOT NULL
);

-- =============================================
-- SEED DATA (With Images)
-- =============================================

-- 1. Insert Categories
INSERT INTO menu_categories (name, priority) VALUES 
('Breakfast', 1),
('All Day Dining', 2),
('Beverages', 3)
ON CONFLICT (name) DO NOTHING;

-- 2. Insert Items with Images
-- Note: We assume IDs 1, 2, 3 for categories based on insertion order.
-- Images are from Unsplash (Open License).

INSERT INTO menu_items (category_id, name, description, price, image_url) VALUES
-- BREAKFAST
(1, 'Eggs Benedict', 'Poached eggs, ham, hollandaise on English muffin', 18.00, 'https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=600&q=80'),
(1, 'Pancakes Stack', 'Maple syrup, berry compote, whipped cream', 15.00, 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?w=600&q=80'),

-- ALL DAY DINING
(2, 'Wagyu Burger', 'Brioche bun, cheddar, truffle mayo, served with fries', 25.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80'),
(2, 'Caesar Salad', 'Romaine, parmesan, croutons, grilled chicken', 16.00, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80'),
(2, 'Club Sandwich', 'Toasted bread, turkey, bacon, lettuce, tomato', 19.00, 'https://images.unsplash.com/photo-1567206563064-6f60f40a2c57?w=600&q=80'),

-- BEVERAGES
(3, 'Fresh Orange Juice', 'Squeezed daily from organic oranges', 8.00, 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80'),
(3, 'Cappuccino', 'Italian roast, steamed milk', 6.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80')
ON CONFLICT DO NOTHING;

-- +migrate Down
DROP TABLE IF EXISTS restaurant_order_items;
DROP TABLE IF EXISTS restaurant_orders;
DROP TABLE IF EXISTS menu_items;
DROP TABLE IF EXISTS menu_categories;