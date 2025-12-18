import NetInfo from '@react-native-community/netinfo';
import { submitStationIssueReport } from './stationReports';
import { queueReport, getQueuedReports, removeQueuedReport, clearQueuedReports } from './offlineStorage';
import { StationIssueReport } from '../types/reports';

/**
 * Offline sync service
 * Handles syncing queued reports when connection is restored
 */

/**
 * Check if device is online
 */
export async function isOnline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
}

/**
 * Submit a report, queue if offline
 */
export async function submitReportWithOfflineSupport(
  report: StationIssueReport
): Promise<{ reportId?: string; expiresAt?: Date; queued: boolean }> {
  const online = await isOnline();

  if (online) {
    try {
      const result = await submitStationIssueReport(report);
      return { ...result, queued: false };
    } catch (error) {
      // If submission fails, queue it anyway
      console.error('Error submitting report, queueing:', error);
      await queueReport(report);
      return { queued: true };
    }
  } else {
    // Offline - queue the report
    await queueReport(report);
    return { queued: true };
  }
}

/**
 * Sync all queued reports
 * Returns number of successfully synced reports
 */
export async function syncQueuedReports(): Promise<number> {
  const online = await isOnline();
  if (!online) {
    return 0;
  }

  const queuedReports = await getQueuedReports();
  if (queuedReports.length === 0) {
    return 0;
  }

  let syncedCount = 0;
  const errors: number[] = [];

  // Process reports in reverse order to avoid index shifting issues
  for (let i = queuedReports.length - 1; i >= 0; i--) {
    const queuedReport = queuedReports[i];
    try {
      // Remove queuedAt field before submitting
      const { queuedAt, ...report } = queuedReport;
      await submitStationIssueReport(report);
      await removeQueuedReport(i);
      syncedCount++;
    } catch (error) {
      console.error(`Error syncing report ${i}:`, error);
      errors.push(i);
    }
  }

  // If all reports synced successfully, clear queue
  if (syncedCount === queuedReports.length) {
    await clearQueuedReports();
  }

  return syncedCount;
}

/**
 * Set up network state listener to auto-sync when online
 */
export function setupAutoSync(onSyncComplete?: (syncedCount: number) => void): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected) {
      // Connection restored - sync queued reports
      syncQueuedReports().then((count) => {
        if (count > 0 && onSyncComplete) {
          onSyncComplete(count);
        }
      });
    }
  });

  return unsubscribe;
}

