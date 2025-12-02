-- +migrate Up
-- 1. Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    
    -- Financial Breakdown
    room_charge DECIMAL(10, 2) NOT NULL,
    laundry_charge DECIMAL(10, 2) DEFAULT 0.00,
    restaurant_charge DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    payment_method VARCHAR(20) DEFAULT 'CREDIT_CARD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Update Guests to track Checkout status
ALTER TABLE guests ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'CHECKED_IN';
-- Values: CHECKED_IN, CHECKED_OUT

-- +migrate Down
ALTER TABLE guests DROP COLUMN IF EXISTS status;
DROP TABLE IF EXISTS invoices;