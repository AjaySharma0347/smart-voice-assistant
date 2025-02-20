import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Action } from '../lib/nlp';
import { format } from 'date-fns';

interface ActionEditorProps {
  action: Action;
  onSave: (updatedAction: Action) => void;
  onCancel: () => void;
}

export function ActionEditor({ action, onSave, onCancel }: ActionEditorProps) {
  const [editedAction, setEditedAction] = useState(action);

  const handleSave = () => {
    onSave(editedAction);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit {action.type}</Text>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={editedAction.title}
            onChangeText={(text) => setEditedAction({ ...editedAction, title: text })}
            placeholder="Enter title"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={editedAction.details}
            onChangeText={(text) => setEditedAction({ ...editedAction, details: text })}
            placeholder="Enter details"
            multiline
            numberOfLines={4}
          />
        </View>

        {editedAction.date && (
          <View style={styles.field}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.dateText}>{format(editedAction.date, 'PPP p')}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.priorityButtons}>
            {(['low', 'medium', 'high'] as const).map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  editedAction.priority === priority && styles.priorityButtonActive,
                ]}
                onPress={() => setEditedAction({ ...editedAction, priority })}
              >
                <Text
                  style={[
                    styles.priorityButtonText,
                    editedAction.priority === priority && styles.priorityButtonTextActive,
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Tags</Text>
          <View style={styles.tags}>
            {editedAction.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  onPress={() =>
                    setEditedAction({
                      ...editedAction,
                      tags: editedAction.tags.filter((_, i) => i !== index),
                    })
                  }
                >
                  <Ionicons name="close-circle" size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  priorityButtonTextActive: {
    color: 'white',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  tagText: {
    fontSize: 14,
    color: '#3A3A3C',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});