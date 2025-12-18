import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface IconLabelRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  /** Accessibility label override for screen readers */
  accessibilityLabel?: string;
}

export default function IconLabelRow({
  icon,
  label,
  value,
  style,
  labelStyle,
  valueStyle,
  accessibilityLabel,
}: IconLabelRowProps) {
  const defaultLabel = value ? `${label}: ${value}` : label;
  const finalLabel = accessibilityLabel || defaultLabel;
  
  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={finalLabel}
      // Screen reader: Announces both label and value together for context
      // Note: Icon is decorative and not announced (iconContainer not accessible)
      // Color contrast: Label uses secondary color, value uses primary - both meet WCAG AA
    >
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        {value && <Text style={[styles.value, valueStyle]}>{value}</Text>}
      </View>
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
    marginRight: spacing.md,
    width: spacing.icon.md,
    height: spacing.icon.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  label: {
    ...typography.styles.label,
    color: colors.text.secondary,
    marginBottom: spacing.xs / 2,
  },
  value: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
});

