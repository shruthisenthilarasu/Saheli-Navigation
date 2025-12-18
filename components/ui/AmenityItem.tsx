import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface AmenityItemProps {
  icon: React.ReactNode;
  label: string;
  available?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  /** Accessibility label override for screen readers */
  accessibilityLabel?: string;
}

export default function AmenityItem({
  icon,
  label,
  available = true,
  style,
  labelStyle,
  accessibilityLabel,
}: AmenityItemProps) {
  const defaultLabel = `${label}${available ? ', available' : ', unavailable'}`;
  
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || defaultLabel}
      // Screen reader: Announces amenity name and availability status
      // Visual indicator: Icon opacity change (0.4) for unavailable items
      // Note: Icon emoji may not be accessible - consider using icon library with accessibility support
    >
      <View style={[styles.iconContainer, !available && styles.iconDisabled]}>
        {icon}
      </View>
      <Text
        style={[
          styles.label,
          !available && styles.labelDisabled,
          labelStyle,
        ]}
      >
        {label}
      </Text>
      {!available && (
        <Text style={styles.unavailableText}>Unavailable</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: spacing.icon.md,
    height: spacing.icon.md,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDisabled: {
    opacity: 0.4,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  labelDisabled: {
    color: colors.text.tertiary,
  },
  unavailableText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
});

