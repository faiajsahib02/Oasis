-- +migrate Up
-- 1. Create Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- In production, hash this!
    role VARCHAR(20) DEFAULT 'STAFF', -- ADMIN, MANAGER, HOUSEKEEPING
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Seed Default Admin (ID: 1, Password: admin)
INSERT INTO staff (name, password, role) 
VALUES ('Manager', 'admin', 'MANAGER') 
ON CONFLICT DO NOTHING;

-- +migrate Down
DROP TABLE IF EXISTS staff;