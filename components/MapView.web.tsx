import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Station } from '../types/models';
import { colors } from '../theme';

interface MapViewProps {
  /** Initial latitude */
  latitude?: number;
  /** Initial longitude */
  longitude?: number;
  /** Initial zoom level */
  zoom?: number;
  /** Mapbox access token */
  accessToken?: string;
  /** Style URL for the map */
  styleURL?: string;
  /** Callback when map is ready */
  onMapReady?: (map: mapboxgl.Map) => void;
  /** Callback when map cannot be initialized */
  onMapError?: (error: Error) => void;
  /** Container style */
  style?: React.CSSProperties;
  /** Stations to display as markers */
  stations?: Station[];
  /** Callback when a marker is clicked */
  onMarkerClick?: (station: Station) => void;
  /** Enable marker clustering for performance (default: true if >50 stations) */
  enableClustering?: boolean;
}

/**
 * MapView Component for Web
 * Renders a Mapbox GL JS map using mapbox-gl
 * 
 * Features:
 * - Initializes Mapbox GL JS map
 * - Fills parent container
 * - Centers on default location
 */
export default function MapView({
  latitude = 11.1085, // Tirupur, Tamil Nadu, India
  longitude = 77.3411, // Tirupur, Tamil Nadu, India
  zoom = 13,
  accessToken,
  styleURL = 'mapbox://styles/mapbox/streets-v11',
  onMapReady,
  onMapError,
  style,
  stations = [],
  onMarkerClick,
  enableClustering,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const shouldCluster = enableClustering !== undefined ? enableClustering : stations.length > 50;

  useEffect(() => {
    if (!mapContainer.current) {
      console.warn('Map container ref is not available');
      return;
    }

    // Try to get token from props first, then environment variables
    const token = accessToken || 
                  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN) ||
                  (typeof window !== 'undefined' && (window as any).__EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN__);
    
    console.log('Mapbox token check:', { 
      hasAccessToken: !!accessToken, 
      hasEnvToken: !!(typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN),
      tokenLength: token?.length 
    });

    if (!token) {
      onMapError?.(new Error('Mapbox token missing'));
      console.warn(
        '⚠️ Mapbox access token not provided. Map will not render.\n' +
        'Please set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file or pass accessToken prop.\n' +
        'Get your token at: https://account.mapbox.com/access-tokens/'
      );
      // Show error message in container
      if (mapContainer.current) {
        mapContainer.current.style.backgroundColor = '#f5f5f5';
        mapContainer.current.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            font-family: system-ui;
            text-align: center;
            padding: 20px;
          ">
            <div>
              <p style="font-size: 16px; margin-bottom: 8px;">⚠️ Mapbox token missing</p>
              <p style="font-size: 12px;">Please set EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN</p>
            </div>
          </div>
        `;
      }
      return;
    }

    // Set Mapbox access token
    mapboxgl.accessToken = token;

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: styleURL,
        center: [longitude, latitude],
        zoom: zoom,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Call onMapReady callback when map loads
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (onMapReady && map.current) {
          onMapReady(map.current);
        }
        // Add markers after map loads
        if (stations.length > 0 && map.current) {
          addMarkersToMap(map.current, stations);
        }
      });
      
      // Also add markers if map is already loaded (for when stations prop changes)
      if (map.current.loaded() && stations.length > 0) {
        addMarkersToMap(map.current, stations);
      }

      // Handle errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        // Show error state
        if (mapContainer.current) {
          mapContainer.current.style.backgroundColor = '#f5f5f5';
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      onMapError?.(error instanceof Error ? error : new Error('Error initializing Mapbox'));
      // Show error state
      if (mapContainer.current) {
        mapContainer.current.style.backgroundColor = '#f5f5f5';
      }
    }

    // Cleanup on unmount
    return () => {
      // Remove all markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, zoom, styleURL, accessToken, onMapError, onMapReady]);

  // Update markers when stations change
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add new markers if stations are provided
      if (stations.length > 0) {
        addMarkersToMap(map.current, stations);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations]);

  /**
   * Get marker color based on station status
   */
  function getMarkerColor(station: Station): string {
    // Under repair if not operational or not accessible
    if (!station.status.isOperational || !station.status.isAccessible) {
      return colors.caution.primary; // Yellow/Amber
    }
    
    // Unsafe if safety score is 1 or 2
    if (station.safety <= 2) {
      return colors.unsafe.primary; // Red
    }
    
    // Verified clean if verified and safety/cleanliness are high
    if (
      station.verificationStatus === 'verified' &&
      station.safety >= 4 &&
      station.cleanliness >= 4
    ) {
      return colors.safe.primary; // Green
    }
    
    // Default to caution
    return colors.caution.primary;
  }

  /**
   * Create marker element for a station
   */
  function createMarkerElement(station: Station): HTMLElement {
    const el = document.createElement('div');
    const color = getMarkerColor(station);
    
    el.className = 'station-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = color;
    el.style.border = `3px solid ${colors.neutral.white}`;
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.transition = 'box-shadow 0.15s ease';
    
    // Keep hover feedback without changing marker position/size.
    el.addEventListener('mouseenter', () => {
      el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    });
    
    // Add title for accessibility
    el.title = station.name || 'Station';
    
    return el;
  }

  /**
   * Add markers to the map
   */
  function addMarkersToMap(mapInstance: mapboxgl.Map, stationsToAdd: Station[]) {
    if (shouldCluster && stationsToAdd.length > 50) {
      // Use clustering for performance
      addClusteredMarkers(mapInstance, stationsToAdd);
    } else {
      // Add individual markers
      stationsToAdd.forEach(station => {
        const el = createMarkerElement(station);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([station.coordinates.longitude, station.coordinates.latitude])
          .addTo(mapInstance);
        
        // Add click handler
        if (onMarkerClick) {
          el.addEventListener('click', () => {
            onMarkerClick(station);
          });
        }
        
        markersRef.current.push(marker);
      });
    }
  }

  /**
   * Add clustered markers using Mapbox's built-in clustering
   * This is more performant for large numbers of stations
   */
  function addClusteredMarkers(mapInstance: mapboxgl.Map, stationsToAdd: Station[]) {
    // For clustering, we need to use GeoJSON source with clustering enabled
    // This is a simplified version - for full clustering, you'd need to set up a GeoJSON source
    // For now, we'll just add markers but limit the visible ones based on zoom level
    
    const bounds = mapInstance.getBounds();
    const visibleStations = stationsToAdd.filter(station => {
      return bounds.contains([station.coordinates.longitude, station.coordinates.latitude]);
    });
    
    // Limit to 100 visible markers at a time for performance
    const stationsToShow = visibleStations.slice(0, 100);
    
    stationsToShow.forEach(station => {
      const el = createMarkerElement(station);
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.coordinates.longitude, station.coordinates.latitude])
        .addTo(mapInstance);
      
      if (onMarkerClick) {
        el.addEventListener('click', () => {
          onMarkerClick(station);
        });
      }
      
      markersRef.current.push(marker);
    });
    
    // Update markers when map moves
    const updateMarkers = () => {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add new visible markers
      const newBounds = mapInstance.getBounds();
      const newVisibleStations = stationsToAdd.filter(station => {
        return newBounds.contains([station.coordinates.longitude, station.coordinates.latitude]);
      }).slice(0, 100);
      
      newVisibleStations.forEach(station => {
        const el = createMarkerElement(station);
        const marker = new mapboxgl.Marker(el)
          .setLngLat([station.coordinates.longitude, station.coordinates.latitude])
          .addTo(mapInstance);
        
        if (onMarkerClick) {
          el.addEventListener('click', () => {
            onMarkerClick(station);
          });
        }
        
        markersRef.current.push(marker);
      });
    };
    
    mapInstance.on('moveend', updateMarkers);
    mapInstance.on('zoomend', updateMarkers);
  }

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent', // Transparent so grid shows through
        minHeight: '100%',
        minWidth: '100%',
        ...style,
      }}
    />
  );
}
