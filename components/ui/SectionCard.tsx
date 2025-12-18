import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing } from '../../theme';

interface SectionCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function SectionCard({
  children,
  style,
  noPadding = false,
}: SectionCardProps) {
  return (
    <View style={[styles.card, !noPadding && styles.padding, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.default,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  padding: {
    padding: spacing.padding.card,
  },
});

