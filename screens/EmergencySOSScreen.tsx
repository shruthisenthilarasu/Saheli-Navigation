import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { EmergencySOSScreenProps } from '../navigation/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * EmergencySOSScreen
 * Full-screen urgent SOS interface
 * Unmistakable, immediate, and clear
 */
export default function EmergencySOSScreen() {
  const navigation = useNavigation<EmergencySOSScreenProps['navigation']>();
  const countdownSeconds = 3;
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [countdownAnim] = useState(new Animated.Value(1));

  // Pulse animation for SOS button
  useEffect(() => {
    if (!isActivated) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isActivated, pulseAnim]);

  // Countdown animation
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        // Scale animation for countdown
        Animated.sequence([
          Animated.timing(countdownAnim, {
            toValue: 1.3,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Countdown finished - activate SOS
      setIsActivated(true);
      // SOS activation logic will be implemented later
      console.log('SOS activated');
    }
  }, [countdown, countdownAnim]);

  const handleSOSPress = () => {
    if (countdown === null) {
      // Start countdown
      setCountdown(countdownSeconds);
    }
  };

  const handleCancel = () => {
    setCountdown(null);
    setIsActivated(false);
    navigation.goBack();
  };

  const buttonSize = Math.min(SCREEN_WIDTH * 0.6, 280);

  return (
    <View style={styles.container}>
      {/* Background with subtle pattern */}
      <View style={styles.background} />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        {!isActivated && (
          <Text style={styles.title}>Emergency</Text>
        )}

        {/* Countdown Display */}
        {countdown !== null && countdown > 0 && (
          <Animated.View
            style={[
              styles.countdownContainer,
              {
                transform: [{ scale: countdownAnim }],
              },
            ]}
          >
            <Text style={styles.countdownText}>{countdown}</Text>
          </Animated.View>
        )}

        {/* Activated State */}
        {isActivated && (
          <View style={styles.activatedContainer}>
            <Text style={styles.activatedText}>SOS ACTIVATED</Text>
            <Text style={styles.activatedSubtext}>
              Help is on the way
            </Text>
          </View>
        )}

        {/* Large SOS Button */}
        {!isActivated && (
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sosButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                },
                countdown !== null && styles.sosButtonActive,
              ]}
              onPress={handleSOSPress}
              activeOpacity={0.9}
              accessible={true}
              accessibilityLabel="Emergency SOS button"
              accessibilityRole="button"
            >
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Instructions */}
        {!isActivated && countdown === null && (
          <Text style={styles.instruction}>
            Tap to activate emergency alert
          </Text>
        )}

        {countdown !== null && countdown > 0 && (
          <Text style={styles.instruction}>
            Tap cancel to stop
          </Text>
        )}
      </View>

      {/* Cancel Button */}
      {!isActivated && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.unsafe.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.unsafe.primary,
    opacity: 0.95,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.styles.h1,
    fontSize: 48,
    color: colors.text.inverse,
    fontWeight: '700',
    marginBottom: spacing.xxl,
    textAlign: 'center',
    letterSpacing: 2,
  },
  countdownContainer: {
    marginBottom: spacing.xxl,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: '700',
    color: colors.text.inverse,
    textAlign: 'center',
  },
  activatedContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  activatedText: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.text.inverse,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: spacing.md,
  },
  activatedSubtext: {
    ...typography.styles.h3,
    color: colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    marginVertical: spacing.xxl,
  },
  sosButton: {
    backgroundColor: colors.text.inverse,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  sosButtonActive: {
    backgroundColor: colors.caution.primary,
  },
  sosText: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.unsafe.primary,
    letterSpacing: 8,
  },
  instruction: {
    ...typography.styles.bodyLarge,
    color: colors.text.inverse,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: spacing.xl,
  },
  cancelButton: {
    position: 'absolute',
    bottom: spacing.xxl + spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.radius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: colors.text.inverse,
  },
  cancelText: {
    ...typography.styles.button,
    color: colors.text.inverse,
    fontSize: typography.fontSize.lg,
  },
});

