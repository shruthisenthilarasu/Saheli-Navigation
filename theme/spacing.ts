/**
 * Spacing system for consistent layout
 * Based on 8px grid system for clean alignment
 */

export const spacing = {
  // Base unit: 8px
  xs: 4,   // 0.5x base
  sm: 8,   // 1x base
  md: 16,  // 2x base
  lg: 24,  // 3x base
  xl: 32,  // 4x base
  xxl: 48, // 6x base
  xxxl: 64, // 8x base
  
  // Touch targets (minimum 44x44px for accessibility)
  touchTarget: {
    min: 44,      // Minimum touch target size
    comfortable: 48, // Comfortable touch target
    large: 56,    // Large touch target for primary actions
  },
  
  // Common spacing patterns
  padding: {
    screen: 16,      // Screen padding
    card: 16,        // Card padding
    button: 16,      // Button padding
    input: 12,       // Input field padding
  },
  
  // Gaps between elements
  gap: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Border radius
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999, // Fully rounded
  },
  
  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
} as const;

export type Spacing = typeof spacing;

