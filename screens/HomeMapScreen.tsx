import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { PrimaryButton, FilterChip, SearchBar } from '../components/ui';
import { HomeMapScreenProps } from '../navigation/types';
import MarkerOverlay from '../components/MarkerOverlay';
import MapLegend from '../components/MapLegend';
import TirupurMapPrototype from '../components/TirupurMapPrototype';
import { useStations } from '../hooks/useStations';
import { Station } from '../types/models';
import Constants from 'expo-constants';

// Import MapView for web platform
let MapView: any = null;
if (Platform.OS === 'web') {
  try {
    MapView = require('../components/MapView.web').default;
  } catch (e) {
    console.warn('MapView.web not available:', e);
  }
}

/**
 * HomeMapScreen Layout
 * Full-screen map with floating SOS button, filter chips, and optional search bar
 */

type FilterType = 'all' | 'verified' | 'under-repair' | 'unsafe';

// Default viewport bounds (Tirupur city and outskirts, Tamil Nadu, India)
const DEFAULT_VIEWPORT = {
  minLat: 11.07,
  maxLat: 11.15,
  minLng: 77.29,
  maxLng: 77.40,
};

// Default center (Tirupur city center, Tamil Nadu, India)
const DEFAULT_CENTER = {
  latitude: 11.1085,
  longitude: 77.3411,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeMapScreen() {
  const navigation = useNavigation<HomeMapScreenProps['navigation']>();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
  const [mapboxFailed, setMapboxFailed] = useState(false);
  
  // Fetch real stations from Supabase
  const { stations: supabaseStations, loading, error, refresh } = useStations();
  
  // Fallback Tirupur stations if Supabase has no data
  const tirupurFallbackStations: Station[] = [
    {
      id: '1',
      name: 'Tirupur Bus Stand Station',
      address: 'Near Tirupur Bus Stand, Avinashi Road, Tirupur, Tamil Nadu 641601',
      coordinates: { latitude: 11.1085, longitude: 77.3411 },
      cleanliness: 4,
      safety: 4,
      privacy: 3,
      waterAvailability: 'available',
      verificationStatus: 'verified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '2',
      name: 'Gandhi Market Station',
      address: 'Gandhi Market, Tirupur Main Road, Tirupur, Tamil Nadu 641601',
      coordinates: { latitude: 11.1120, longitude: 77.3450 },
      cleanliness: 3,
      safety: 3,
      privacy: 3,
      waterAvailability: 'available',
      verificationStatus: 'verified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '3',
      name: 'Railway Station Complex',
      address: 'Tirupur Railway Station, Station Road, Tirupur, Tamil Nadu 641601',
      coordinates: { latitude: 11.1050, longitude: 77.3380 },
      cleanliness: 4,
      safety: 5,
      privacy: 4,
      waterAvailability: 'available',
      verificationStatus: 'verified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '4',
      name: 'Avinashi Road Station',
      address: 'Avinashi Road, Near Textile Market, Tirupur, Tamil Nadu 641603',
      coordinates: { latitude: 11.1150, longitude: 77.3500 },
      cleanliness: 3,
      safety: 4,
      privacy: 3,
      waterAvailability: 'available',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '5',
      name: 'Kumarapalayam Station',
      address: 'Kumarapalayam, Tirupur, Tamil Nadu 641602',
      coordinates: { latitude: 11.1200, longitude: 77.3550 },
      cleanliness: 2,
      safety: 3,
      privacy: 2,
      waterAvailability: 'unavailable',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: false, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '6',
      name: 'Kangeyam Road Station',
      address: 'Kangeyam Road, Near Perumanallur, Tirupur District, Tamil Nadu 641666',
      coordinates: { latitude: 11.1300, longitude: 77.3600 },
      cleanliness: 4,
      safety: 4,
      privacy: 4,
      waterAvailability: 'available',
      verificationStatus: 'verified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '7',
      name: 'Perumanallur Outskirts',
      address: 'Perumanallur Village, Tirupur District, Tamil Nadu 641666',
      coordinates: { latitude: 11.1400, longitude: 77.3700 },
      cleanliness: 2,
      safety: 2,
      privacy: 2,
      waterAvailability: 'unavailable',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '8',
      name: 'Dharapuram Road Station',
      address: 'Dharapuram Road, Near Muthur, Tirupur District, Tamil Nadu 641665',
      coordinates: { latitude: 11.0900, longitude: 77.3300 },
      cleanliness: 3,
      safety: 3,
      privacy: 3,
      waterAvailability: 'available',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '9',
      name: 'Muthur Village Station',
      address: 'Muthur Village, Tirupur District, Tamil Nadu 641665',
      coordinates: { latitude: 11.0800, longitude: 77.3200 },
      cleanliness: 2,
      safety: 2,
      privacy: 2,
      waterAvailability: 'unknown',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: false, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '10',
      name: 'Palladam Road Station',
      address: 'Palladam Road, Near Uthukuli, Tirupur District, Tamil Nadu 641667',
      coordinates: { latitude: 11.1000, longitude: 77.3800 },
      cleanliness: 4,
      safety: 5,
      privacy: 4,
      waterAvailability: 'available',
      verificationStatus: 'verified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '11',
      name: 'Uthukuli Outskirts',
      address: 'Uthukuli Village, Tirupur District, Tamil Nadu 641667',
      coordinates: { latitude: 11.1100, longitude: 77.3900 },
      cleanliness: 3,
      safety: 3,
      privacy: 3,
      waterAvailability: 'available',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '12',
      name: 'Avinashi Bypass Station',
      address: 'Avinashi Bypass Road, Near Vellakovil, Tirupur District, Tamil Nadu 641668',
      coordinates: { latitude: 11.1050, longitude: 77.3100 },
      cleanliness: 3,
      safety: 4,
      privacy: 3,
      waterAvailability: 'available',
      verificationStatus: 'verified',
      status: { isOperational: true, isAccessible: true, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
    {
      id: '13',
      name: 'Vellakovil Road Station',
      address: 'Vellakovil Road, Tirupur District, Tamil Nadu 641668',
      coordinates: { latitude: 11.0950, longitude: 77.3000 },
      cleanliness: 2,
      safety: 2,
      privacy: 2,
      waterAvailability: 'unavailable',
      verificationStatus: 'unverified',
      status: { isOperational: true, isAccessible: false, lastUpdated: new Date() },
      lastUpdated: new Date(),
      createdAt: new Date(),
      reportCount: 0,
    },
  ];
  
  // Use Supabase stations if available, otherwise use fallback
  // Use useMemo to prevent flickering when supabaseStations updates
  const stations = useMemo(() => {
    // Always show fallback stations if Supabase has no data or is still loading
    if (supabaseStations.length > 0) {
      return supabaseStations;
    }
    return tirupurFallbackStations;
  }, [supabaseStations]);

  const isUsingFallbackStations = supabaseStations.length === 0;
  
  // Filter stations based on selected filter - MUST be defined before useEffect
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'verified') {
        // Show only verified stations (green markers)
        return station.verificationStatus === 'verified';
      }
      if (selectedFilter === 'under-repair') {
        // Show stations that are not operational or not accessible (yellow markers)
        return !station.status.isOperational || !station.status.isAccessible;
      }
      if (selectedFilter === 'unsafe') {
        // Show unsafe stations (red markers - safety <= 2 or non-operational)
        return station.safety <= 2 || !station.status.isOperational;
      }
      return true;
    });
  }, [stations, selectedFilter]);
  
  // Get Mapbox token, preferring runtime/build env values over app.json extras.
  const mapboxToken =
    (typeof process !== 'undefined' && process.env ? process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN : undefined) ||
    (typeof window !== 'undefined' ? (window as any).__EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN__ : undefined) ||
    Constants.expoConfig?.extra?.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ||
    Constants.expoConfig?.extra?.mapboxToken;
  
  // Check if Mapbox token is actually valid (not placeholder)
  const hasValidMapboxToken = mapboxToken && 
                              mapboxToken !== 'your_mapbox_token_here' && 
                              mapboxToken.trim().length > 0;

  // Reset fallback state when token/config changes
  useEffect(() => {
    setMapboxFailed(false);
  }, [hasValidMapboxToken]);
  
  // Debug logging - Now filteredStations is defined
  useEffect(() => {
    console.log('HomeMapScreen Debug:', {
      hasToken: !!mapboxToken,
      tokenLength: mapboxToken?.length,
      isValid: hasValidMapboxToken,
      platform: Platform.OS,
      hasMapView: !!MapView,
      stationsCount: stations.length,
      filteredCount: filteredStations.length,
      loading,
      error: error?.message
    });
  }, [mapboxToken, hasValidMapboxToken, stations.length, filteredStations.length, loading, error]);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'verified', label: 'Verified' },
    { id: 'under-repair', label: 'Under Repair' },
    { id: 'unsafe', label: 'Unsafe' },
  ];

  const handleSOSPress = () => {
    navigation.navigate('EmergencySOS');
  };

  const handleInfoPress = () => {
    navigation.navigate('Info');
  };

  const handleMarkerPress = (station: Station) => {
    console.log('Marker pressed:', station);
    // Navigate to station detail screen
    navigation.navigate('StationDetail', { stationId: station.id, station });
  };
  
  // Convert Station to MockStation format for MarkerOverlay (fallback when map not available)
  const mockStationsForOverlay = useMemo(() => {
    return filteredStations.map(station => ({
      id: station.id,
      name: station.name,
      latitude: station.coordinates.latitude,
      longitude: station.coordinates.longitude,
      status: (() => {
        if (!station.status.isOperational || !station.status.isAccessible) return 'caution';
        if (station.safety <= 2) return 'unsafe';
        if (station.verificationStatus === 'verified' && station.safety >= 4 && station.cleanliness >= 4) return 'safe';
        return 'caution';
      })() as 'safe' | 'caution' | 'unsafe',
    }));
  }, [filteredStations]);

  // Debug: Log current state
  console.log('[HomeMapScreen] Render state:', {
    loading,
    stationsCount: stations.length,
    filteredCount: filteredStations.length,
    selectedFilter,
    error: error?.message,
    hasMapboxToken: hasValidMapboxToken,
  });

  // Show loading state
  if (loading && stations.length === 0) {
    console.log('[HomeMapScreen] Showing loading state');
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading stations...</Text>
      </View>
    );
  }

  // Show error state only if it's a real error (not just missing Supabase config)
  if (
    error &&
    stations.length === 0 &&
    error.message &&
    !error.message.toLowerCase().includes('not configured') &&
    !isUsingFallbackStations
  ) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Error loading stations</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <PrimaryButton title="Retry" onPress={refresh} style={{ marginTop: spacing.md }} />
      </View>
    );
  }
  
  // If no stations and no error, show info message (Supabase not configured)
  if (!loading && stations.length === 0 && !error) {
    // Continue to render the map - it will show without markers
    // This is expected when Supabase isn't configured yet
  }

  console.log('[HomeMapScreen] Rendering main view with', filteredStations.length, 'filtered stations');

  return (
    <View style={styles.container}>
      {/* Debug overlay - only visible during development */}
      {__DEV__ && (
        <View style={styles.debugOverlay}>
          <Text style={styles.debugText}>
            Stations: {stations.length} | Filtered: {filteredStations.length} | Loading: {loading ? 'Yes' : 'No'}
          </Text>
          {error && !isUsingFallbackStations && <Text style={styles.debugError}>Error: {error.message}</Text>}
        </View>
      )}
      
      {/* Map Container - Full Screen */}
      <View style={styles.mapContainer}>
        {/* Use Mapbox on web when configured; fallback to prototype if unavailable */}
        {Platform.OS === 'web' && MapView && !mapboxFailed ? (
          <View style={styles.mapViewWrapper}>
            <MapView
              latitude={DEFAULT_CENTER.latitude}
              longitude={DEFAULT_CENTER.longitude}
              zoom={12}
              accessToken={hasValidMapboxToken ? mapboxToken : undefined}
              stations={filteredStations}
              onMarkerClick={handleMarkerPress}
              enableClustering={filteredStations.length > 50}
              onMapError={(mapError) => {
                console.warn('[HomeMapScreen] Mapbox unavailable, falling back to prototype:', mapError.message);
                setMapboxFailed(true);
              }}
            />
          </View>
        ) : (
          <TirupurMapPrototype
            stations={filteredStations}
            onMarkerClick={handleMarkerPress}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>

      {/* Map Legend - Top Right */}
      <View style={styles.legendContainer}>
        <MapLegend />
      </View>

      {/* Info Button - Top Right */}
      <View style={styles.infoButtonContainer}>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={handleInfoPress}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View app information"
          accessibilityHint="Opens information screen with app details and help"
        >
          <Text style={styles.infoButtonText}>ⓘ</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar - Top (Optional) */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Search stations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      {/* Filter Chips Row - Bottom */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <FilterChip
              key={filter.id}
              label={filter.label}
              selected={selectedFilter === filter.id}
              onPress={() => setSelectedFilter(filter.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Floating SOS Button - Bottom Right */}
      <View style={styles.sosButtonContainer}>
        <PrimaryButton
          title="SOS"
          onPress={handleSOSPress}
          style={styles.sosButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#B0B0B0', // Medium gray - very visible
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#808080', // Darker gray for better visibility
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
  },
  gridLineHorizontal: {
    width: '100%',
    height: 1,
  },
  loadingText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontSize: typography.fontSize.lg,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.md,
  },
  mapViewWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0, // Behind filter chips and SOS button (zIndex 10)
  },
  legendContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  infoButtonContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
    marginTop: 80, // Position below legend
  },
  infoButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  infoButtonText: {
    fontSize: 18,
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
  searchContainer: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },
  filterContainer: {
    position: 'absolute',
    bottom: spacing.xl + spacing.touchTarget.large + spacing.md, // Above SOS button
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  filterContent: {
    paddingVertical: spacing.sm,
  },
  sosButtonContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.md,
    zIndex: 10,
  },
  sosButton: {
    width: spacing.touchTarget.large,
    height: spacing.touchTarget.large,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.unsafe.primary,
    padding: 0,
    minHeight: spacing.touchTarget.large,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.styles.heading,
    color: colors.unsafe.primary,
    marginBottom: spacing.sm,
  },
  errorSubtext: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  debugOverlay: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: spacing.sm,
    borderRadius: spacing.radius.md,
    zIndex: 1000,
    maxWidth: 300,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  debugError: {
    color: '#EF4444',
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
});
