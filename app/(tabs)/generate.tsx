import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';


const QR_TYPES = [
  { id: 'text', label: 'Text', icon: 'text-outline' },
  { id: 'url', label: 'URL', icon: 'link-outline' },
  { id: 'email', label: 'Email', icon: 'mail-outline' },
  { id: 'phone', label: 'Phone', icon: 'call-outline' },
  { id: 'wifi', label: 'WiFi', icon: 'wifi-outline' },
];

export default function GenerateScreen() {
  const [qrValue, setQrValue] = useState('');
  const [qrType, setQrType] = useState('text');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrSize, setQrSize] = useState(200);
  const qrRef = useRef();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const getPlaceholderText = () => {
    switch (qrType) {
      case 'text':
        return 'Enter text...';
      case 'url':
        return 'https://example.com';
      case 'email':
        return 'example@email.com';
      case 'phone':
        return '+1234567890';
      case 'wifi':
        return 'Network Name';
      default:
        return 'Enter content...';
    }
  };

  const handleTypeChange = (type) => {
    setQrType(type);
    setQrValue('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveQRCode = async () => {
    try {
      if (!qrRef.current) {
        Alert.alert("Error", "QR Code is not ready yet.");
        return;
      }
  
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "We need access to your media library to save the QR code.");
        return;
      }
  
      // Capture the QR Code view
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
  
      // Save the image to the gallery
      await MediaLibrary.saveToLibraryAsync(uri);
  
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", "QR Code saved to your gallery!");
    } catch (error) {
      console.error("Error saving QR Code:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to save QR Code. Please try again.");
    }
  };
  

  const shareQRCode = async () => {
    try {
      if (!qrRef.current) {
        Alert.alert("Error", "QR Code is not ready yet.");
        return;
      }
  
      // Capture the QR Code view
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1,
      });
  
      const fileUri = `${FileSystem.cacheDirectory}qr-code.png`;
  
      // Move the captured image to a file
      await FileSystem.copyAsync({
        from: uri,
        to: fileUri,
      });
  
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Sharing not available", "Your device doesn't support sharing files.");
        return;
      }
  
      // Share the QR Code
      await Sharing.shareAsync(fileUri);
  
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error("Error sharing QR Code:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Failed to share QR Code. Please try again.");
    }
  };
  

  const COLORS = [
    '#000000', '#4F66E5', '#E53935', '#43A047', '#FB8C00', '#8E24AA'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Generate QR Code</Text>
            
            {/* QR Type Selection */}
            <View style={styles.typeContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.typeScroll}
              >
                {QR_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      qrType === type.id && styles.typeButtonActive
                    ]}
                    onPress={() => handleTypeChange(type.id)}
                  >
                    <Ionicons 
                      name={type.icon} 
                      size={20} 
                      color={qrType === type.id ? '#FFFFFF' : '#333333'} 
                    />
                    <Text 
                      style={[
                        styles.typeText,
                        qrType === type.id && styles.typeTextActive
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            {/* Input Field */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={getPlaceholderText()}
                value={qrValue}
                onChangeText={setQrValue}
                multiline={qrType === 'text'}
                keyboardType={qrType === 'phone' ? 'phone-pad' : qrType === 'url' ? 'url' : 'default'}
                autoCapitalize="none"
              />
            </View>
            
            {/* QR Code Preview */}
            <View style={styles.qrContainer}>
              {qrValue ? (
                <QRCode
                  value={qrValue || ' '}
                  size={qrSize}
                  color={qrColor}
                  backgroundColor="white"
                  getRef={qrRef}
                />
              ) : (
                <View style={styles.emptyQR}>
                  <Ionicons name="qr-code" size={80} color="#CCCCCC" />
                  <Text style={styles.emptyQRText}>Enter content to generate QR code</Text>
                </View>
              )}
            </View>
            
            {/* Color Selection */}
            {qrValue && (
              <>
                <Text style={styles.sectionTitle}>QR Color</Text>
                <View style={styles.colorContainer}>
                  {COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        { backgroundColor: color },
                        qrColor === color && styles.colorButtonActive
                      ]}
                      onPress={() => {
                        setQrColor(color);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                    />
                  ))}
                </View>
              
                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={saveQRCode}
                  >
                    <Ionicons name="download-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.actionText}>Save</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={shareQRCode}
                  >
                    <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  typeContainer: {
    marginBottom: 20,
    width: '100%',
  },
  typeScroll: {
    paddingVertical: 5,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeButtonActive: {
    backgroundColor: '#4F66E5',
  },
  typeText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#333333',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: 260,
    height: 260,
  },
  emptyQR: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyQRText: {
    marginTop: 10,
    color: '#999999',
    textAlign: 'center',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#333333',
  },
  colorContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  colorButtonActive: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#4F66E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});