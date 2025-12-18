import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

export type StationMarkerType = 'verified-clean' | 'unverified' | 'unsafe';

interface StationMarkerProps {
  type: StationMarkerType;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

const markerConfig = {
  'verified-clean': {
    outerColor: colors.safe.primary,
    innerColor: colors.safe.light,
    borderColor: colors.safe.dark,
  },
  unverified: {
    outerColor: colors.caution.primary,
    innerColor: colors.caution.light,
    borderColor: colors.caution.dark,
  },
  unsafe: {
    outerColor: colors.unsafe.primary,
    innerColor: colors.unsafe.light,
    borderColor: colors.unsafe.dark,
  },
};

const sizeConfig = {
  small: {
    outer: 24,
    inner: 16,
    border: 2,
  },
  medium: {
    outer: 32,
    inner: 22,
    border: 3,
  },
  large: {
    outer: 40,
    inner: 28,
    border: 4,
  },
};

/**
 * Station Marker Component
 * Custom marker for station locations on the map
 * 
 * Usage with react-native-maps:
 * <Marker coordinate={...}>
 *   <StationMarker type="verified-clean" />
 * </Marker>
 */
export default function StationMarker({
  type,
  style,
  size = 'medium',
}: StationMarkerProps) {
  const config = markerConfig[type];
  const sizes = sizeConfig[size];

  return (
    <View
      style={[
        styles.container,
        {
          width: sizes.outer,
          height: sizes.outer,
        },
        style,
      ]}
      accessible={true}
      accessibilityLabel={`${type} station marker`}
      accessibilityRole="button"
    >
      {/* Outer ring */}
      <View
        style={[
          styles.outerRing,
          {
            width: sizes.outer,
            height: sizes.outer,
            borderRadius: sizes.outer / 2,
            backgroundColor: config.outerColor,
            borderWidth: sizes.border,
            borderColor: config.borderColor,
          },
        ]}
      />
      {/* Inner circle */}
      <View
        style={[
          styles.innerCircle,
          {
            width: sizes.inner,
            height: sizes.inner,
            borderRadius: sizes.inner / 2,
            backgroundColor: config.innerColor,
          },
        ]}
      />
      {/* Center dot for better visibility */}
      <View
        style={[
          styles.centerDot,
          {
            width: sizes.inner / 3,
            height: sizes.inner / 3,
            borderRadius: sizes.inner / 6,
            backgroundColor: config.borderColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    position: 'absolute',
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  innerCircle: {
    position: 'absolute',
  },
  centerDot: {
    position: 'absolute',
  },
});

