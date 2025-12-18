import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export default function Checkbox({
  label,
  checked,
  onPress,
  style,
  labelStyle,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      // Touch target: Container padding ensures adequate touch area
      // Note: Checkbox itself (24x24px) is below 44px minimum, but entire row is tappable
      // Color contrast: Checkbox border and text meet WCAG AA requirements
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <View style={styles.checkmark} />}
      </View>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: spacing.radius.sm,
    borderWidth: 2,
    borderColor: colors.border.medium,
    backgroundColor: colors.background.default,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  checkmark: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.text.inverse,
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
});

