import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import {
  StatusBadge,
  SectionCard,
  PrimaryButton,
  SecondaryButton,
  ScoreDisplay,
  AmenityItem,
} from '../components/ui';
import { StationDetailScreenProps } from '../navigation/types';

/**
 * StationDetailScreen UI
 * Displays station information, scores, amenities, and actions
 */

export default function StationDetailScreen() {
  const navigation = useNavigation<StationDetailScreenProps['navigation']>();
  const route = useRoute<StationDetailScreenProps['route']>();
  const { stationId } = route.params;
  
  // Placeholder data - in real app, fetch from API using stationId
  const stationName = `Station ${stationId}`;
  const status: 'safe' | 'caution' | 'unsafe' = 'safe';
  const distance = '0.5 km';
  const scores = {
    cleanliness: 4,
    safety: 5,
    water: 3,
    locks: 4,
    lighting: 5,
  };
  const amenities = [
    { icon: <Text>💧</Text>, label: 'Water Available', available: true },
    { icon: <Text>🩸</Text>, label: 'Sanitary Pads', available: true },
    { icon: <Text>💡</Text>, label: 'Good Lighting', available: true },
    { icon: <Text>♿</Text>, label: 'Accessible', available: false },
  ];

  const handleGetDirections = () => {
    // Navigation logic will be implemented later
    console.log('Get directions');
  };

  const handleReportIssue = () => {
    // Navigation logic will be implemented later
    console.log('Report issue');
  };
  const getStatusLabel = () => {
    switch (status) {
      case 'safe':
        return 'Verified Clean';
      case 'caution':
        return 'Under Repair';
      case 'unsafe':
        return 'Unsafe';
      default:
        return 'Unknown';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Section */}
      <SectionCard style={styles.headerCard}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.stationName}>{stationName}</Text>
            {distance && (
              <Text style={styles.distance}>{distance} away</Text>
            )}
          </View>
          <StatusBadge status={status} label={getStatusLabel()} />
        </View>
      </SectionCard>

      {/* Safety Score Breakdown */}
      <SectionCard style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Score Breakdown</Text>
        <ScoreDisplay label="Cleanliness" score={scores.cleanliness} />
        <ScoreDisplay label="Safety" score={scores.safety} />
        <ScoreDisplay label="Water Availability" score={scores.water} />
        <ScoreDisplay label="Locks" score={scores.locks} />
        <ScoreDisplay label="Lighting" score={scores.lighting} />
      </SectionCard>

      {/* Amenities List */}
      <SectionCard style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        {amenities.map((amenity, index) => (
          <AmenityItem
            key={index}
            icon={amenity.icon}
            label={amenity.label}
            available={amenity.available}
          />
        ))}
      </SectionCard>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <SecondaryButton
          title="Get Directions"
          onPress={handleGetDirections}
          fullWidth
          style={styles.directionsButton}
        />
        <PrimaryButton
          title="Report Issue"
          onPress={handleReportIssue}
          fullWidth
          style={styles.reportButton}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  stationName: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  distance: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  directionsButton: {
    marginBottom: spacing.sm,
  },
  reportButton: {
    backgroundColor: colors.unsafe.primary,
  },
});
