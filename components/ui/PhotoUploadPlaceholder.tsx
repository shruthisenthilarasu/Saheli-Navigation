import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface PhotoUploadPlaceholderProps {
  onPress?: () => void;
  hasPhoto?: boolean;
  style?: ViewStyle;
}

export default function PhotoUploadPlaceholder({
  onPress,
  hasPhoto = false,
  style,
}: PhotoUploadPlaceholderProps) {
  return (
    <TouchableOpacity
      style={[styles.container, hasPhoto && styles.containerWithPhoto, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={hasPhoto ? 'Change photo' : 'Add photo (optional)'}
      accessibilityHint={hasPhoto ? 'Tap to change the uploaded photo' : 'Tap to add a photo to your report'}
      // Touch target: minHeight (120px) exceeds WCAG AA minimum (44px)
      // Visual feedback: Border style changes (dashed to solid) and color change when photo added
      // Note: Emoji icon may not be accessible - consider using icon library with accessibility support
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📷</Text>
      </View>
      <Text style={styles.label}>
        {hasPhoto ? 'Photo added' : 'Add photo (optional)'}
      </Text>
      {hasPhoto && (
        <Text style={styles.hint}>Tap to change</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border.light,
    borderRadius: spacing.radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.paper,
    minHeight: 120,
  },
  containerWithPhoto: {
    borderColor: colors.primary.main,
    borderStyle: 'solid',
    backgroundColor: colors.primary.background,
  },
  iconContainer: {
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 32,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  hint: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },
});

