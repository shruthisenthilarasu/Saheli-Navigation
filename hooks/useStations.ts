import { useState, useEffect, useCallback } from 'react';
import { Station } from '../types/models';
import { fetchStations } from '../services/supabase';
import { getCachedStations } from '../services/offlineStorage';

type StationStatus = 'verified-clean' | 'under-repair' | 'unsafe' | 'other';

interface GroupedStations {
  'verified-clean': Station[];
  'under-repair': Station[];
  unsafe: Station[];
  other: Station[];
}

interface UseStationsOptions {
  /** Optional filters for fetching stations */
  filters?: {
    verificationStatus?: 'verified' | 'unverified' | 'pending' | 'rejected';
    isOperational?: boolean;
    isAccessible?: boolean;
  };
  /** Whether to fetch stations on mount (default: true) */
  fetchOnMount?: boolean;
}

interface UseStationsReturn {
  /** All stations */
  stations: Station[];
  /** Stations grouped by status */
  groupedStations: GroupedStations;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Function to refresh stations */
  refresh: () => Promise<void>;
}

/**
 * Determine station status based on station properties
 */
function getStationStatus(station: Station): StationStatus {
  // Under repair if not operational or not accessible
  if (!station.status.isOperational || !station.status.isAccessible) {
    return 'under-repair';
  }

  // Unsafe if safety score is 1 or 2
  if (station.safety <= 2) {
    return 'unsafe';
  }

  // Verified clean if verified and safety/cleanliness are high
  if (
    station.verificationStatus === 'verified' &&
    station.safety >= 4 &&
    station.cleanliness >= 4
  ) {
    return 'verified-clean';
  }

  // Default to other
  return 'other';
}

/**
 * Group stations by their status
 */
function groupStationsByStatus(stations: Station[]): GroupedStations {
  const grouped: GroupedStations = {
    'verified-clean': [],
    'under-repair': [],
    unsafe: [],
    other: [],
  };

  stations.forEach((station) => {
    const status = getStationStatus(station);
    grouped[status].push(station);
  });

  return grouped;
}

/**
 * Hook to fetch and manage stations from Supabase
 * 
 * @example
 * ```tsx
 * const { stations, groupedStations, loading, error, refresh } = useStations({
 *   filters: { verificationStatus: 'verified' }
 * });
 * ```
 */
export function useStations(options: UseStationsOptions = {}): UseStationsReturn {
  const { filters, fetchOnMount = true } = options;

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(fetchOnMount);
  const [error, setError] = useState<Error | null>(null);

  const fetchStationsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from cache first for instant display
      const cachedStations = await getCachedStations();
      if (cachedStations) {
        setStations(cachedStations);
      }
      
      // Then fetch fresh data (will update cache and stations)
      const fetchedStations = await fetchStations(filters, true);
      setStations(fetchedStations);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch stations');
      setError(error);
      console.error('Error fetching stations:', error);
      
      // If fetch failed, try to use cache as fallback
      const cachedStations = await getCachedStations();
      if (cachedStations) {
        setStations(cachedStations);
        setError(null); // Clear error if we have cached data
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (fetchOnMount) {
      fetchStationsData();
    }
  }, [fetchOnMount, fetchStationsData]);

  const refresh = useCallback(async () => {
    await fetchStationsData();
  }, [fetchStationsData]);

  const groupedStations = groupStationsByStatus(stations);

  return {
    stations,
    groupedStations,
    loading,
    error,
    refresh,
  };
}

