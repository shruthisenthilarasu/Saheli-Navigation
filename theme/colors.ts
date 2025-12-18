/**
 * Color palette for safety-focused mobile app
 * Neutral, calm colors with high contrast for accessibility
 */

export const colors = {
  // Safety status colors
  safe: {
    primary: '#4CAF50', // Green - verified clean, safe stations
    light: '#81C784',
    dark: '#388E3C',
    background: '#E8F5E9',
  },
  caution: {
    primary: '#FFB300', // Amber/Yellow - under repair, needs attention
    light: '#FFD54F',
    dark: '#F57C00',
    background: '#FFF8E1',
  },
  unsafe: {
    primary: '#D32F2F', // Red - unsafe, emergency
    light: '#E57373',
    dark: '#C62828',
    background: '#FFEBEE',
  },
  
  // Primary accent (teal/blue)
  primary: {
    main: '#00897B', // Teal - primary actions, links
    light: '#4DB6AC',
    dark: '#00695C',
    background: '#E0F2F1',
  },
  
  // Neutral palette
  neutral: {
    white: '#FFFFFF',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
    black: '#000000',
  },
  
  // Text colors (high contrast)
  text: {
    primary: '#212121', // High contrast dark gray
    secondary: '#424242', // Medium gray for secondary text
    tertiary: '#757575', // Light gray for hints/placeholders
    inverse: '#FFFFFF', // White text for dark backgrounds
    disabled: '#9E9E9E', // Disabled text color
  },
  
  // Background colors
  background: {
    default: '#FFFFFF',
    paper: '#FAFAFA',
    overlay: 'rgba(0, 0, 0, 0.5)', // For modals/overlays
  },
  
  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  
  // Status colors (semantic)
  status: {
    success: '#4CAF50',
    warning: '#FFB300',
    error: '#D32F2F',
    info: '#00897B',
  },
} as const;

// Type exports for TypeScript
export type ColorPalette = typeof colors;

