import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FEATURES = [
  {
    id: '1',
    title: 'Batch Scanning',
    description: 'Scan multiple QR codes in succession without returning to the home screen.',
    icon: 'scan-outline',
    comingSoon: false,
  },
  {
    id: '2',
    title: 'Custom QR Designs',
    description: 'Create branded QR codes with logos and custom designs.',
    icon: 'color-palette-outline',
    comingSoon: true,
  },
  {
    id: '3',
    title: 'QR Code Analytics',
    description: 'Track how many times your QR codes have been scanned.',
    icon: 'analytics-outline',
    comingSoon: true,
  },
  {
    id: '4',
    title: 'Cloud Backup',
    description: 'Backup your QR codes and scan history to the cloud.',
    icon: 'cloud-upload-outline',
    comingSoon: true,
  },
];

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Explore</Text>
        
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/800/400' }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Premium Features</Text>
            <Text style={styles.bannerText}>Unlock advanced QR code features</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Features</Text>
        
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature) => (
            <TouchableOpacity key={feature.id} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name={feature.icon} size={24} color="#4F66E5" />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
              {feature.comingSoon && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>Coming Soon</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.sectionTitle}>Tips & Tricks</Text>
        
        <View style={styles.tipsContainer}>
          <TouchableOpacity style={styles.tipCard}>
            <Image
              source={{ uri: 'https://picsum.photos/400/200' }}
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Scan QR Codes from Images</Text>
              <Text style={styles.tipDescription}>
                Did you know you can scan QR codes from saved images in your gallery?
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.tipCard}>
            <Image
              source={{ uri: 'https://picsum.photos/400/201' }}
              style={styles.tipImage}
            />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Generate WiFi QR Codes</Text>
              <Text style={styles.tipDescription}>
                Share your WiFi credentials easily by generating a QR code.
              </Text>
            </View>
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
  bannerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerImage: {
    width: '100%',
    height: 150,
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  bannerText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  bannerButton: {
    backgroundColor: '#4F66E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333333',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 160,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(79, 102, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  featureDescription: {
    fontSize: 12,
    color: '#777777',
    lineHeight: 18,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#FB8C00',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  tipsContainer: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipImage: {
    width: '100%',
    height: 120,
  },
  tipContent: {
    padding: 15,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  tipDescription: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },
});