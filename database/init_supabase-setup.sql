-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(8) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
               type VARCHAR(20) NOT NULL CHECK (type IN ('limited', 'unlimited')),
               attendee_limit INTEGER CHECK (attendee_limit > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RSVPs table
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id VARCHAR(8) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_id ON events(id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user_id ON rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON rsvps(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a public RSVP app)
CREATE POLICY "Allow public read access to events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to events" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to RSVPs" ON rsvps
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to RSVPs" ON rsvps
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete access to RSVPs" ON rsvps
    FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
