import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { SectionCard, SecondaryButton } from '../components/ui';

/**
 * InfoScreen
 * Displays app information and help content
 */
export default function InfoScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'app' | 'tool'>('app');

  const tabTitle = useMemo(
    () => (activeTab === 'app' ? 'About Saheli Station Finder' : 'About This Tool'),
    [activeTab]
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tabsRow}>
          <Pressable
            style={[styles.tabButton, activeTab === 'app' && styles.tabButtonActive]}
            onPress={() => setActiveTab('app')}
            accessibilityRole="button"
            accessibilityLabel="Show About App information"
          >
            <Text style={[styles.tabLabel, activeTab === 'app' && styles.tabLabelActive]}>About App</Text>
          </Pressable>
          <Pressable
            style={[styles.tabButton, activeTab === 'tool' && styles.tabButtonActive]}
            onPress={() => setActiveTab('tool')}
            accessibilityRole="button"
            accessibilityLabel="Show About Tool information"
          >
            <Text style={[styles.tabLabel, activeTab === 'tool' && styles.tabLabelActive]}>About Tool</Text>
          </Pressable>
        </View>

        <SectionCard style={styles.section}>
          <Text style={styles.title}>{tabTitle}</Text>
          {activeTab === 'app' ? (
            <Text style={styles.body}>
              Saheli Station Finder helps you locate safe, clean, and accessible public restroom facilities.
              Find verified stations near you and report issues to help keep our community safe.
            </Text>
          ) : (
            <Text style={styles.body}>
              This tool provides a map-first safety view with status markers, filters, and quick actions.
              It supports station discovery, directions, issue reporting, and emergency access from one place.
            </Text>
          )}
        </SectionCard>

        {activeTab === 'app' ? (
          <>
            <SectionCard style={styles.section}>
              <Text style={styles.sectionTitle}>How to Use</Text>
              <Text style={styles.body}>
                - Use the map to find stations near your location{'\n'}
                - Tap markers to view station details{'\n'}
                - Filter by status: Verified, Under Repair, or Unsafe{'\n'}
                - Report issues to help keep information up to date{'\n'}
                - Use the SOS button in emergencies
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
          </>
        ) : (
          <>
            <SectionCard style={styles.section}>
              <Text style={styles.sectionTitle}>What It Can Do</Text>
              <Text style={styles.body}>
                - Show stations on an interactive map{'\n'}
                - Open directions to selected stations{'\n'}
                - Let users report unsafe or unclean conditions{'\n'}
                - Provide fallback station data when live services are unavailable{'\n'}
                - Offer SOS access from the main screen
              </Text>
            </SectionCard>

            <SectionCard style={styles.section}>
              <Text style={styles.sectionTitle}>Current Implementation</Text>
              <Text style={styles.body}>
                - Mapbox is enabled for web with graceful fallback{'\n'}
                - Station detail actions for directions and reports are functional{'\n'}
                - Report submissions show in-app success feedback
              </Text>
            </SectionCard>

            <SectionCard style={styles.section}>
              <Text style={styles.sectionTitle}>Next Steps</Text>
              <Text style={styles.body}>
                - Complete SOS backend workflow end-to-end{'\n'}
                - Improve offline sync and report conflict handling{'\n'}
                - Add production monitoring and deployment checks
              </Text>
            </SectionCard>
          </>
        )}
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
  tabsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.background.paper,
    borderRadius: spacing.radius.md,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: spacing.radius.sm,
  },
  tabButtonActive: {
    backgroundColor: colors.primary.main,
  },
  tabLabel: {
    ...typography.styles.button,
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
  },
  tabLabelActive: {
    color: colors.text.inverse,
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

