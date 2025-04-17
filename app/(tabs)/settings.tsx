import React, { useState } from 'react';
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

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    darkMode: false,
    hapticFeedback: true,
    autoCopy: true,
    saveHistory: true,
    openUrlsAutomatically: false,
    cameraSound: true,
  });

  const toggleSetting = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
          onPress: () => {
            // In a real app, this would clear the history
            Alert.alert("History Cleared", "Your scan history has been cleared.");
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={() => toggleSetting('darkMode')}
              trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scanning</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="copy-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Auto-copy scan results</Text>
            </View>
            <Switch
              value={settings.autoCopy}
              onValueChange={() => toggleSetting('autoCopy')}
              trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="open-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Open URLs automatically</Text>
            </View>
            <Switch
              value={settings.openUrlsAutomatically}
              onValueChange={() => toggleSetting('openUrlsAutomatically')}
              trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-medium-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Camera sound</Text>
            </View>
            <Switch
              value={settings.cameraSound}
              onValueChange={() => toggleSetting('cameraSound')}
              trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="pulse-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Haptic feedback</Text>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={() => toggleSetting('hapticFeedback')}
              trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="time-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Save scan history</Text>
            </View>
            <Switch
              value={settings.saveHistory}
              onValueChange={() => toggleSetting('saveHistory')}
              trackColor={{ false: '#DDDDDD', true: '#4F66E5' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={clearHistory}
          >
            <Ionicons name="trash-outline" size={22} color="#E53935" style={styles.actionIcon} />
            <Text style={styles.actionText}>Clear Scan History</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="information-circle-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>App Version</Text>
            </View>
            <Text style={styles.infoValue}>1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.infoItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color="#333333" style={styles.settingIcon} />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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