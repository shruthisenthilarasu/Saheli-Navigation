import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Station, UserReport } from '../types/models';
import { cacheStations, getCachedStations } from './offlineStorage';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create Supabase client with fallback to dummy values if not configured
// This allows the app to run without Supabase configured (for UI development)
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);

// Warn if Supabase is not configured (but don't crash the app)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your .env file or app.json extra config.'
  );
}

/**
 * Fetch stations within a radius of a given location
 * @param latitude - Center latitude
 * @param longitude - Center longitude
 * @param radiusMeters - Search radius in meters (default: 5000)
 * @returns Array of stations
 */
export async function fetchStationsNearby(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<Station[]> {
  const { data, error } = await supabase.rpc('stations_nearby', {
    lat: latitude,
    lng: longitude,
    radius_meters: radiusMeters,
  });

  if (error) {
    console.error('Error fetching nearby stations:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetch all stations (with optional filters)
 * Uses cache when offline or as fallback
 * @param filters - Optional filters for verification status, operational status, etc.
 * @param useCache - Whether to use cache as fallback (default: true)
 * @returns Array of stations
 */
export async function fetchStations(
  filters?: {
    verificationStatus?: 'verified' | 'unverified' | 'pending' | 'rejected';
    isOperational?: boolean;
    isAccessible?: boolean;
  },
  useCache: boolean = true
): Promise<Station[]> {
  try {
    let query = supabase
      .from('stations')
      .select('*')
      .is('deleted_at', null); // Only fetch non-deleted stations

    if (filters?.verificationStatus) {
      query = query.eq('verification_status', filters.verificationStatus);
    }

    if (filters?.isOperational !== undefined) {
      query = query.eq('is_operational', filters.isOperational);
    }

    if (filters?.isAccessible !== undefined) {
      query = query.eq('is_accessible', filters.isAccessible);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform database rows to Station model
    const stations = (data || []).map(transformStationRow);
    
    // Cache stations for offline use
    await cacheStations(stations);
    
    return stations;
  } catch (error) {
    console.error('Error fetching stations:', error);
    
    // Fallback to cache if available
    if (useCache) {
      const cachedStations = await getCachedStations();
      if (cachedStations) {
        console.log('Using cached stations as fallback');
        return cachedStations;
      }
    }
    
    throw error;
  }
}

/**
 * Fetch a single station by ID
 * @param stationId - Station UUID
 * @returns Station or null if not found
 */
export async function fetchStationById(stationId: string): Promise<Station | null> {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('id', stationId)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching station:', error);
    throw error;
  }

  return transformStationRow(data);
}

/**
 * Submit a user report for a station
 * @param report - User report data
 * @returns Created report
 */
export async function submitStationReport(report: Omit<UserReport, 'id' | 'createdAt' | 'lastUpdated'>): Promise<UserReport> {
  const { data, error } = await supabase
    .from('station_reports')
    .insert({
      station_id: report.stationId || null,
      latitude: report.coordinates.latitude,
      longitude: report.coordinates.longitude,
      cleanliness: report.cleanliness,
      safety: report.safety,
      privacy: report.privacy,
      water_availability: report.waterAvailability,
      comment: report.comment || null,
      user_id: report.userId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting report:', error);
    throw error;
  }

  return transformReportRow(data);
}

// ============================================================================
// EXAMPLE USAGE:
// ============================================================================
//
// 1. Fetch all verified stations:
//    const stations = await fetchStations({ verificationStatus: 'verified' });
//
// 2. Fetch stations near user's location:
//    const nearbyStations = await fetchStationsNearby(37.7749, -122.4194, 2000);
//
// 3. Fetch a specific station:
//    const station = await fetchStationById('station-uuid-here');
//
// 4. Submit a user report:
//    const report = await submitStationReport({
//      stationId: 'station-uuid',
//      coordinates: { latitude: 37.7749, longitude: -122.4194 },
//      cleanliness: 4,
//      safety: 5,
//      privacy: 3,
//      waterAvailability: 'available',
//      comment: 'Clean and well-maintained',
//    });
//
// 5. Use the Supabase client directly for custom queries:
//    const { data, error } = await supabase
//      .from('stations')
//      .select('*')
//      .eq('verification_status', 'verified');
//
// ============================================================================

/**
 * Transform database row to Station model
 */
function transformStationRow(row: any): Station {
  // Extract coordinates from PostGIS location or use lat/lng columns
  const latitude = row.latitude || (row.location ? JSON.parse(row.location).coordinates[1] : 0);
  const longitude = row.longitude || (row.location ? JSON.parse(row.location).coordinates[0] : 0);

  return {
    id: row.id,
    name: row.name,
    address: row.address,
    coordinates: {
      latitude,
      longitude,
      altitude: row.altitude,
      accuracy: row.accuracy,
    },
    cleanliness: row.cleanliness,
    safety: row.safety,
    privacy: row.privacy,
    waterAvailability: row.water_availability,
    status: {
      isOperational: row.is_operational,
      isAccessible: row.is_accessible,
      notes: row.status_notes,
      lastUpdated: new Date(row.updated_at),
    },
    verificationStatus: row.verification_status,
    lastUpdated: new Date(row.updated_at),
    createdAt: new Date(row.created_at),
    reportCount: row.report_count || 0,
    metadata: {
      facilityType: row.facility_type,
      operatingHours: row.operating_hours,
      accessibilityFeatures: row.accessibility_features,
    },
  };
}

/**
 * Transform database row to UserReport model
 */
function transformReportRow(row: any): UserReport {
  const latitude = row.latitude || (row.location ? JSON.parse(row.location).coordinates[1] : 0);
  const longitude = row.longitude || (row.location ? JSON.parse(row.location).coordinates[0] : 0);

  return {
    id: row.id,
    stationId: row.station_id,
    coordinates: {
      latitude,
      longitude,
    },
    cleanliness: row.cleanliness,
    safety: row.safety,
    privacy: row.privacy,
    waterAvailability: row.water_availability,
    comment: row.comment,
    createdAt: new Date(row.created_at),
    lastUpdated: new Date(row.updated_at),
    userId: row.user_id,
  };
}

