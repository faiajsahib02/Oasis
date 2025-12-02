-- +migrate Up
ALTER TABLE menu_items ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;

-- +migrate Down
ALTER TABLE menu_items DROP COLUMN is_deleted;
