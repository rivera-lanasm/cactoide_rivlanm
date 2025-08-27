-- Migration: Add visibility column to events table
-- Date: 2025-08-19
-- Description: Add visibility field to distinguish between public and private events

-- First ensure user_id column exists (in case this migration runs before the user_id migration)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'user_id') THEN
        ALTER TABLE events ADD COLUMN user_id VARCHAR(100);
        UPDATE events SET user_id = 'legacy_user_' || id::text WHERE user_id IS NULL;
        ALTER TABLE events ALTER COLUMN user_id SET NOT NULL;
        CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
    END IF;
END $$;

-- Add visibility column with default value 'public'
ALTER TABLE events 
ADD COLUMN visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private'));

-- Update existing events to have 'public' visibility (since they were created before this field existed)
UPDATE events SET visibility = 'public' WHERE visibility IS NULL;

-- Create index on visibility for better query performance
CREATE INDEX IF NOT EXISTS idx_events_visibility ON events(visibility);

-- Add comment to document the column
COMMENT ON COLUMN events.visibility IS 'Event visibility: public (visible to everyone) or private (only visible to creator and people with link)';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
AND column_name = 'visibility';

-- Show sample of updated data
SELECT id, name, visibility, user_id, created_at 
FROM events 
LIMIT 5;
