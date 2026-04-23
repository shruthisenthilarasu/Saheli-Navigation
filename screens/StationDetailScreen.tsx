import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Platform,
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
import ReportStationIssueModal from '../components/ReportStationIssueModal';

/**
 * StationDetailScreen UI
 * Displays station information, scores, amenities, and actions
 */

export default function StationDetailScreen() {
  const navigation = useNavigation<StationDetailScreenProps['navigation']>();
  const route = useRoute<StationDetailScreenProps['route']>();
  const { stationId, station } = route.params;
  const [isReportModalVisible, setIsReportModalVisible] = React.useState(false);
  
  const stationName = station?.name ?? `Station ${stationId}`;
  const status: 'safe' | 'caution' | 'unsafe' = !station
    ? 'safe'
    : !station.status.isOperational || !station.status.isAccessible
      ? 'caution'
      : station.safety <= 2
        ? 'unsafe'
        : 'safe';
  const distance = '0.5 km';
  const scores = {
    cleanliness: station?.cleanliness ?? 4,
    safety: station?.safety ?? 5,
    water: station?.waterAvailability === 'available' ? 5 : station?.waterAvailability === 'unknown' ? 3 : 1,
    locks: station?.privacy ?? 4,
    lighting: station?.safety ?? 5,
  };
  const amenities = [
    { icon: <Text>💧</Text>, label: 'Water Available', available: station?.waterAvailability === 'available' },
    { icon: <Text>🩸</Text>, label: 'Sanitary Pads', available: true },
    { icon: <Text>💡</Text>, label: 'Good Lighting', available: true },
    { icon: <Text>♿</Text>, label: 'Accessible', available: station?.status.isAccessible ?? false },
  ];

  const handleGetDirections = async () => {
    if (!station?.coordinates) {
      Alert.alert('Directions unavailable', 'Coordinates are missing for this station.');
      return;
    }

    const { latitude, longitude } = station.coordinates;
    const encodedLabel = encodeURIComponent(station.name || 'Station');
    const mapsUrl =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodedLabel}`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    try {
      const canOpen = await Linking.canOpenURL(mapsUrl);
      if (!canOpen) {
        Alert.alert('Unable to open maps', 'No map application is available on this device.');
        return;
      }
      await Linking.openURL(mapsUrl);
    } catch (error) {
      console.error('Error opening directions:', error);
      Alert.alert('Unable to open directions', 'Please try again.');
    }
  };

  const handleReportIssue = () => {
    if (!station) {
      Alert.alert('Report unavailable', 'Station details are missing for this report.');
      return;
    }
    setIsReportModalVisible(true);
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
      <ReportStationIssueModal
        visible={isReportModalVisible}
        station={station ?? null}
        onClose={() => setIsReportModalVisible(false)}
      />
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
