import AsyncStorage from '@react-native-async-storage/async-storage';
import { Station } from '../types/models';
import { StationIssueReport } from '../types/reports';

/**
 * Offline-first storage service
 * Minimal implementation for caching and queuing
 */

const STORAGE_KEYS = {
  STATIONS_CACHE: '@saheli:stations_cache',
  STATIONS_CACHE_TIMESTAMP: '@saheli:stations_cache_timestamp',
  QUEUED_REPORTS: '@saheli:queued_reports',
};

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache

/**
 * Cache station data locally
 */
export async function cacheStations(stations: Station[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STATIONS_CACHE, JSON.stringify(stations));
    await AsyncStorage.setItem(
      STORAGE_KEYS.STATIONS_CACHE_TIMESTAMP,
      Date.now().toString()
    );
  } catch (error) {
    console.error('Error caching stations:', error);
  }
}

/**
 * Get cached stations if available and not expired
 */
export async function getCachedStations(): Promise<Station[] | null> {
  try {
    const [cachedData, timestampStr] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.STATIONS_CACHE),
      AsyncStorage.getItem(STORAGE_KEYS.STATIONS_CACHE_TIMESTAMP),
    ]);

    if (!cachedData || !timestampStr) {
      return null;
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Check if cache is expired
    if (now - timestamp > CACHE_DURATION_MS) {
      return null;
    }

    return JSON.parse(cachedData) as Station[];
  } catch (error) {
    console.error('Error reading cached stations:', error);
    return null;
  }
}

/**
 * Queue a report for offline submission
 */
export async function queueReport(report: StationIssueReport): Promise<void> {
  try {
    const existingQueue = await getQueuedReports();
    const newQueue = [...existingQueue, { ...report, queuedAt: new Date().toISOString() }];
    await AsyncStorage.setItem(STORAGE_KEYS.QUEUED_REPORTS, JSON.stringify(newQueue));
  } catch (error) {
    console.error('Error queueing report:', error);
    throw error;
  }
}

/**
 * Get all queued reports
 */
export async function getQueuedReports(): Promise<Array<StationIssueReport & { queuedAt: string }>> {
  try {
    const queuedData = await AsyncStorage.getItem(STORAGE_KEYS.QUEUED_REPORTS);
    return queuedData ? JSON.parse(queuedData) : [];
  } catch (error) {
    console.error('Error reading queued reports:', error);
    return [];
  }
}

/**
 * Remove a report from the queue (after successful submission)
 * @param index - Index of the report to remove
 */
export async function removeQueuedReport(index: number): Promise<void> {
  try {
    const queue = await getQueuedReports();
    const filteredQueue = queue.filter((_, i) => i !== index);
    await AsyncStorage.setItem(STORAGE_KEYS.QUEUED_REPORTS, JSON.stringify(filteredQueue));
  } catch (error) {
    console.error('Error removing queued report:', error);
  }
}

/**
 * Clear all queued reports
 */
export async function clearQueuedReports(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.QUEUED_REPORTS);
  } catch (error) {
    console.error('Error clearing queued reports:', error);
  }
}

/**
 * Clear station cache
 */
export async function clearStationCache(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.STATIONS_CACHE,
      STORAGE_KEYS.STATIONS_CACHE_TIMESTAMP,
    ]);
  } catch (error) {
    console.error('Error clearing station cache:', error);
  }
}

