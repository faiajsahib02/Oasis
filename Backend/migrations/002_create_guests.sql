-- +migrate Up
-- 1. Create the GUESTS table
CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    room_number VARCHAR(10) NOT NULL,     -- Links to rooms table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: Ensure room_number actually exists in the rooms table
    CONSTRAINT fk_room 
        FOREIGN KEY (room_number) 
        REFERENCES rooms(room_number)
        ON DELETE RESTRICT
);

-- Index for faster Login lookups
CREATE INDEX idx_guest_login ON guests(room_number, phone_number);

-- +migrate Down
DROP INDEX IF EXISTS idx_guest_login;
DROP TABLE IF EXISTS guests;