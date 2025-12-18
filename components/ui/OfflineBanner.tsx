import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface OfflineBannerProps {
  /** Position of the banner - 'top' or 'bottom' */
  position?: 'top' | 'bottom';
  /** Custom style for the container */
  style?: ViewStyle;
  /** Custom text style */
  textStyle?: ViewStyle;
  /** Whether the banner is visible */
  visible?: boolean;
}

/**
 * OfflineBanner Component
 * Small, non-blocking banner to indicate offline mode
 * Reusable across screens
 */
export default function OfflineBanner({
  position = 'top',
  style,
  textStyle,
  visible = true,
}: OfflineBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          borderBottomWidth: position === 'top' ? 1 : 0,
          borderTopWidth: position === 'bottom' ? 1 : 0,
          shadowOffset: {
            width: 0,
            height: position === 'top' ? 2 : -2,
          },
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel="Offline mode: data may be outdated"
    >
      <View style={styles.content}>
        <Text style={[styles.text, textStyle]}>
          Offline mode: data may be outdated
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: colors.caution.background,
    borderColor: colors.caution.primary,
    shadowColor: colors.neutral.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  topPosition: {
    top: 0,
  },
  bottomPosition: {
    bottom: 0,
  },
  content: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.styles.caption,
    color: colors.caution.dark,
    textAlign: 'center',
  },
});

