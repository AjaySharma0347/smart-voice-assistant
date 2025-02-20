import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Action } from '../lib/nlp';

interface ActionSummaryProps {
  actions: Action[];
  onShare: (action: Action) => void;
  onEdit: (action: Action) => void;
  onSave: (action: Action) => void;
}

export function ActionSummary({
  actions,
  onShare,
  onEdit,
  onSave,
}: ActionSummaryProps) {
  const getActionIcon = (type: string) => {
    switch (type) {
      case 'task':
        return 'checkbox-outline';
      case 'meeting':
        return 'calendar';
      case 'note':
        return 'document-text';
      default:
        return 'information-circle';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extracted Actions</Text>
      {actions.map((action) => (
        <View key={action.id} style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Ionicons
              name={getActionIcon(action.type)}
              size={24}
              color="#00E5FF"
            />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionType}>
              {action.type.charAt(0).toUpperCase() + action.type.slice(1)}
            </Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
            {action.details && (
              <Text style={styles.actionDetails}>{action.details}</Text>
            )}
            {action.date && (
              <Text style={styles.actionDate}>
                {format(action.date, 'PPP p')}
              </Text>
            )}
            {action.tags.length > 0 && (
              <View style={styles.tagContainer}>
                {action.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(action)}>
              <Ionicons name="create" size={20} color="#00E5FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onShare(action)}>
              <Ionicons name="share" size={20} color="#00E5FF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onSave(action)}>
              <Ionicons name="add-circle" size={20} color="#34C759" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionType: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  actionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDetails: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  actionDate: {
    fontSize: 14,
    color: '#00E5FF',
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
});