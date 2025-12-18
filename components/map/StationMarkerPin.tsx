import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

export type StationMarkerType = 'verified-clean' | 'unverified' | 'unsafe';

interface StationMarkerPinProps {
  type: StationMarkerType;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const markerConfig = {
  'verified-clean': {
    pinColor: colors.safe.primary,
    pinDark: colors.safe.dark,
    shadowColor: colors.safe.dark,
  },
  unverified: {
    pinColor: colors.caution.primary,
    pinDark: colors.caution.dark,
    shadowColor: colors.caution.dark,
  },
  unsafe: {
    pinColor: colors.unsafe.primary,
    pinDark: colors.unsafe.dark,
    shadowColor: colors.unsafe.dark,
  },
};

const sizeConfig = {
  small: {
    width: 20,
    height: 28,
    circle: 16,
  },
  medium: {
    width: 24,
    height: 34,
    circle: 20,
  },
  large: {
    width: 28,
    height: 40,
    circle: 24,
  },
};

/**
 * Station Marker Pin Component
 * Pin-style marker with drop shadow for better visibility
 * 
 * Usage with react-native-maps:
 * <Marker coordinate={...} anchor={{ x: 0.5, y: 1 }}>
 *   <StationMarkerPin type="verified-clean" />
 * </Marker>
 */
export default function StationMarkerPin({
  type,
  style,
  size = 'medium',
}: StationMarkerPinProps) {
  const config = markerConfig[type];
  const sizes = sizeConfig[size];

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityLabel={`${type} station marker`}
      accessibilityRole="button"
    >
      {/* Pin shape */}
      <View
        style={[
          styles.pin,
          {
            width: sizes.width,
            height: sizes.height,
            backgroundColor: config.pinColor,
            borderColor: config.pinDark,
            borderWidth: 2,
            borderRadius: sizes.width / 2,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            shadowColor: config.shadowColor,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
        ]}
      >
        {/* Top circle */}
        <View
          style={[
            styles.circle,
            {
              width: sizes.circle,
              height: sizes.circle,
              borderRadius: sizes.circle / 2,
              backgroundColor: config.pinColor,
              borderColor: config.pinDark,
              borderWidth: 2,
              marginTop: -sizes.width / 2,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          {/* Inner highlight */}
          <View
            style={[
              styles.highlight,
              {
                width: sizes.circle * 0.6,
                height: sizes.circle * 0.6,
                borderRadius: sizes.circle * 0.3,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pin: {
    // Styles applied inline for dynamic sizing
  },
  circle: {
    // Styles applied inline for dynamic sizing
  },
  highlight: {
    // Styles applied inline for dynamic sizing
  },
});
