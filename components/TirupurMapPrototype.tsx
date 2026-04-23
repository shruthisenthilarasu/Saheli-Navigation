import React from 'react';
import { View, StyleSheet, Pressable, Text, LayoutChangeEvent } from 'react-native';
import { Station } from '../types/models';
import { colors } from '../theme';

interface TirupurMapPrototypeProps {
  stations: Station[];
  onMarkerClick?: (station: Station) => void;
  style?: any;
}

// Tirupur map bounds
const MAP_BOUNDS = {
  minLat: 11.07,
  maxLat: 11.15,
  minLng: 77.29,
  maxLng: 77.40,
};

/**
 * Convert lat/lng coordinates to pixel positions on the map
 */
function latLngToPixel(lat: number, lng: number, mapWidth: number, mapHeight: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * mapWidth;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * mapHeight;
  return { x, y };
}

/**
 * Get marker color based on station status
 */
function getMarkerColor(station: Station): string {
  // Non-operational stations are always red
  if (!station.status.isOperational) {
    return '#EF4444'; // Red
  }
  
  // Operational stations colored by verification
  switch (station.verificationStatus) {
    case 'verified':
      return '#10B981'; // Green
    case 'unverified':
      return '#F59E0B'; // Yellow/Amber
    default:
      return '#6B7280'; // Gray
  }
}

/**
 * SVG-based map prototype for Tirupur city
 * Displays stations with color-coded markers based on verification status
 */
export default function TirupurMapPrototype({ 
  stations = [], 
  onMarkerClick, 
  style 
}: TirupurMapPrototypeProps) {
  const [mapSize, setMapSize] = React.useState({ width: 800, height: 600 });
  const mapWidth = mapSize.width;
  const mapHeight = mapSize.height;

  const handleLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setMapSize({ width, height });
    }
  }, []);

  // Debug logging
  console.log('[TirupurMapPrototype] Rendering:', {
    stationsCount: stations.length,
    mapWidth,
    mapHeight,
  });

  // Error boundary - ensure we always render something
  try {
    return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      {/* SVG Map Background */}
      <View style={styles.mapBackground}>
        {/* Grid pattern for visual reference */}
        <View style={styles.gridContainer}>
          {/* Vertical grid lines */}
          {Array.from({ length: 12 }).map((_, i) => {
            const xPercent = (i * 100) / 12;
            return (
              <View
                key={`grid-v-${i}`}
                style={[
                  styles.gridLine,
                  styles.gridLineVertical,
                  { left: `${xPercent}%` },
                ]}
              />
            );
          })}
          {/* Horizontal grid lines */}
          {Array.from({ length: 10 }).map((_, i) => {
            const yPercent = (i * 100) / 10;
            return (
              <View
                key={`grid-h-${i}`}
                style={[
                  styles.gridLine,
                  styles.gridLineHorizontal,
                  { top: `${yPercent}%` },
                ]}
              />
            );
          })}
        </View>

        {/* City area labels */}
        <View style={styles.cityLabels}>
          <View style={[styles.cityLabel, { top: '45%', left: '50%' }]}>
            <Text style={styles.cityLabelText}>Tirupur City Center</Text>
          </View>
          <View style={[styles.cityLabel, { top: '15%', left: '80%' }]}>
            <Text style={styles.cityLabelText}>North</Text>
          </View>
          <View style={[styles.cityLabel, { top: '75%', left: '20%' }]}>
            <Text style={styles.cityLabelText}>South</Text>
          </View>
          <View style={[styles.cityLabel, { top: '40%', left: '90%' }]}>
            <Text style={styles.cityLabelText}>East</Text>
          </View>
          <View style={[styles.cityLabel, { top: '50%', left: '5%' }]}>
            <Text style={styles.cityLabelText}>West</Text>
          </View>
        </View>

        {/* Render station markers */}
        {stations.map((station) => {
          const { x, y } = latLngToPixel(
            station.coordinates.latitude,
            station.coordinates.longitude,
            mapWidth,
            mapHeight
          );
          const markerColor = getMarkerColor(station);

          return (
            <Pressable
              key={station.id}
              style={[
                styles.marker,
                {
                  left: x - 12,
                  top: y - 12,
                  backgroundColor: markerColor,
                },
              ]}
              onPress={() => onMarkerClick?.(station)}
              hitSlop={10}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${station.name}, ${station.verificationStatus}`}
            >
              {/* Marker pulse effect */}
              <View
                style={[
                  styles.markerPulse,
                  { backgroundColor: markerColor },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
    );
  } catch (error) {
    console.error('[TirupurMapPrototype] Error rendering:', error);
    return (
      <View style={[styles.container, style, { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#EF4444', fontSize: 16, fontWeight: 'bold' }}>
          Map Error: {error instanceof Error ? error.message : 'Unknown error'}
        </Text>
        <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 8 }}>
          Check console for details
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Above Mapbox map (zIndex 0) but below UI elements (zIndex 10)
  },
  mapBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6', // Light gray background
    position: 'relative',
  },
  gridContainer: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  gridLineVertical: {
    width: 1,
    height: '100%',
  },
  gridLineHorizontal: {
    width: '100%',
    height: 1,
  },
  cityLabels: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cityLabel: {
    position: 'absolute',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  cityLabelText: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: '500',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  marker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.white,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.3,
  },
});

