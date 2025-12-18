import { useState, useCallback } from 'react';
import { triggerSOS, resolveSOSEvent, cancelSOSEvent, getActiveSOSEvents } from '../services/sosService';
import { SOSEvent, SOSEventData } from '../types/sos';

/**
 * Hook for managing SOS functionality
 */
export function useSOS(userId?: string) {
  const [activeEvent, setActiveEvent] = useState<SOSEvent | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Trigger SOS emergency
   */
  const trigger = useCallback(
    async (
      eventData: Omit<SOSEventData, 'coordinates'>,
      options?: {
        sendSMS?: boolean;
        triggerAlarm?: boolean;
        stationId?: string;
      }
    ) => {
      try {
        setIsTriggering(true);
        setError(null);
        const event = await triggerSOS({ ...eventData, userId }, options);
        setActiveEvent(event);
        return event;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to trigger SOS');
        setError(error);
        throw error;
      } finally {
        setIsTriggering(false);
      }
    },
    [userId]
  );

  /**
   * Resolve active SOS event
   */
  const resolve = useCallback(async (eventId: string) => {
    try {
      setError(null);
      await resolveSOSEvent(eventId);
      if (activeEvent?.id === eventId) {
        setActiveEvent(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to resolve SOS event');
      setError(error);
      throw error;
    }
  }, [activeEvent]);

  /**
   * Cancel active SOS event
   */
  const cancel = useCallback(async (eventId: string) => {
    try {
      setError(null);
      await cancelSOSEvent(eventId);
      if (activeEvent?.id === eventId) {
        setActiveEvent(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to cancel SOS event');
      setError(error);
      throw error;
    }
  }, [activeEvent]);

  /**
   * Refresh active events
   */
  const refreshActiveEvents = useCallback(async () => {
    try {
      const events = await getActiveSOSEvents(userId);
      setActiveEvent(events[0] || null);
    } catch (err) {
      console.error('Error refreshing active events:', err);
    }
  }, [userId]);

  return {
    trigger,
    resolve,
    cancel,
    refreshActiveEvents,
    activeEvent,
    isTriggering,
    error,
  };
}

