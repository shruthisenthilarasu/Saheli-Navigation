/**
 * Types for station issue reports
 */

export type IssueType = 'unsafe' | 'unclean' | 'no-water' | 'broken-lock';

export interface StationIssueReport {
  stationId: string;
  issueType: IssueType;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  comment?: string;
  userId?: string;
}

/**
 * Temporary status update that expires after a time window
 */
export interface TemporaryStatusUpdate {
  stationId: string;
  issueType: IssueType;
  expiresAt: Date;
  reportId: string;
}

