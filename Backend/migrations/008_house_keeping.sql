-- +migrate Up

-- 1. Update Rooms Table (Status Tracking)
-- We add a specific column for physical cleanliness
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS housekeeping_status VARCHAR(20) DEFAULT 'CLEAN'; 
-- Set default for existing rows that have NULL
UPDATE rooms SET housekeeping_status = 'CLEAN' WHERE housekeeping_status IS NULL;
-- Values: CLEAN, DIRTY, REQUESTED_CLEANING, IN_PROGRESS, DND (Do Not Disturb)

-- 2. Maintenance Tickets (Issues)
CREATE TABLE IF NOT EXISTS maintenance_tickets (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    issue_type VARCHAR(50) NOT NULL, -- AC, PLUMBING, ELECTRIC
    description TEXT,
    priority VARCHAR(10) DEFAULT 'NORMAL', -- NORMAL, URGENT
    status VARCHAR(20) DEFAULT 'OPEN',     -- OPEN, IN_PROGRESS, RESOLVED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- 3. Amenity Requests (Consumables)
-- Tracks "I need 2 Towels"
CREATE TABLE IF NOT EXISTS amenity_requests (
    id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    item_name VARCHAR(50) NOT NULL, -- "TOWEL", "SOAP", "WATER"
    quantity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, DELIVERED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- +migrate Down
DROP TABLE IF EXISTS amenity_requests;
DROP TABLE IF EXISTS maintenance_tickets;
ALTER TABLE rooms DROP COLUMN IF EXISTS housekeeping_status;