import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  /** Custom style for the legend container */
  style?: any;
}

/**
 * MapLegend Component
 * Small overlay showing what colored markers mean
 * 
 * Positioned in top-right, subtle design
 */
export default function MapLegend({ style }: MapLegendProps) {
  const legendItems: LegendItem[] = [
    { color: '#10B981', label: 'Verified' }, // Green - verified stations
    { color: '#F59E0B', label: 'Unverified' }, // Yellow/Amber - unverified stations
    { color: '#EF4444', label: 'Unsafe' }, // Red - non-operational or unsafe
  ];

  return (
    <View style={[styles.container, style]}>
      {legendItems.map((item, index) => (
        <View 
          key={index} 
          style={[
            styles.item,
            index === legendItems.length - 1 && styles.itemLast
          ]}
        >
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Subtle white background
    borderRadius: spacing.radius.md,
    padding: spacing.sm,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemLast: {
    marginBottom: 0,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.neutral.white,
  },
  label: {
    ...typography.styles.body,
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
});

