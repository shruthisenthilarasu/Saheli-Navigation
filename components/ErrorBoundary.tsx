import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Application Error</Text>
          <Text style={styles.errorText}>
            {this.state.error?.message || 'Unknown error occurred'}
          </Text>
          {this.state.error?.stack && (
            <Text style={styles.stackText}>{this.state.error.stack}</Text>
          )}
          {this.state.errorInfo && (
            <Text style={styles.infoText}>
              Component Stack: {this.state.errorInfo.componentStack}
            </Text>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  stackText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    maxHeight: 200,
  },
  infoText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 8,
    fontFamily: 'monospace',
  },
});

