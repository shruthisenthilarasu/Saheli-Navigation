import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Accessibility hint for additional context */
  accessibilityHint?: string;
}

export default function SearchBar({
  placeholder = 'Search stations...',
  value,
  onChangeText,
  style,
  inputStyle,
  accessibilityLabel,
  accessibilityHint,
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        accessible={true}
        accessibilityRole="search"
        accessibilityLabel={accessibilityLabel || 'Search stations'}
        accessibilityHint={accessibilityHint || 'Enter station name or location to search'}
        // Color contrast: Primary text (#212121) on white background meets WCAG AA (4.5:1)
        // Placeholder text uses tertiary color for visual distinction while maintaining readability
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.default,
    borderRadius: spacing.radius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    ...typography.styles.body,
    color: colors.text.primary,
    padding: 0,
    margin: 0,
  },
});

