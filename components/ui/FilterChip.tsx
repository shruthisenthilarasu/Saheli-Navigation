import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Accessibility hint for additional context */
  accessibilityHint?: string;
}

export default function FilterChip({
  label,
  selected = false,
  onPress,
  style,
  textStyle,
  accessibilityHint,
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && styles.chipSelected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Filter: ${label}${selected ? ', selected' : ''}`}
      accessibilityHint={accessibilityHint || `Tap to ${selected ? 'deselect' : 'select'} ${label} filter`}
      accessibilityState={{ selected }}
      // Touch target: Padding ensures adequate touch area (WCAG AA: minimum 44x44px)
      // Note: Horizontal padding may need adjustment if chips are too small
    >
      <Text style={[styles.text, selected && styles.textSelected, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.background.default,
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginRight: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  text: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  textSelected: {
    color: colors.text.inverse,
  },
});

