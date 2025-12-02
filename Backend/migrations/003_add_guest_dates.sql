-- +migrate Up
-- Add check-in and check-out date columns to guests table
ALTER TABLE guests ADD COLUMN IF NOT EXISTS check_in_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE guests ADD COLUMN IF NOT EXISTS check_out_date DATE;

-- +migrate Down
ALTER TABLE guests DROP COLUMN IF EXISTS check_out_date;
ALTER TABLE guests DROP COLUMN IF EXISTS check_in_date;
