import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  /** Container style */
  style?: React.CSSProperties;
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
  latitude = 37.7749,
  longitude = -122.4194,
  zoom = 13,
  accessToken,
  styleURL = 'mapbox://styles/mapbox/streets-v11',
  onMapReady,
  style,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      console.warn('Map container ref is not available');
      return;
    }

    // Try to get token from props first, then environment variables
    const token = accessToken || 
                  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || 
                  process.env.MAPBOX_ACCESS_TOKEN;

    if (!token) {
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
      });

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
      // Show error state
      if (mapContainer.current) {
        mapContainer.current.style.backgroundColor = '#f5f5f5';
      }
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [latitude, longitude, zoom, styleURL, accessToken, onMapReady]);

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
