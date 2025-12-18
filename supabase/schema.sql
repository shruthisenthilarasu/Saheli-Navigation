-- Enable PostGIS extension for location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stations table
CREATE TABLE stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL, -- Using PostGIS POINT for efficient location queries
    latitude DOUBLE PRECISION NOT NULL, -- Denormalized for easier queries
    longitude DOUBLE PRECISION NOT NULL, -- Denormalized for easier queries
    cleanliness INTEGER CHECK (cleanliness >= 1 AND cleanliness <= 5),
    safety INTEGER CHECK (safety >= 1 AND safety <= 5),
    privacy INTEGER CHECK (privacy >= 1 AND privacy <= 5),
    water_availability VARCHAR(20) CHECK (water_availability IN ('available', 'unavailable', 'unknown')) DEFAULT 'unknown',
    verification_status VARCHAR(20) CHECK (verification_status IN ('verified', 'unverified', 'pending', 'rejected')) DEFAULT 'unverified',
    is_operational BOOLEAN DEFAULT true,
    is_accessible BOOLEAN DEFAULT true,
    status_notes TEXT,
    facility_type VARCHAR(100),
    operating_hours TEXT,
    accessibility_features TEXT[], -- Array of accessibility features
    report_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- Safety scores table (for tracking safety score history)
CREATE TABLE safety_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    user_id UUID, -- Optional: track which user submitted this score
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- Station reports table (user-submitted reports)
CREATE TABLE station_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE SET NULL, -- Nullable if reporting a new station
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    cleanliness INTEGER NOT NULL CHECK (cleanliness >= 1 AND cleanliness <= 5),
    safety INTEGER NOT NULL CHECK (safety >= 1 AND safety <= 5),
    privacy INTEGER NOT NULL CHECK (privacy >= 1 AND privacy <= 5),
    water_availability VARCHAR(20) NOT NULL CHECK (water_availability IN ('available', 'unavailable', 'unknown')),
    comment TEXT,
    user_id UUID, -- Optional: for anonymous reports
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- SOS events table (emergency/SOS events)
CREATE TABLE sos_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID REFERENCES stations(id) ON DELETE SET NULL, -- Nullable if event not at a station
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    user_id UUID, -- User who triggered the SOS event
    event_type VARCHAR(50) NOT NULL, -- e.g., 'emergency', 'harassment', 'medical', etc.
    status VARCHAR(20) CHECK (status IN ('active', 'resolved', 'cancelled')) DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ -- Soft delete
);

-- Indexes for location queries (using GIST for spatial indexes)
CREATE INDEX idx_stations_location ON stations USING GIST (location);
CREATE INDEX idx_stations_lat_lng ON stations (latitude, longitude);
CREATE INDEX idx_stations_deleted_at ON stations (deleted_at) WHERE deleted_at IS NULL; -- Partial index for active stations

CREATE INDEX idx_safety_scores_station_id ON safety_scores (station_id);
CREATE INDEX idx_safety_scores_deleted_at ON safety_scores (deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_station_reports_location ON station_reports USING GIST (location);
CREATE INDEX idx_station_reports_lat_lng ON station_reports (latitude, longitude);
CREATE INDEX idx_station_reports_station_id ON station_reports (station_id);
CREATE INDEX idx_station_reports_created_at ON station_reports (created_at DESC);
CREATE INDEX idx_station_reports_deleted_at ON station_reports (deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_sos_events_location ON sos_events USING GIST (location);
CREATE INDEX idx_sos_events_lat_lng ON sos_events (latitude, longitude);
CREATE INDEX idx_sos_events_station_id ON sos_events (station_id);
CREATE INDEX idx_sos_events_status ON sos_events (status);
CREATE INDEX idx_sos_events_created_at ON sos_events (created_at DESC);
CREATE INDEX idx_sos_events_deleted_at ON sos_events (deleted_at) WHERE deleted_at IS NULL;

-- Indexes for common query patterns
CREATE INDEX idx_stations_verification_status ON stations (verification_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_stations_operational ON stations (is_operational, is_accessible) WHERE deleted_at IS NULL;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_scores_updated_at BEFORE UPDATE ON safety_scores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_station_reports_updated_at BEFORE UPDATE ON station_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sos_events_updated_at BEFORE UPDATE ON sos_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to sync location coordinates (latitude/longitude) with PostGIS POINT
CREATE OR REPLACE FUNCTION sync_location_coordinates()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure location POINT is set from latitude/longitude
    IF NEW.location IS NULL AND NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to sync location coordinates
CREATE TRIGGER sync_stations_location BEFORE INSERT OR UPDATE ON stations
    FOR EACH ROW EXECUTE FUNCTION sync_location_coordinates();

CREATE TRIGGER sync_station_reports_location BEFORE INSERT OR UPDATE ON station_reports
    FOR EACH ROW EXECUTE FUNCTION sync_location_coordinates();

CREATE TRIGGER sync_sos_events_location BEFORE INSERT OR UPDATE ON sos_events
    FOR EACH ROW EXECUTE FUNCTION sync_location_coordinates();

