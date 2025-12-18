import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../theme';

interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'safe' | 'caution' | 'unsafe';
}

interface MarkerOverlayProps {
  stations: Station[];
  /** Viewport bounds for coordinate conversion */
  viewport: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  /** Container dimensions */
  containerWidth: number;
  containerHeight: number;
  /** Callback when marker is pressed */
  onMarkerPress?: (station: Station) => void;
}

/**
 * MarkerOverlay Component
 * Renders colored dots positioned absolutely to simulate map markers
 * 
 * This is a temporary solution that simulates markers without a real map.
 * Converts lat/lng coordinates to screen positions.
 */
export default function MarkerOverlay({
  stations,
  viewport,
  containerWidth,
  containerHeight,
  onMarkerPress,
}: MarkerOverlayProps) {
  /**
   * Convert lat/lng to screen coordinates
   * Simple linear interpolation based on viewport bounds
   */
  const latLngToScreen = (lat: number, lng: number) => {
    const x = ((lng - viewport.minLng) / (viewport.maxLng - viewport.minLng)) * containerWidth;
    const y = ((viewport.maxLat - lat) / (viewport.maxLat - viewport.minLat)) * containerHeight;
    return { x, y };
  };

  /**
   * Get marker color based on status
   */
  const getMarkerColor = (status: Station['status']) => {
    switch (status) {
      case 'safe':
        return colors.safe.primary; // Green
      case 'caution':
        return colors.caution.primary; // Yellow
      case 'unsafe':
        return colors.unsafe.primary; // Red
      default:
        return colors.neutral.gray500;
    }
  };

  return (
    <>
      {stations.map((station) => {
        const { x, y } = latLngToScreen(station.latitude, station.longitude);
        
        return (
          <TouchableOpacity
            key={station.id}
            style={[
              styles.marker,
              {
                left: x,
                top: y,
                backgroundColor: getMarkerColor(station.status),
              },
            ]}
            onPress={() => onMarkerPress?.(station)}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${station.name}, ${station.status}`}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  marker: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.neutral.white,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    // Center the marker on the coordinate
    marginLeft: -8,
    marginTop: -8,
  },
});

