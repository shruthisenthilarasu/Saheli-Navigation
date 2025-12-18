import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { SectionCard, SecondaryButton } from '../components/ui';

/**
 * InfoScreen
 * Displays app information and help content
 */
export default function InfoScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionCard style={styles.section}>
          <Text style={styles.title}>About Saheli Station Finder</Text>
          <Text style={styles.body}>
            Saheli Station Finder helps you locate safe, clean, and accessible public restroom facilities.
            Find verified stations near you and report issues to help keep our community safe.
          </Text>
        </SectionCard>

        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <Text style={styles.body}>
            • Use the map to find stations near your location{'\n'}
            • Tap markers to view station details{'\n'}
            • Filter by status: Verified, Under Repair, or Unsafe{'\n'}
            • Report issues to help keep information up to date{'\n'}
            • Use the SOS button in emergencies
          </Text>
        </SectionCard>

        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Station Status</Text>
          <Text style={styles.body}>
            <Text style={styles.bold}>Verified:</Text> Clean, safe, and recently verified{'\n'}
            <Text style={styles.bold}>Under Repair:</Text> Temporarily unavailable or needs maintenance{'\n'}
            <Text style={styles.bold}>Unsafe:</Text> Reported issues - use caution
          </Text>
        </SectionCard>

        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Safety</Text>
          <Text style={styles.body}>
            Your safety is our priority. Use the SOS button if you need immediate help.
            Emergency contacts will be notified with your location.
          </Text>
        </SectionCard>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <SecondaryButton
          title="Close"
          onPress={() => navigation.goBack()}
          fullWidth
          accessibilityLabel="Close information screen"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl * 2,
  },
  section: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.styles.body,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.relaxed,
  },
  bold: {
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.background.default,
    borderTopWidth: 1,
    borderColor: colors.border.light,
  },
});

