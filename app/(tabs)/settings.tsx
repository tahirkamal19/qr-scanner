import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'appSettings';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: false,
    hapticFeedback: true,
    autoCopy: true,
    saveHistory: true,
    openUrlsAutomatically: false,
    cameraSound: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) setSettings(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const toggleSetting = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
    if (settings.hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all scan history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.setItem('qrHistory', JSON.stringify([]));
              Alert.alert("History Cleared", "Your scan history has been cleared.");
              if (settings.hapticFeedback) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            } catch (error) {
              console.error("Error clearing history:", error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanning</Text>

          <SettingSwitch
            icon="copy-outline"
            label="Auto-copy scan results"
            value={settings.autoCopy}
            onToggle={() => toggleSetting('autoCopy')}
          />

          {/* <SettingSwitch
            icon="open-outline"
            label="Open URLs automatically"
            value={settings.openUrlsAutomatically}
            onToggle={() => toggleSetting('openUrlsAutomatically')}
          /> */}

          {/* <SettingSwitch
            icon="volume-medium-outline"
            label="Camera sound"
            value={settings.cameraSound}
            onToggle={() => toggleSetting('cameraSound')}
          /> */}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          <SettingSwitch
            icon="pulse-outline"
            label="Haptic feedback"
            value={settings.hapticFeedback}
            onToggle={() => toggleSetting('hapticFeedback')}
          />
        </View> */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <SettingSwitch
            icon="time-outline"
            label="Save scan history"
            value={settings.saveHistory}
            onToggle={() => toggleSetting('saveHistory')}
          />

          <TouchableOpacity style={styles.actionButton} onPress={clearHistory}>
            <Ionicons name="trash-outline" size={22} color="#E53935" style={styles.actionIcon} />
            <Text style={styles.actionText}>Clear Scan History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <InfoItem icon="information-circle-outline" label="App Version" value="1.0.0" />
          {/* <InfoItem icon="shield-checkmark-outline" label="Privacy Policy" /> */}
                  </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SettingSwitch = ({ icon, label, value, onToggle }) => (
  <View style={styles.settingItem}>
    <View style={styles.settingInfo}>
      <Ionicons name={icon} size={22} color="#333333" style={styles.settingIcon} />
      <Text style={styles.settingText}>{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
      thumbColor="#FFFFFF"
    />
  </View>
);

const InfoItem = ({ icon, label, value }) => (
  <TouchableOpacity style={styles.infoItem}>
    <View style={styles.settingInfo}>
      <Ionicons name={icon} size={22} color="#333333" style={styles.settingIcon} />
      <Text style={styles.settingText}>{label}</Text>
    </View>
    {value ? (
      <Text style={styles.infoValue}>{value}</Text>
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#999999" />
    )}
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#999999',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#E53935',
  },
});