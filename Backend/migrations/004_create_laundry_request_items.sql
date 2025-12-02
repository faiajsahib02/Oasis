-- +migrate Up
-- Create Request Items table if it doesn't exist
CREATE TABLE IF NOT EXISTS laundry_request_items (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES laundry_requests(id),
    item_id INT NOT NULL REFERENCES laundry_items(id),
    quantity INT NOT NULL,
    snap_price DECIMAL(10, 2) NOT NULL
);

-- +migrate Down
DROP TABLE IF EXISTS laundry_request_items;
