/**
 * Core data models for the Saheli Station Finder application
 */

/**
 * GPS coordinates for location tracking
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
  /** Optional altitude in meters above sea level */
  altitude?: number;
  /** Optional accuracy radius in meters */
  accuracy?: number;
}

/**
 * Safety score rating (1-5 scale)
 * Assumption: Using a 1-5 scale where 1 is very unsafe and 5 is very safe
 */
export type SafetyScore = 1 | 2 | 3 | 4 | 5;

/**
 * Cleanliness rating (1-5 scale)
 * Assumption: Using a 1-5 scale where 1 is very dirty and 5 is very clean
 */
export type CleanlinessRating = 1 | 2 | 3 | 4 | 5;

/**
 * Water availability status
 * Assumption: Stations may have water available, unavailable, or unknown status
 */
export type WaterAvailability = 'available' | 'unavailable' | 'unknown';

/**
 * Privacy level rating (1-5 scale)
 * Assumption: Using a 1-5 scale where 1 is no privacy and 5 is excellent privacy
 */
export type PrivacyRating = 1 | 2 | 3 | 4 | 5;

/**
 * Verification status for station data
 * Assumption: Stations can be verified by admins/moderators, or remain unverified
 */
export type VerificationStatus = 'verified' | 'unverified' | 'pending' | 'rejected';

/**
 * Station status information
 * Assumption: Tracks the operational status and availability of a station
 */
export interface StationStatus {
  /** Whether the station is currently operational */
  isOperational: boolean;
  /** Whether the station is currently accessible */
  isAccessible: boolean;
  /** Any current issues or maintenance notes */
  notes?: string;
  /** Last time the status was updated */
  lastUpdated: Date;
}

/**
 * User-submitted report about a station
 * Assumption: Users can submit reports with ratings and optional comments
 */
export interface UserReport {
  /** Unique identifier for the report */
  id: string;
  /** Station ID this report relates to (optional if reporting new station) */
  stationId?: string;
  /** GPS coordinates where the report was submitted */
  coordinates: Coordinates;
  /** User's cleanliness rating */
  cleanliness: CleanlinessRating;
  /** User's safety rating */
  safety: SafetyScore;
  /** Water availability at the time of report */
  waterAvailability: WaterAvailability;
  /** User's privacy rating */
  privacy: PrivacyRating;
  /** Optional comment from the user */
  comment?: string;
  /** Timestamp when the report was created */
  createdAt: Date;
  /** Timestamp when the report was last updated */
  lastUpdated: Date;
  /** User ID who submitted the report (optional for anonymous reports) */
  userId?: string;
}

/**
 * Main Station model
 * Assumption: Aggregates data from multiple user reports and official sources
 */
export interface Station {
  /** Unique identifier for the station */
  id: string;
  /** GPS coordinates of the station */
  coordinates: Coordinates;
  /** Station name or description */
  name: string;
  /** Optional address or location description */
  address?: string;
  /** Average cleanliness rating (aggregated from user reports) */
  cleanliness: CleanlinessRating;
  /** Average safety score (aggregated from user reports) */
  safety: SafetyScore;
  /** Current water availability status */
  waterAvailability: WaterAvailability;
  /** Average privacy rating (aggregated from user reports) */
  privacy: PrivacyRating;
  /** Current status of the station */
  status: StationStatus;
  /** Verification status of the station data */
  verificationStatus: VerificationStatus;
  /** Timestamp when station data was last updated */
  lastUpdated: Date;
  /** Timestamp when station was first created/added */
  createdAt: Date;
  /** Number of user reports contributing to this station's data */
  reportCount: number;
  /** Optional additional metadata */
  metadata?: {
    /** Type of facility (e.g., 'restroom', 'sanitary-pad-dispenser', etc.) */
    facilityType?: string;
    /** Operating hours if available */
    operatingHours?: string;
    /** Accessibility features */
    accessibilityFeatures?: string[];
  };
}

