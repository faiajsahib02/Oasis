-- +migrate Up
-- 1. Create the ROOMS table
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,            -- e.g. 'Deluxe', 'Suite'
    status VARCHAR(20) NOT NULL,          -- 'VACANT', 'OCCUPIED', 'CLEANING'
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Data (Initial Inventory)
INSERT INTO rooms (room_number, type, status, price) VALUES 
('101', 'Deluxe Suite', 'VACANT', 150.00),
('102', 'Standard Room', 'VACANT', 100.00),
('103', 'Presidential Suite', 'VACANT', 500.00),
('201', 'Standard Room', 'OCCUPIED', 100.00),
('202', 'Deluxe Suite', 'CLEANING', 150.00)
ON CONFLICT (room_number) DO NOTHING;

-- +migrate Down
DROP TABLE IF EXISTS rooms;