import * as Location from 'expo-location';
import { Platform, Alert } from 'react-native';
import { Audio } from 'expo-av';

/**
 * Permission handling service
 * Centralized permission management with graceful failure handling
 */

export enum PermissionStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  UNDETERMINED = 'undetermined',
  RESTRICTED = 'restricted',
}

export interface PermissionResult {
  granted: boolean;
  status: PermissionStatus;
  canAskAgain: boolean;
  message?: string;
}

/**
 * Request foreground location permission
 */
export async function requestLocationPermission(): Promise<PermissionResult> {
  try {
    const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

    return {
      granted: status === 'granted',
      status: status as PermissionStatus,
      canAskAgain: canAskAgain ?? true,
      message:
        status === 'granted'
          ? undefined
          : 'Location permission is required to show your location and nearby stations.',
    };
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
      message: 'Failed to request location permission.',
    };
  }
}

/**
 * Check foreground location permission status
 */
export async function checkLocationPermission(): Promise<PermissionResult> {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();

    return {
      granted: status === 'granted',
      status: status as PermissionStatus,
      canAskAgain: canAskAgain ?? true,
    };
  } catch (error) {
    console.error('Error checking location permission:', error);
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
    };
  }
}

/**
 * Request background location permission
 * Note: Background location requires additional setup in app.json
 */
export async function requestBackgroundLocationPermission(): Promise<PermissionResult> {
  try {
    // First check if foreground permission is granted
    const foregroundStatus = await checkLocationPermission();
    if (!foregroundStatus.granted) {
      return {
        granted: false,
        status: PermissionStatus.DENIED,
        canAskAgain: foregroundStatus.canAskAgain,
        message: 'Foreground location permission must be granted first.',
      };
    }

    // Request background permission
    const { status, canAskAgain } = await Location.requestBackgroundPermissionsAsync();

    return {
      granted: status === 'granted',
      status: status as PermissionStatus,
      canAskAgain: canAskAgain ?? true,
      message:
        status === 'granted'
          ? undefined
          : 'Background location permission is required for SOS features to work when app is in background.',
    };
  } catch (error) {
    console.error('Error requesting background location permission:', error);
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
      message: 'Failed to request background location permission.',
    };
  }
}

/**
 * Check background location permission status
 */
export async function checkBackgroundLocationPermission(): Promise<PermissionResult> {
  try {
    const { status, canAskAgain } = await Location.getBackgroundPermissionsAsync();

    return {
      granted: status === 'granted',
      status: status as PermissionStatus,
      canAskAgain: canAskAgain ?? true,
    };
  } catch (error) {
    console.error('Error checking background location permission:', error);
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
    };
  }
}

/**
 * Request audio playback permission
 * Required for playing alarm sounds
 */
export async function requestAudioPermission(): Promise<PermissionResult> {
  try {
    // On iOS, audio permissions are typically granted automatically
    // On Android, we may need to request RECORD_AUDIO permission
    if (Platform.OS === 'android') {
      // expo-av handles audio permissions automatically, but we can check
      const { status } = await Audio.requestPermissionsAsync();

      return {
        granted: status === 'granted',
        status: status as PermissionStatus,
        canAskAgain: status !== 'denied',
        message:
          status === 'granted'
            ? undefined
            : 'Audio permission is required to play alarm sounds.',
      };
    }

    // iOS doesn't require explicit permission for audio playback
    return {
      granted: true,
      status: PermissionStatus.GRANTED,
      canAskAgain: true,
    };
  } catch (error) {
    console.error('Error requesting audio permission:', error);
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
      message: 'Failed to request audio permission.',
    };
  }
}

/**
 * Check audio playback permission status
 */
export async function checkAudioPermission(): Promise<PermissionResult> {
  try {
    if (Platform.OS === 'android') {
      const { status } = await Audio.getPermissionsAsync();
      return {
        granted: status === 'granted',
        status: status as PermissionStatus,
        canAskAgain: status !== 'denied',
      };
    }

    // iOS doesn't require explicit permission
    return {
      granted: true,
      status: PermissionStatus.GRANTED,
      canAskAgain: true,
    };
  } catch (error) {
    console.error('Error checking audio permission:', error);
    return {
      granted: false,
      status: PermissionStatus.DENIED,
      canAskAgain: false,
    };
  }
}

/**
 * Request all required permissions for the app
 */
export async function requestAllPermissions(): Promise<{
  location: PermissionResult;
  backgroundLocation: PermissionResult;
  audio: PermissionResult;
}> {
  const location = await requestLocationPermission();
  const backgroundLocation = await requestBackgroundLocationPermission();
  const audio = await requestAudioPermission();

  return {
    location,
    backgroundLocation,
    audio,
  };
}

/**
 * Check all permission statuses
 */
export async function checkAllPermissions(): Promise<{
  location: PermissionResult;
  backgroundLocation: PermissionResult;
  audio: PermissionResult;
}> {
  const location = await checkLocationPermission();
  const backgroundLocation = await checkBackgroundLocationPermission();
  const audio = await checkAudioPermission();

  return {
    location,
    backgroundLocation,
    audio,
  };
}

/**
 * Show permission explanation alert
 */
export function showPermissionAlert(
  title: string,
  message: string,
  onOpenSettings?: () => void
): void {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel' },
      ...(onOpenSettings
        ? [
            {
              text: 'Open Settings',
              onPress: onOpenSettings,
            },
          ]
        : []),
    ],
    { cancelable: true }
  );
}

/**
 * Handle permission denial gracefully
 * Shows appropriate message and optionally opens settings
 */
export async function handlePermissionDenial(
  permission: PermissionResult,
  featureName: string,
  onOpenSettings?: () => void
): Promise<boolean> {
  if (permission.granted) {
    return true;
  }

  const title = `${featureName} Permission Required`;
  let message = permission.message || `Please grant ${featureName} permission to use this feature.`;

  if (!permission.canAskAgain) {
    message += '\n\nPlease enable it in your device settings.';
    showPermissionAlert(title, message, onOpenSettings);
    return false;
  }

  showPermissionAlert(title, message);
  return false;
}

/**
 * Get location with permission handling
 * Returns null if permission denied, with graceful fallback
 */
export async function getLocationWithPermission(
  options?: Location.LocationOptions
): Promise<Location.LocationObject | null> {
  const permission = await checkLocationPermission();

  if (!permission.granted) {
    const requested = await requestLocationPermission();
    if (!requested.granted) {
      await handlePermissionDenial(requested, 'Location', () => {
        // Could open settings here if needed
      });
      return null;
    }
  }

  try {
    return await Location.getCurrentPositionAsync(options);
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
}

/**
 * Get background location with permission handling
 * Returns null if permission denied
 */
export async function getBackgroundLocationWithPermission(): Promise<PermissionResult> {
  const permission = await checkBackgroundLocationPermission();

  if (!permission.granted) {
    const requested = await requestBackgroundLocationPermission();
    if (!requested.granted) {
      await handlePermissionDenial(requested, 'Background Location', () => {
        // Could open settings here if needed
      });
      return requested;
    }
    return requested;
  }

  return permission;
}

/**
 * Play audio with permission handling
 * Returns false if permission denied
 */
export async function playAudioWithPermission(
  soundSource: any,
  options?: { shouldPlay?: boolean; isLooping?: boolean; volume?: number }
): Promise<boolean> {
  const permission = await checkAudioPermission();

  if (!permission.granted) {
    const requested = await requestAudioPermission();
    if (!requested.granted) {
      await handlePermissionDenial(requested, 'Audio', () => {
        // Could open settings here if needed
      });
      return false;
    }
  }

  try {
    const { sound } = await Audio.Sound.createAsync(soundSource, {
      shouldPlay: true,
      isLooping: false,
      volume: 1.0,
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Error playing audio:', error);
    return false;
  }
}

