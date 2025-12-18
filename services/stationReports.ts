import { supabase } from './supabase';
import { StationIssueReport, IssueType, TemporaryStatusUpdate } from '../types/reports';
import { Station } from '../types/models';
import { submitReportWithOfflineSupport } from './offlineSync';

/**
 * Time window for temporary status updates (in hours)
 * Reports expire after this duration unless reverified
 */
const STATUS_EXPIRY_HOURS = 24;

/**
 * Map issue type to station report ratings
 */
function mapIssueToRatings(issueType: IssueType): {
  safety: number;
  cleanliness: number;
  waterAvailability: 'available' | 'unavailable' | 'unknown';
} {
  switch (issueType) {
    case 'unsafe':
      return { safety: 1, cleanliness: 3, waterAvailability: 'unknown' };
    case 'unclean':
      return { safety: 3, cleanliness: 1, waterAvailability: 'unknown' };
    case 'no-water':
      return { safety: 3, cleanliness: 3, waterAvailability: 'unavailable' };
    case 'broken-lock':
      return { safety: 1, cleanliness: 3, waterAvailability: 'unknown' };
    default:
      return { safety: 3, cleanliness: 3, waterAvailability: 'unknown' };
  }
}

/**
 * Submit a station issue report
 * Stores the report and updates station status temporarily
 */
export async function submitStationIssueReport(
  report: StationIssueReport
): Promise<{ reportId: string; expiresAt: Date }> {
  const ratings = mapIssueToRatings(report.issueType);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + STATUS_EXPIRY_HOURS);

  // Insert the report into station_reports table
  const { data: reportData, error: reportError } = await supabase
    .from('station_reports')
    .insert({
      station_id: report.stationId,
      latitude: report.coordinates.latitude,
      longitude: report.coordinates.longitude,
      cleanliness: ratings.cleanliness,
      safety: ratings.safety,
      privacy: 2, // Low privacy for broken lock, otherwise neutral
      water_availability: ratings.waterAvailability,
      comment: report.comment || `Issue reported: ${report.issueType}`,
      user_id: report.userId || null,
    })
    .select()
    .single();

  if (reportError) {
    console.error('Error submitting report:', reportError);
    throw new Error(`Failed to submit report: ${reportError.message}`);
  }

  // Update station status temporarily based on issue type
  await updateStationStatusTemporary(report.stationId, report.issueType, expiresAt, reportData.id);

  return {
    reportId: reportData.id,
    expiresAt,
  };
}

/**
 * Update station status temporarily based on issue report
 */
async function updateStationStatusTemporary(
  stationId: string,
  issueType: IssueType,
  expiresAt: Date,
  reportId: string
): Promise<void> {
  // Fetch current station
  const { data: station, error: fetchError } = await supabase
    .from('stations')
    .select('*')
    .eq('id', stationId)
    .single();

  if (fetchError || !station) {
    console.error('Error fetching station:', fetchError);
    throw new Error('Failed to fetch station for status update');
  }

  // Determine status updates based on issue type
  const updates: {
    is_operational?: boolean;
    is_accessible?: boolean;
    status_notes?: string;
  } = {};

  switch (issueType) {
    case 'unsafe':
      updates.is_operational = false;
      updates.is_accessible = false;
      updates.status_notes = `Reported as unsafe. Expires: ${expiresAt.toISOString()}`;
      break;
    case 'broken-lock':
      updates.is_accessible = false;
      updates.status_notes = `Broken lock reported. Expires: ${expiresAt.toISOString()}`;
      break;
    case 'no-water':
      // Water issue doesn't affect operational status, just note it
      updates.status_notes = `No water reported. Expires: ${expiresAt.toISOString()}`;
      break;
    case 'unclean':
      // Unclean doesn't affect operational status, just note it
      updates.status_notes = `Reported as unclean. Expires: ${expiresAt.toISOString()}`;
      break;
  }

  // Update station with temporary status
  const { error: updateError } = await supabase
    .from('stations')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', stationId);

  if (updateError) {
    console.error('Error updating station status:', updateError);
    throw new Error('Failed to update station status');
  }

  // Store temporary status update record (for expiration tracking)
  // Note: This could be stored in a separate table or in station metadata
  // For now, we'll store expiry info in status_notes and handle expiration client-side
}

/**
 * Check if a station's temporary status has expired
 * Should be called before displaying station status
 */
export async function checkAndClearExpiredStatus(stationId: string): Promise<boolean> {
  const { data: station, error } = await supabase
    .from('stations')
    .select('status_notes, updated_at')
    .eq('id', stationId)
    .single();

  if (error || !station) {
    return false;
  }

  // Check if status_notes contains expiry information
  const expiryMatch = station.status_notes?.match(/Expires: (.+)/);
  if (!expiryMatch) {
    return false; // No temporary status
  }

  const expiryDate = new Date(expiryMatch[1]);
  const now = new Date();

  if (now > expiryDate) {
    // Status has expired, clear temporary status
    const { error: clearError } = await supabase
      .from('stations')
      .update({
        is_operational: true,
        is_accessible: true,
        status_notes: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stationId);

    if (clearError) {
      console.error('Error clearing expired status:', clearError);
      return false;
    }

    return true; // Status was cleared
  }

  return false; // Status still valid
}

/**
 * Reverify a station (clear temporary status and mark as verified)
 */
export async function reverifyStation(stationId: string): Promise<void> {
  const { error } = await supabase
    .from('stations')
    .update({
      is_operational: true,
      is_accessible: true,
      status_notes: null,
      verification_status: 'verified',
      updated_at: new Date().toISOString(),
    })
    .eq('id', stationId);

  if (error) {
    console.error('Error reverifying station:', error);
    throw new Error('Failed to reverify station');
  }
}

/**
 * Get active temporary status updates for a station
 */
export async function getTemporaryStatusUpdates(stationId: string): Promise<TemporaryStatusUpdate[]> {
  // Check station status_notes for expiry info
  const { data: station, error } = await supabase
    .from('stations')
    .select('status_notes, updated_at')
    .eq('id', stationId)
    .single();

  if (error || !station || !station.status_notes) {
    return [];
  }

  const expiryMatch = station.status_notes.match(/Expires: (.+)/);
  if (!expiryMatch) {
    return [];
  }

  const expiresAt = new Date(expiryMatch[1]);
  const now = new Date();

  if (now > expiresAt) {
    return []; // Expired
  }

  // Extract issue type from status notes
  let issueType: IssueType = 'unsafe';
  if (station.status_notes.includes('Broken lock')) {
    issueType = 'broken-lock';
  } else if (station.status_notes.includes('No water')) {
    issueType = 'no-water';
  } else if (station.status_notes.includes('unclean')) {
    issueType = 'unclean';
  }

  return [
    {
      stationId,
      issueType,
      expiresAt,
      reportId: '', // Would need to track this separately
    },
  ];
}

