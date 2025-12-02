-- +migrate Up

-- 1. Seed More Rooms
INSERT INTO rooms (room_number, type, status, price) VALUES 
('104', 'Standard Room', 'VACANT', 100.00),
('105', 'Standard Room', 'VACANT', 100.00),
('203', 'Deluxe Suite', 'VACANT', 150.00),
('204', 'Deluxe Suite', 'VACANT', 150.00),
('205', 'Standard Room', 'VACANT', 100.00),
('301', 'Presidential Suite', 'VACANT', 500.00),
('302', 'Deluxe Suite', 'VACANT', 150.00),
('303', 'Standard Room', 'VACANT', 100.00),
('304', 'Standard Room', 'VACANT', 100.00),
('305', 'Standard Room', 'VACANT', 100.00)
ON CONFLICT (room_number) DO NOTHING;

-- +migrate Down
DELETE FROM rooms WHERE room_number IN ('104', '105', '203', '204', '205', '301', '302', '303', '304', '305');
