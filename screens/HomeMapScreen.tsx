import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { PrimaryButton, FilterChip, SearchBar } from '../components/ui';
import { HomeMapScreenProps } from '../navigation/types';
import MarkerOverlay from '../components/MarkerOverlay';
import MapLegend from '../components/MapLegend';

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

interface MockStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'safe' | 'caution' | 'unsafe';
}

/**
 * Mock station data for testing marker display
 * Temporary data to simulate stations on the map placeholder
 */
const mockStations: MockStation[] = [
  { id: '1', name: 'Station 1', latitude: 37.7849, longitude: -122.4094, status: 'safe' },
  { id: '2', name: 'Station 2', latitude: 37.7649, longitude: -122.4294, status: 'caution' },
  { id: '3', name: 'Station 3', latitude: 37.7749, longitude: -122.4194, status: 'safe' },
  { id: '4', name: 'Station 4', latitude: 37.7549, longitude: -122.4094, status: 'unsafe' },
  { id: '5', name: 'Station 5', latitude: 37.7849, longitude: -122.4294, status: 'safe' },
  { id: '6', name: 'Station 6', latitude: 37.7649, longitude: -122.4094, status: 'caution' },
];

// Default viewport bounds (San Francisco area)
const DEFAULT_VIEWPORT = {
  minLat: 37.75,
  maxLat: 37.80,
  minLng: -122.45,
  maxLng: -122.40,
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeMapScreen() {
  const navigation = useNavigation<HomeMapScreenProps['navigation']>();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

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

  const handleMarkerPress = (station: MockStation) => {
    console.log('Marker pressed:', station);
    // Navigate to station detail screen
    navigation.navigate('StationDetail', { stationId: station.id });
  };

  // Filter stations based on selected filter
  const filteredStations = mockStations.filter((station) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'verified') return station.status === 'safe';
    if (selectedFilter === 'under-repair') return station.status === 'caution';
    if (selectedFilter === 'unsafe') return station.status === 'unsafe';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Map Container - Full Screen */}
      <View style={styles.mapContainer}>
        {/* Always show grid placeholder as background */}
        <View 
          style={styles.mapPlaceholder}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setContainerDimensions({ width, height });
          }}
        >
          {/* Grid Pattern Background - Using simpler approach */}
          <View style={styles.gridPattern}>
            {/* Vertical lines */}
            {Array.from({ length: 20 }).map((_, i) => {
              const leftPercent = (i * 100) / 20;
              return (
                <View
                  key={`v-${i}`}
                  style={[
                    styles.gridLine,
                    styles.gridLineVertical,
                    { left: `${leftPercent}%` },
                  ]}
                />
              );
            })}
            {/* Horizontal lines */}
            {Array.from({ length: 15 }).map((_, i) => {
              const topPercent = (i * 100) / 15;
              return (
                <View
                  key={`h-${i}`}
                  style={[
                    styles.gridLine,
                    styles.gridLineHorizontal,
                    { top: `${topPercent}%` },
                  ]}
                />
              );
            })}
          </View>
          {/* Loading Text */}
          <Text style={styles.loadingText}>Map loading…</Text>
          
          {/* Station Markers Overlay */}
          <MarkerOverlay
            stations={filteredStations}
            viewport={DEFAULT_VIEWPORT}
            containerWidth={containerDimensions.width}
            containerHeight={containerDimensions.height}
            onMarkerPress={handleMarkerPress}
          />
        </View>

        {/* Overlay MapView on web if available - Temporarily disabled to show grid */}
        {false && Platform.OS === 'web' && MapView && (
          <View style={styles.mapViewWrapper}>
            <MapView
              latitude={37.7749}
              longitude={-122.4194}
              zoom={13}
              accessToken="pk.eyJ1Ijoic2hydXRoaXNlbnRoIiwiYSI6ImNtamFyM2RmbjA5Z28zZnJ6NjBoeXpjMngifQ.aI3FAp0ibBK_Hw07bqPeUA"
            />
          </View>
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
});
