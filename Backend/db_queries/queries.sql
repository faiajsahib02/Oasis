
-- 3. SEED DATA: Insert some initial rooms
-- (You need these so the "Register Guest" dropdown isn't empty)
INSERT INTO rooms (room_number, type, status, price) VALUES 
('101', 'Deluxe Suite', 'VACANT', 150.00),
('102', 'Standard Room', 'VACANT', 100.00),
('103', 'Presidential Suite', 'VACANT', 500.00),
('201', 'Standard Room', 'OCCUPIED', 100.00),
('202', 'Deluxe Suite', 'CLEANING', 150.00)
ON CONFLICT (room_number) DO NOTHING;





-- Clear existing staff (optional, to avoid duplicates if you re-run)
-- TRUNCATE TABLE staff RESTART IDENTITY CASCADE;

-- Insert Sample Staff Members
INSERT INTO staff (name, password, role) VALUES 
('Manager John', 'admin123', 'MANAGER'),       -- ID: 1 (The Boss)
('Alice Reception', 'staff123', 'RECEPTIONIST'), -- ID: 2 (Front Desk)
('Bob Cleaner', 'staff123', 'HOUSEKEEPING'),     -- ID: 3 (Laundry/Cleaning)
('Sarah Night', 'staff123', 'RECEPTIONIST')      -- ID: 4 (Night Shift)
ON CONFLICT DO NOTHING;