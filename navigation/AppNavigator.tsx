import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeMapScreen from '../screens/HomeMapScreen';
import StationDetailScreen from '../screens/StationDetailScreen';
import EmergencySOSScreen from '../screens/EmergencySOSScreen';
import InfoScreen from '../screens/InfoScreen';
import { Station } from '../types/models';

export type RootStackParamList = {
  HomeMap: undefined;
  StationDetail: {
    stationId: string;
    station?: Station;
  };
  EmergencySOS: undefined;
  Info: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * App Navigator
 * Stack navigation configuration
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="HomeMap"
        screenOptions={{
          headerShown: false, // Hide default header for full-screen experience
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="HomeMap"
          component={HomeMapScreen}
        />
        <Stack.Screen
          name="StationDetail"
          component={StationDetailScreen}
          options={{
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
            <Stack.Screen
              name="EmergencySOS"
              component={EmergencySOSScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="Info"
              component={InfoScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_bottom',
                headerShown: true,
                title: 'Information',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

