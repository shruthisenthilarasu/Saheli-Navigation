import { Station, StationStatus } from '../types/models';
import { IssueType } from '../types/reports';

/**
 * Time-bound station status management
 * 
 * This module handles the logic for temporary station states based on user reports.
 * Status changes are time-bound and can be reset by verification or expire naturally.
 */

/**
 * Duration in hours that a report affects station status
 */
export const REPORT_DURATION_HOURS = 24;

/**
 * Severity levels for station status
 * Higher severity means more restrictive status
 */
export enum StatusSeverity {
  NONE = 0,
  LOW = 1,      // Single report, minor issue
  MEDIUM = 2,   // Multiple reports or moderate issue
  HIGH = 3,     // Multiple recent reports or critical issue
  CRITICAL = 4, // Many recent reports or severe safety issue
}

/**
 * Active report record with timestamp
 */
export interface ActiveReport {
  issueType: IssueType;
  reportedAt: Date;
  severity: StatusSeverity;
}

/**
 * Calculated station status based on active reports
 */
export interface CalculatedStatus {
  isOperational: boolean;
  isAccessible: boolean;
  severity: StatusSeverity;
  statusNotes: string | null;
  expiresAt: Date | null;
}

/**
 * Calculate severity based on issue type
 * Tradeoff: Simple mapping - could be made configurable per station type
 */
function getIssueSeverity(issueType: IssueType): StatusSeverity {
  switch (issueType) {
    case 'unsafe':
    case 'broken-lock':
      return StatusSeverity.HIGH; // Safety issues are high severity
    case 'unclean':
      return StatusSeverity.LOW; // Cleanliness is lower severity
    case 'no-water':
      return StatusSeverity.MEDIUM; // Water availability is medium severity
    default:
      return StatusSeverity.LOW;
  }
}

/**
 * Get active reports for a station from recent station_reports
 * Tradeoff: This assumes we have access to recent reports
 * In practice, you'd fetch these from the database
 */
function getActiveReports(
  reports: Array<{ issueType: IssueType; createdAt: Date }>,
  now: Date = new Date()
): ActiveReport[] {
  const expiryTime = REPORT_DURATION_HOURS * 60 * 60 * 1000; // Convert to milliseconds

  return reports
    .filter((report) => {
      const reportAge = now.getTime() - report.createdAt.getTime();
      return reportAge < expiryTime; // Only include reports within duration window
    })
    .map((report) => ({
      issueType: report.issueType,
      reportedAt: report.createdAt,
      severity: getIssueSeverity(report.issueType),
    }));
}

/**
 * Calculate aggregated severity from multiple reports
 * Tradeoff: Linear accumulation - could use exponential decay or weighted system
 * Multiple reports increase severity up to CRITICAL
 */
function calculateAggregatedSeverity(activeReports: ActiveReport[]): StatusSeverity {
  if (activeReports.length === 0) {
    return StatusSeverity.NONE;
  }

  // Count reports by severity level
  const severityCounts: Record<StatusSeverity, number> = {
    [StatusSeverity.NONE]: 0,
    [StatusSeverity.LOW]: 0,
    [StatusSeverity.MEDIUM]: 0,
    [StatusSeverity.HIGH]: 0,
    [StatusSeverity.CRITICAL]: 0,
  };

  activeReports.forEach((report) => {
    severityCounts[report.severity]++;
  });

  // Escalation logic: multiple reports increase severity
  // Tradeoff: Simple threshold-based escalation
  // Alternative: Could use weighted scoring or time-decay
  const totalReports = activeReports.length;
  const highSeverityCount = severityCounts[StatusSeverity.HIGH] + severityCounts[StatusSeverity.CRITICAL];

  if (highSeverityCount >= 3 || totalReports >= 5) {
    return StatusSeverity.CRITICAL;
  }
  if (highSeverityCount >= 2 || totalReports >= 3) {
    return StatusSeverity.HIGH;
  }
  if (highSeverityCount >= 1 || totalReports >= 2) {
    return StatusSeverity.MEDIUM;
  }

  // Return highest individual severity if only one report
  return Math.max(...activeReports.map((r) => r.severity)) as StatusSeverity;
}

/**
 * Calculate station status based on active reports and verification status
 * 
 * Tradeoffs:
 * - Verified clean resets status immediately (could have grace period)
 * - Status is binary (operational/not) - could have partial states
 * - Expiry is based on oldest report (could use newest or weighted)
 */
export function calculateStationStatus(
  station: Station,
  recentReports: Array<{ issueType: IssueType; createdAt: Date }>,
  isVerifiedClean: boolean = false
): CalculatedStatus {
  // Verified clean resets all temporary status
  // Tradeoff: Immediate reset - could require admin confirmation or have delay
  if (isVerifiedClean) {
    return {
      isOperational: true,
      isAccessible: true,
      severity: StatusSeverity.NONE,
      statusNotes: null,
      expiresAt: null,
    };
  }

  const now = new Date();
  const activeReports = getActiveReports(recentReports, now);

  // No active reports - use station's base status
  if (activeReports.length === 0) {
    return {
      isOperational: station.status.isOperational,
      isAccessible: station.status.isAccessible,
      severity: StatusSeverity.NONE,
      statusNotes: station.status.notes || null,
      expiresAt: null,
    };
  }

  // Calculate aggregated severity from multiple reports
  const aggregatedSeverity = calculateAggregatedSeverity(activeReports);

  // Determine status based on severity and issue types
  // Tradeoff: Hard-coded rules - could be configurable per station type
  const hasUnsafeOrBrokenLock = activeReports.some(
    (r) => r.issueType === 'unsafe' || r.issueType === 'broken-lock'
  );
  const hasNoWater = activeReports.some((r) => r.issueType === 'no-water');
  const hasUnclean = activeReports.some((r) => r.issueType === 'unclean');

  // Calculate expiry time (oldest report + duration)
  // Tradeoff: Uses oldest report - could use newest or weighted average
  const oldestReportTime = Math.min(...activeReports.map((r) => r.reportedAt.getTime()));
  const expiresAt = new Date(oldestReportTime + REPORT_DURATION_HOURS * 60 * 60 * 1000);

  // Build status notes
  const issueTypes = [...new Set(activeReports.map((r) => r.issueType))];
  const statusNotes = `Active reports: ${issueTypes.join(', ')}. ${activeReports.length} report(s). Expires: ${expiresAt.toISOString()}`;

  // Determine operational and accessible status
  // Tradeoff: Binary states - could have partial availability
  let isOperational = true;
  let isAccessible = true;

  // High severity or critical severity makes station non-operational
  if (aggregatedSeverity >= StatusSeverity.HIGH) {
    isOperational = false;
  }

  // Unsafe or broken lock makes station inaccessible
  if (hasUnsafeOrBrokenLock) {
    isAccessible = false;
    isOperational = false; // Also non-operational for safety
  }

  // Multiple reports of any type increase restrictions
  if (aggregatedSeverity >= StatusSeverity.MEDIUM && activeReports.length >= 2) {
    isOperational = false;
  }

  return {
    isOperational,
    isAccessible,
    severity: aggregatedSeverity,
    statusNotes,
    expiresAt,
  };
}

/**
 * Check if a station's temporary status has expired
 * 
 * Tradeoff: Simple time-based check - doesn't account for new reports
 * Should be called before calculating status to ensure accuracy
 */
export function isStatusExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) {
    return false; // No expiry if no expiration date
  }
  return new Date() > expiresAt;
}

/**
 * Get the time remaining until status expires
 * Returns null if no expiry or already expired
 */
export function getTimeUntilExpiry(expiresAt: Date | null): number | null {
  if (!expiresAt) {
    return null;
  }
  const now = new Date();
  const remaining = expiresAt.getTime() - now.getTime();
  return remaining > 0 ? remaining : null;
}

/**
 * Check if station should be marked as verified clean
 * This resets all temporary status
 * 
 * Tradeoff: Simple boolean check - could have verification levels or requirements
 */
export function shouldResetStatus(
  station: Station,
  isVerifiedClean: boolean
): boolean {
  return isVerifiedClean && station.verificationStatus === 'verified';
}

/**
 * Merge calculated status with station's base status
 * Calculated status takes precedence for temporary states
 * 
 * Tradeoff: Calculated status always overrides - could merge or prioritize
 */
export function mergeStatus(
  baseStatus: StationStatus,
  calculatedStatus: CalculatedStatus
): StationStatus {
  // If calculated status has no active reports, use base status
  if (calculatedStatus.severity === StatusSeverity.NONE && !calculatedStatus.expiresAt) {
    return baseStatus;
  }

  // Otherwise, use calculated status
  return {
    isOperational: calculatedStatus.isOperational,
    isAccessible: calculatedStatus.isAccessible,
    notes: calculatedStatus.statusNotes || baseStatus.notes,
    lastUpdated: new Date(),
  };
}

