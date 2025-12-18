/**
 * Example SOS Button Component
 * This demonstrates how to use the SOS architecture
 * 
 * Note: This is an example - implement your own UI component
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useSOS } from '../hooks/useSOS';

export function SOSButtonExample() {
  const { trigger, isTriggering, activeEvent, resolve, cancel } = useSOS();

  const handleSOSPress = async () => {
    Alert.alert(
      'Trigger SOS?',
      'This will send your location to emergency contacts and trigger an alarm.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Trigger SOS',
          style: 'destructive',
          onPress: async () => {
            try {
              await trigger(
                {
                  eventType: 'emergency',
                  description: 'User triggered SOS',
                },
                {
                  sendSMS: true,
                  triggerAlarm: true,
                }
              );
              Alert.alert('SOS Triggered', 'Emergency services have been notified.');
            } catch (error) {
              Alert.alert('Error', 'Failed to trigger SOS. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleResolve = async () => {
    if (activeEvent) {
      try {
        await resolve(activeEvent.id);
        Alert.alert('SOS Resolved', 'The emergency has been resolved.');
      } catch (error) {
        Alert.alert('Error', 'Failed to resolve SOS event.');
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, styles.sosButton]}
        onPress={handleSOSPress}
        disabled={isTriggering}
      >
        <Text style={styles.buttonText}>
          {isTriggering ? 'Triggering...' : 'SOS'}
        </Text>
      </TouchableOpacity>

      {activeEvent && (
        <TouchableOpacity style={[styles.button, styles.resolveButton]} onPress={handleResolve}>
          <Text style={styles.buttonText}>Resolve SOS</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  sosButton: {
    backgroundColor: '#F44336',
  },
  resolveButton: {
    backgroundColor: '#4CAF50',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

