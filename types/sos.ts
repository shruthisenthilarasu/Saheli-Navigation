/**
 * Types for Emergency SOS feature
 */

export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface SOSEventData {
  stationId?: string;
  coordinates: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  eventType: 'emergency' | 'harassment' | 'medical' | 'other';
  description?: string;
  userId?: string;
}

export interface SOSEvent {
  id: string;
  stationId?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  eventType: string;
  status: 'active' | 'resolved' | 'cancelled';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

