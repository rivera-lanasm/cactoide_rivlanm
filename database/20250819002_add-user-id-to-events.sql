-- Migration: Add user_id column to Events table
-- Run this against your existing Supabase database

-- Add user_id column to existing events table
ALTER TABLE events 
ADD COLUMN user_id VARCHAR(100);

-- Set a default value for existing records (you can modify this if needed)
-- This assigns a unique user ID to each existing event
UPDATE events 
SET user_id = 'legacy_user_' || id::text 
WHERE user_id IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE events 
ALTER COLUMN user_id SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
AND column_name = 'user_id';

-- Show sample of updated data
SELECT id, name, user_id, created_at 
FROM events 
LIMIT 5;
