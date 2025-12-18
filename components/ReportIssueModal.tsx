import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { colors, spacing, typography } from '../theme';
import { PrimaryButton, SecondaryButton, Checkbox, PhotoUploadPlaceholder } from './ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type IssueType = 'unsafe' | 'unclean' | 'no-water' | 'broken-lock';

interface IssueOption {
  id: IssueType;
  label: string;
  description: string;
}

const ISSUE_OPTIONS: IssueOption[] = [
  {
    id: 'unsafe',
    label: 'Unsafe',
    description: 'Station feels dangerous or unsafe',
  },
  {
    id: 'unclean',
    label: 'Unclean',
    description: 'Station is dirty or unsanitary',
  },
  {
    id: 'no-water',
    label: 'No Water',
    description: 'Water is not available',
  },
  {
    id: 'broken-lock',
    label: 'Broken Lock',
    description: 'Door lock is broken or not working',
  },
];

interface ReportIssueModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (selectedIssues: IssueType[], hasPhoto: boolean) => void;
}

/**
 * ReportIssueModal - Bottom Sheet Style
 * Fast, non-intimidating modal for reporting station issues
 */
export default function ReportIssueModal({
  visible,
  onClose,
  onSubmit,
}: ReportIssueModalProps) {
  const [selectedIssues, setSelectedIssues] = useState<IssueType[]>([]);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleToggleIssue = (issueId: IssueType) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId)
        ? prev.filter((id) => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = () => {
    if (selectedIssues.length === 0) {
      return; // Don't submit if nothing selected
    }
    onSubmit?.(selectedIssues, hasPhoto);
    handleClose();
  };

  const handleClose = () => {
    setSelectedIssues([]);
    setHasPhoto(false);
    onClose();
  };

  const handlePhotoPress = () => {
    // Photo upload logic will be implemented later
    setHasPhoto(!hasPhoto);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Report an Issue</Text>
            <Text style={styles.subtitle}>
              Help keep stations safe by reporting problems
            </Text>

            {/* Issue Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's the issue?</Text>
              <Text style={styles.sectionHint}>
                Select all that apply
              </Text>
              {ISSUE_OPTIONS.map((option) => (
                <View key={option.id} style={styles.issueOption}>
                  <Checkbox
                    label={option.label}
                    checked={selectedIssues.includes(option.id)}
                    onPress={() => handleToggleIssue(option.id)}
                  />
                  <Text style={styles.issueDescription}>
                    {option.description}
                  </Text>
                </View>
              ))}
            </View>

            {/* Photo Upload */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Add a Photo (Optional)</Text>
              <Text style={styles.sectionHint}>
                Photos help us understand the issue better
              </Text>
              <PhotoUploadPlaceholder
                onPress={handlePhotoPress}
                hasPhoto={hasPhoto}
                style={styles.photoPlaceholder}
              />
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <SecondaryButton
                title="Cancel"
                onPress={handleClose}
                fullWidth
                style={styles.cancelButton}
              />
              <PrimaryButton
                title="Submit Report"
                onPress={handleSubmit}
                disabled={selectedIssues.length === 0}
                fullWidth
                style={styles.submitButton}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.background.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.background.default,
    borderTopLeftRadius: spacing.radius.xl,
    borderTopRightRadius: spacing.radius.xl,
    maxHeight: SCREEN_HEIGHT * 0.9,
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: colors.neutral.gray400,
    borderRadius: spacing.radius.round,
    alignSelf: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  issueOption: {
    marginBottom: spacing.md,
  },
  issueDescription: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginLeft: spacing.icon.md + spacing.md,
    marginTop: spacing.xs / 2,
  },
  photoPlaceholder: {
    marginTop: spacing.sm,
  },
  actions: {
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  cancelButton: {
    marginBottom: spacing.sm,
  },
  submitButton: {
    // Uses default primary button styling
  },
});

