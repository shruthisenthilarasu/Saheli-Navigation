import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Station } from '../types/models';
import { IssueType } from '../types/reports';
import { submitReportWithOfflineSupport } from '../services/offlineSync';
import * as Location from 'expo-location';

interface ReportStationIssueModalProps {
  visible: boolean;
  station: Station | null;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

const ISSUE_TYPES: { type: IssueType; label: string; description: string }[] = [
  {
    type: 'unsafe',
    label: 'Unsafe',
    description: 'Station is unsafe or dangerous',
  },
  {
    type: 'unclean',
    label: 'Unclean',
    description: 'Station is dirty or unsanitary',
  },
  {
    type: 'no-water',
    label: 'No Water',
    description: 'Water is not available',
  },
  {
    type: 'broken-lock',
    label: 'Broken Lock',
    description: 'Door lock is broken or not working',
  },
];

export default function ReportStationIssueModal({
  visible,
  station,
  onClose,
  onReportSubmitted,
}: ReportStationIssueModalProps) {
  const [selectedIssueType, setSelectedIssueType] = useState<IssueType | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!station || !selectedIssueType) {
      Alert.alert('Error', 'Please select an issue type');
      return;
    }

    try {
      setSubmitting(true);

      // Get current location for the report
      let coordinates = station.coordinates;
      try {
        const location = await Location.getCurrentPositionAsync({});
        coordinates = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      } catch (error) {
        console.warn('Could not get current location, using station coordinates');
      }

      const result = await submitReportWithOfflineSupport({
        stationId: station.id,
        issueType: selectedIssueType,
        coordinates,
        comment: comment.trim() || undefined,
      });

      if (result.queued) {
        Alert.alert(
          'Report Queued',
          'You are offline. Your report has been queued and will be submitted when connection is restored.',
          [
            {
              text: 'OK',
              onPress: () => {
                handleClose();
                if (onReportSubmitted) {
                  onReportSubmitted();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Report Submitted',
          `Your report has been submitted. The station status will be updated temporarily and expire in 24 hours unless reverified.`,
          [
            {
              text: 'OK',
              onPress: () => {
                handleClose();
                if (onReportSubmitted) {
                  onReportSubmitted();
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to submit report. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedIssueType(null);
    setComment('');
    onClose();
  };

  if (!station) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Report Issue</Text>
          <Text style={styles.stationName}>{station.name}</Text>

          <Text style={styles.sectionTitle}>Select Issue Type:</Text>
          <View style={styles.issueTypesContainer}>
            {ISSUE_TYPES.map((issue) => (
              <TouchableOpacity
                key={issue.type}
                style={[
                  styles.issueTypeButton,
                  selectedIssueType === issue.type && styles.issueTypeButtonSelected,
                ]}
                onPress={() => setSelectedIssueType(issue.type)}
              >
                <Text
                  style={[
                    styles.issueTypeLabel,
                    selectedIssueType === issue.type && styles.issueTypeLabelSelected,
                  ]}
                >
                  {issue.label}
                </Text>
                <Text style={styles.issueTypeDescription}>{issue.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Additional Comments (Optional):</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Add any additional details..."
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting || !selectedIssueType}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  issueTypesContainer: {
    marginBottom: 16,
  },
  issueTypeButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  issueTypeButtonSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  issueTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  issueTypeLabelSelected: {
    color: '#2196F3',
  },
  issueTypeDescription: {
    fontSize: 14,
    color: '#666',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#F44336',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

