import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  console.log('[App] Component rendering');
  
  return (
    <ErrorBoundary>
      <AppNavigator />
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}
