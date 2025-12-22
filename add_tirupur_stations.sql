-- Add test stations for Tirupur city and outskirts, Tamil Nadu, India
-- Tirupur coordinates: ~11.1085° N, 77.3411° E

INSERT INTO stations (name, address, latitude, longitude, cleanliness, safety, privacy, water_availability, verification_status, is_operational, is_accessible)
VALUES
  -- City Center Stations
  ('Tirupur Bus Stand Station', 'Near Tirupur Bus Stand, Avinashi Road, Tirupur, Tamil Nadu 641601', 11.1085, 77.3411, 4, 4, 3, 'available', 'verified', true, true),
  ('Gandhi Market Station', 'Gandhi Market, Tirupur Main Road, Tirupur, Tamil Nadu 641601', 11.1120, 77.3450, 3, 3, 3, 'available', 'verified', true, true),
  ('Railway Station Complex', 'Tirupur Railway Station, Station Road, Tirupur, Tamil Nadu 641601', 11.1050, 77.3380, 4, 5, 4, 'available', 'verified', true, true),
  
  -- Commercial Areas
  ('Avinashi Road Station', 'Avinashi Road, Near Textile Market, Tirupur, Tamil Nadu 641603', 11.1150, 77.3500, 3, 4, 3, 'available', 'unverified', true, true),
  ('Kumarapalayam Station', 'Kumarapalayam, Tirupur, Tamil Nadu 641602', 11.1200, 77.3550, 2, 3, 2, 'unavailable', 'unverified', true, false),
  
  -- Outskirts - North
  ('Kangeyam Road Station', 'Kangeyam Road, Near Perumanallur, Tirupur District, Tamil Nadu 641666', 11.1300, 77.3600, 4, 4, 4, 'available', 'verified', true, true),
  ('Perumanallur Outskirts', 'Perumanallur Village, Tirupur District, Tamil Nadu 641666', 11.1400, 77.3700, 2, 2, 2, 'unavailable', 'unverified', true, true),
  
  -- Outskirts - South
  ('Dharapuram Road Station', 'Dharapuram Road, Near Muthur, Tirupur District, Tamil Nadu 641665', 11.0900, 77.3300, 3, 3, 3, 'available', 'unverified', true, true),
  ('Muthur Village Station', 'Muthur Village, Tirupur District, Tamil Nadu 641665', 11.0800, 77.3200, 2, 2, 2, 'unknown', 'unverified', true, false),
  
  -- Outskirts - East
  ('Palladam Road Station', 'Palladam Road, Near Uthukuli, Tirupur District, Tamil Nadu 641667', 11.1000, 77.3800, 4, 5, 4, 'available', 'verified', true, true),
  ('Uthukuli Outskirts', 'Uthukuli Village, Tirupur District, Tamil Nadu 641667', 11.1100, 77.3900, 3, 3, 3, 'available', 'unverified', true, true),
  
  -- Outskirts - West
  ('Avinashi Bypass Station', 'Avinashi Bypass Road, Near Vellakovil, Tirupur District, Tamil Nadu 641668', 11.1050, 77.3100, 3, 4, 3, 'available', 'verified', true, true),
  ('Vellakovil Road Station', 'Vellakovil Road, Tirupur District, Tamil Nadu 641668', 11.0950, 77.3000, 2, 2, 2, 'unavailable', 'unverified', true, false);
