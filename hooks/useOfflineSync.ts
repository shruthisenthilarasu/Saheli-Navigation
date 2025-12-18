import { useEffect } from 'react';
import { setupAutoSync, syncQueuedReports } from '../services/offlineSync';

/**
 * Hook to set up automatic offline sync
 * Call this once in your app root component
 */
export function useOfflineSync(onSyncComplete?: (syncedCount: number) => void) {
  useEffect(() => {
    // Set up network listener for auto-sync
    const unsubscribe = setupAutoSync((count) => {
      if (onSyncComplete) {
        onSyncComplete(count);
      }
    });

    // Also try to sync immediately on mount if online
    syncQueuedReports().then((count) => {
      if (count > 0 && onSyncComplete) {
        onSyncComplete(count);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onSyncComplete]);
}

