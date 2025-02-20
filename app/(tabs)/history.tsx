import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

const MOCK_RECORDINGS = [
  {
    id: '1',
    title: 'Team Meeting Notes',
    date: new Date(2024, 0, 15, 14, 30),
    duration: '15:23',
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Project Planning',
    date: new Date(2024, 0, 14, 11, 0),
    duration: '25:47',
    type: 'task',
  },
  {
    id: '3',
    title: 'Client Call',
    date: new Date(2024, 0, 14, 9, 15),
    duration: '32:10',
    type: 'meeting',
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.recordingItem}>
      <View style={styles.recordingIcon}>
        <Ionicons
          name={item.type === 'meeting' ? 'people' : 'checkbox'}
          size={24}
          color="#007AFF"
        />
      </View>
      <View style={styles.recordingInfo}>
        <Text style={styles.recordingTitle}>{item.title}</Text>
        <Text style={styles.recordingDate}>
          {format(item.date, 'MMM d, yyyy • h:mm a')}
        </Text>
      </View>
      <Text style={styles.recordingDuration}>{item.duration}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_RECORDINGS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  listContent: {
    padding: 16,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  recordingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5F1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  recordingDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  recordingDuration: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 12,
  },
  separator: {
    height: 12,
  },
});