/**
 * Typography system
 * Uses system fonts only for optimal performance and native feel
 * High contrast for readability and safety-critical information
 */

import { Platform } from 'react-native';

// System font families
const systemFonts = {
  ios: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  default: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }) as string,
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }) as string,
    semibold: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }) as string,
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }) as string,
  },
};

export const typography = {
  // Font families
  fontFamily: {
    regular: systemFonts.default.regular,
    medium: systemFonts.default.medium,
    semibold: systemFonts.default.semibold,
    bold: systemFonts.default.bold,
  },
  
  // Font sizes (scaled for readability)
  fontSize: {
    xs: 12,    // Small labels, captions
    sm: 14,    // Secondary text, hints
    base: 16,  // Body text (default)
    md: 18,    // Emphasized body text
    lg: 20,    // Large body text
    xl: 24,    // Headings
    xxl: 28,   // Large headings
    xxxl: 32,  // Display text
  },
  
  // Line heights (for readability)
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    md: 26,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Predefined text styles for common use cases
  styles: {
    // Headings
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      fontFamily: systemFonts.default.bold,
    },
    h2: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700' as const,
      fontFamily: systemFonts.default.bold,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
      fontFamily: systemFonts.default.semibold,
    },
    h4: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '600' as const,
      fontFamily: systemFonts.default.semibold,
    },
    
    // Body text
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      fontFamily: systemFonts.default.regular,
    },
    bodyLarge: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '400' as const,
      fontFamily: systemFonts.default.regular,
    },
    bodyBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      fontFamily: systemFonts.default.semibold,
    },
    
    // Labels and captions
    label: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500' as const,
      fontFamily: systemFonts.default.medium,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      fontFamily: systemFonts.default.regular,
    },
    
    // Button text
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      fontFamily: systemFonts.default.semibold,
    },
    buttonLarge: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600' as const,
      fontFamily: systemFonts.default.semibold,
    },
  },
} as const;

export type Typography = typeof typography;

