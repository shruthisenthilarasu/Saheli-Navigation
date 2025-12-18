import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Station } from '../types/models';
import { fetchStations } from '../services/supabase';
import {
  checkLocationPermission,
  getLocationWithPermission,
  handlePermissionDenial,
} from '../services/permissions';
import { StationMarkerPin } from '../components/StationMarkerPin';

/**
 * MapScreen Component
 * Displays station markers on a map centered on user location
 * 
 * Features:
 * - User GPS location
 * - Station markers (color-coded by status)
 * - Tappable markers for details
 * 
 * Note: Business logic implemented but requires Supabase configuration
 */

/**
 * Marker types for color coding
 */
type MarkerType = 'verified' | 'unverified' | 'unsafe';

/**
 * Get marker color based on station status
 */
function getMarkerColor(type: MarkerType): string {
  switch (type) {
    case 'verified':
      return '#4CAF50'; // Green
    case 'unverified':
      return '#FFC107'; // Yellow
    case 'unsafe':
      return '#F44336'; // Red
    default:
      return '#2196F3'; // Blue (default)
  }
}

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadStations();
    }
  }, [userLocation]);

  const initializeLocation = async () => {
    try {
      // Use permission service for graceful handling
      const location = await getLocationWithPermission();
      
      if (location) {
        setUserLocation(location);
      } else {
        // Permission denied - set default location
        setUserLocation({
          coords: {
            latitude: 37.7749,
            longitude: -122.4194,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      // Set default location on error
      setUserLocation({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
          altitude: null,
          accuracy: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
    }
  };

  const loadStations = async () => {
    try {
      if (!userLocation) return;

      const fetchedStations = await fetchStations({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        radiusMeters: 5000,
      });

      setStations(fetchedStations);
    } catch (error) {
      console.error('Error fetching stations:', error);
      Alert.alert('Error', 'Failed to load stations. Using cached data if available.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (station: Station) => {
    setSelectedStation(station);
    Alert.alert(
      station.name,
      `Status: ${station.status}\nCleanliness: ${station.safetyScore.cleanliness}/5`
    );
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {stations.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.location.latitude,
              longitude: station.location.longitude,
            }}
            onPress={() => handleMarkerPress(station)}
            title={station.name}
            description={`Status: ${station.status}`}
          >
            <StationMarkerPin
              type={
                station.status === 'safe'
                  ? 'verified'
                  : station.status === 'unsafe'
                  ? 'unsafe'
                  : 'unverified'
              }
              size="medium"
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});
