import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  /** Accessibility label for screen readers. Defaults to title if not provided */
  accessibilityLabel?: string;
  /** Accessibility hint for additional context */
  accessibilityHint?: string;
}

export default function SecondaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: SecondaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      // Touch target: minHeight ensures 48px minimum (WCAG AA compliant)
    >
      {loading ? (
        <ActivityIndicator color={colors.primary.main} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.background.default,
    borderWidth: 2,
    borderColor: colors.primary.main,
    paddingVertical: spacing.padding.button,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.radius.md,
    minHeight: spacing.touchTarget.comfortable,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    borderColor: colors.neutral.gray400,
    opacity: 0.6,
  },
  text: {
    ...typography.styles.button,
    color: colors.primary.main,
  },
});

