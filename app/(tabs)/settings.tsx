import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [saveToCloud, setSaveToCloud] = useState(true);
  const [highQualityAudio, setHighQualityAudio] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recording Settings</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Auto-transcribe</Text>
            <Text style={styles.settingDescription}>
              Automatically convert speech to text
            </Text>
          </View>
          <Switch
            value={autoTranscribe}
            onValueChange={setAutoTranscribe}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Save to Cloud</Text>
            <Text style={styles.settingDescription}>
              Backup recordings automatically
            </Text>
          </View>
          <Switch
            value={saveToCloud}
            onValueChange={setSaveToCloud}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>High Quality Audio</Text>
            <Text style={styles.settingDescription}>
              Record in high quality (uses more storage)
            </Text>
          </View>
          <Switch
            value={highQualityAudio}
            onValueChange={setHighQualityAudio}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Storage Usage</Text>
          <View style={styles.linkRight}>
            <Text style={styles.linkDetail}>2.4 GB</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Export Data</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkItem}>
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  linkText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  linkRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkDetail: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 8,
  },
});