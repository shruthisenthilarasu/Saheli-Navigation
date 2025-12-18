import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

type StatusType = 'safe' | 'caution' | 'unsafe';

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const statusConfig = {
  safe: {
    backgroundColor: colors.safe.primary,
    textColor: colors.text.inverse,
  },
  caution: {
    backgroundColor: colors.caution.primary,
    textColor: colors.text.inverse,
  },
  unsafe: {
    backgroundColor: colors.unsafe.primary,
    textColor: colors.text.inverse,
  },
};

export default function StatusBadge({
  status,
  label,
  style,
  textStyle,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        style,
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
      // Color contrast: Using inverse text on colored backgrounds ensures WCAG AA compliance
      // Status colors (green/yellow/red) with white text meet contrast requirements
    >
      <Text style={[styles.text, { color: config.textColor }, textStyle]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.styles.label,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
});

