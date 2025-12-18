import * as Location from 'expo-location';
import { supabase } from './supabase';
import { SOSEvent, SOSEventData, EmergencyContact } from '../types/models';
import { getLocationWithPermission } from './permissions';

/**
 * SOS Service
 * Handles emergency SOS functionality
 * 
 * Features:
 * - Capture live GPS location
 * - Store SOS event in Supabase
 * - Send SMS to emergency contacts (placeholder)
 * - Trigger audible alarm (placeholder)
 */

/**
 * Capture current GPS location for SOS
 * Gracefully handles permission denial
 */
async function captureLocation(): Promise<Location.LocationObject | null> {
  const location = await getLocationWithPermission({
    accuracy: Location.Accuracy.Highest,
  });

  if (!location) {
    // Permission denied - return null instead of throwing
    // Caller should handle this gracefully
    return null;
  }

  return location;
}

/**
 * Create SOS event in Supabase
 */
async function createSOSEvent(eventData: SOSEventData): Promise<SOSEvent> {
  const { data, error } = await supabase
    .from('sos_events')
    .insert({
      user_id: eventData.userId,
      station_id: eventData.stationId,
      event_type: eventData.eventType,
      latitude: eventData.coordinates.latitude,
      longitude: eventData.coordinates.longitude,
      accuracy: eventData.coordinates.accuracy,
      status: 'active',
      notes: eventData.notes,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating SOS event:', error);
    throw new Error(`Failed to create SOS event: ${error.message}`);
  }

  return {
    id: data.id,
    userId: data.user_id,
    stationId: data.station_id,
    eventType: data.event_type,
    coordinates: {
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
    },
    status: data.status,
    createdAt: data.created_at,
    resolvedAt: data.resolved_at,
    notes: data.notes,
  };
}

/**
 * Get emergency contacts for user
 * TODO: Implement emergency contacts table and fetching logic
 */
async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  // Placeholder: In a real app, fetch from Supabase
  // For now, return empty array
  return [];
}

/**
 * Send emergency SMS
 * TODO: Integrate SMS service (Twilio, AWS SNS, or native SMS API)
 */
async function sendEmergencySMS(
  contacts: EmergencyContact[],
  location: { latitude: number; longitude: number },
  eventType: string
): Promise<void> {
  // Placeholder implementation
  console.log('Sending emergency SMS to contacts:', contacts);
  console.log('Location:', location);
  console.log('Event type:', eventType);

  // TODO: Integrate SMS service
  // Example with Twilio:
  // await twilio.messages.create({
  //   body: `Emergency alert! ${eventType} at location: ${location.latitude}, ${location.longitude}`,
  //   to: contact.phoneNumber,
  //   from: TWILIO_PHONE_NUMBER,
  // });
}

/**
 * Trigger audible alarm
 * TODO: Implement with expo-av
 */
async function triggerAlarm(): Promise<boolean> {
  try {
    // Placeholder implementation
    console.log('Triggering alarm...');

    // TODO: Implement with expo-av
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../assets/alarm.mp3')
    // );
    // await sound.playAsync();

    // TODO: Add device vibration with expo-haptics
    // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    return true;
  } catch (error) {
    console.error('Error triggering alarm:', error);

    // Don't fail SOS trigger if alarm fails
    return false;
  }
}

/**
 * Main SOS trigger function
 * Orchestrates the entire SOS flow
 */
export async function triggerSOS(
  eventData: Omit<SOSEventData, 'coordinates'>,
  options?: {
    sendSMS?: boolean;
    triggerAlarm?: boolean;
    stationId?: string;
  }
): Promise<SOSEvent> {
  const { sendSMS = true, triggerAlarm: shouldTriggerAlarm = true, stationId } = options || {};

  try {
    // Step 1: Capture live GPS location (with permission handling)
    const location = await captureLocation();
    
    if (!location) {
      // Permission denied - try to use last known location or throw error
      throw new Error('Location permission denied. Cannot trigger SOS without location.');
    }

    const coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || undefined,
    };

    // Step 2: Create SOS event in Supabase
    const sosEvent = await createSOSEvent({
      ...eventData,
      coordinates,
      stationId: stationId || eventData.stationId,
    });

    // Step 3: Send SMS to emergency contacts (async, don't wait)
    if (sendSMS) {
      const contacts = await getEmergencyContacts();
      if (contacts.length > 0) {
        sendEmergencySMS(contacts, coordinates, eventData.eventType).catch((error) => {
          console.error('Error sending emergency SMS:', error);
          // Don't fail the SOS trigger if SMS fails
        });
      }
    }

    // Step 4: Trigger audible alarm (async, don't wait)
    if (shouldTriggerAlarm) {
      triggerAlarm().catch((error) => {
        console.error('Error triggering alarm:', error);
        // Don't fail the SOS trigger if alarm fails
      });
    }

    return sosEvent;
  } catch (error) {
    console.error('Error triggering SOS:', error);
    throw error;
  }
}

/**
 * Resolve an active SOS event
 */
export async function resolveSOSEvent(eventId: string): Promise<void> {
  const { error } = await supabase
    .from('sos_events')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', eventId);

  if (error) {
    console.error('Error resolving SOS event:', error);
    throw new Error(`Failed to resolve SOS event: ${error.message}`);
  }
}
