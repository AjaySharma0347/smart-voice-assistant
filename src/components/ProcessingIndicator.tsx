import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProcessingIndicatorProps {
  status: 'recording' | 'processing' | 'done' | 'error';
  message?: string;
}

export function ProcessingIndicator({ status, message }: ProcessingIndicatorProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'recording':
        return {
          icon: 'mic',
          color: '#FF3B30',
          text: message || 'Recording...',
        };
      case 'processing':
        return {
          icon: 'sync',
          color: '#00E5FF',
          text: message || 'Processing audio...',
        };
      case 'done':
        return {
          icon: 'checkmark-circle',
          color: '#34C759',
          text: message || 'Processing complete',
        };
      case 'error':
        return {
          icon: 'alert-circle',
          color: '#FF3B30',
          text: message || 'An error occurred',
        };
    }
  };

  const content = getStatusContent();

  return (
    <View style={[styles.container, { borderColor: content.color }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${content.color}20` }]}>
        {status === 'processing' ? (
          <ActivityIndicator color={content.color} />
        ) : (
          <Ionicons name={content.icon} size={24} color={content.color} />
        )}
      </View>
      <Text style={[styles.text, { color: content.color }]}>{content.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#00E5FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 16,
    marginBottom: 16,
    transform: [{ perspective: 1000 }],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});