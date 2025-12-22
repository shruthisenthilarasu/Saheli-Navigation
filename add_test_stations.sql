-- Add test stations for San Francisco area
INSERT INTO stations (name, address, latitude, longitude, cleanliness, safety, privacy, water_availability, verification_status, is_operational, is_accessible)
VALUES
  ('Union Square Station', '123 Market St, San Francisco, CA', 37.7879, -122.4094, 4, 5, 4, 'available', 'verified', true, true),
  ('Embarcadero Station', '456 Embarcadero, San Francisco, CA', 37.7955, -122.3933, 3, 4, 3, 'available', 'verified', true, true),
  ('Mission Bay Station', '789 Mission Bay Blvd, San Francisco, CA', 37.7699, -122.3889, 2, 2, 2, 'unavailable', 'unverified', true, false),
  ('Golden Gate Park Station', '321 Golden Gate Park, San Francisco, CA', 37.7694, -122.4862, 5, 5, 5, 'available', 'verified', true, true),
  ('Fisherman''s Wharf Station', '654 Fisherman''s Wharf, San Francisco, CA', 37.8080, -122.4177, 3, 3, 3, 'available', 'unverified', true, true),
  ('Castro District Station', '987 Castro St, San Francisco, CA', 37.7609, -122.4350, 4, 4, 4, 'available', 'verified', true, true);
