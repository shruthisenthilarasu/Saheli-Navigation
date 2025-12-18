/**
 * Navigation type definitions
 * Centralized types for React Navigation
 */

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './AppNavigator';

export type HomeMapScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeMap'>;
export type StationDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'StationDetail'>;
export type EmergencySOSScreenProps = NativeStackScreenProps<RootStackParamList, 'EmergencySOS'>;

