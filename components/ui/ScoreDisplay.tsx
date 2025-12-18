import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, spacing, typography } from '../../theme';

interface ScoreDisplayProps {
  label: string;
  score: number;
  maxScore?: number;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  scoreStyle?: TextStyle;
}

export default function ScoreDisplay({
  label,
  score,
  maxScore = 5,
  style,
  labelStyle,
  scoreStyle,
}: ScoreDisplayProps) {
  const percentage = (score / maxScore) * 100;
  const getScoreColor = () => {
    if (score >= 4) return colors.safe.primary;
    if (score >= 3) return colors.caution.primary;
    return colors.unsafe.primary;
  };

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${score} out of ${maxScore}`}
      // Screen reader: Announces both label and score value for context
      // Color coding: Visual indicators (green/yellow/red) supplemented with text for accessibility
    >
      <View style={styles.header}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
        <Text style={[styles.score, { color: getScoreColor() }, scoreStyle]}>
          {score}/{maxScore}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${percentage}%`,
              backgroundColor: getScoreColor(),
            },
          ]}
          // Visual progress bar - color provides additional context
          // Note: Progress value is announced via accessibilityLabel above
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.styles.label,
    color: colors.text.secondary,
  },
  score: {
    ...typography.styles.bodyBold,
    fontSize: typography.fontSize.md,
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.neutral.gray200,
    borderRadius: spacing.radius.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: spacing.radius.sm,
  },
});

