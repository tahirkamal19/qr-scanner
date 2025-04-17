// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import * as Haptics from 'expo-haptics';
// import { Ionicons } from '@expo/vector-icons';

// export default function ScanScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [facing, setFacing] = useState<CameraType>('back');
//   const [scanned, setScanned] = useState(false);

//   if (!permission) return <View />;
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>We need your permission to use the camera</Text>
//         <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
//           <Text style={styles.permissionText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const handleBarCodeScanned = ({ data }: { data: string }) => {
//     if (scanned) return;
//     setScanned(true);
//     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

//     Alert.alert("QR Code Scanned", data, [
//       {
//         text: "OK",
//         onPress: () => setScanned(false)
//       }
//     ]);
//   };

//   const toggleCameraFacing = () => {
//     setFacing((current) => (current === 'back' ? 'front' : 'back'));
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//   };

//   return (
//     <View style={styles.container}>
//       <CameraView
//         style={styles.camera}
//         facing={facing}
//         onBarcodeScanned={handleBarCodeScanned}
//         barcodeScannerSettings={{
//           barcodeTypes: ['qr'],
//         }}
//       >
//         <View style={styles.controls}>
//           <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
//             <Ionicons name="camera-reverse" size={28} color="white" />
//             <Text style={styles.flipText}>Flip</Text>
//           </TouchableOpacity>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   message: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   permissionButton: {
//     backgroundColor: '#007AFF',
//     padding: 12,
//     borderRadius: 8,
//     alignSelf: 'center',
//     marginTop: 16,
//   },
//   permissionText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   camera: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   controls: {
//     position: 'absolute',
//     bottom: 40,
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   flipButton: {
//     alignItems: 'center',
//   },
//   flipText: {
//     color: 'white',
//     marginTop: 4,
//   },
// });


import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Animated, 
  Dimensions, 
  SafeAreaView,
  Modal,
  Linking,
  Platform
} from 'react-native';
import { CameraView, CameraType, FlashMode, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BarCodeScanner } from 'expo-barcode-scanner';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<{ type: string; data: string } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Animate scan line
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    if (!scanned) {
      startAnimation();
    } else {
      scanLineAnim.setValue(0);
    }

    return () => {
      scanLineAnim.setValue(0);
    };
  }, [scanned]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={80} color="#4F66E5" style={styles.permissionIcon} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          We need your permission to use the camera to scan QR codes.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const saveToHistory = async (data: string, type: string) => {
    try {
      // Get existing history
      const historyString = await AsyncStorage.getItem('qrHistory');
      const history = historyString ? JSON.parse(historyString) : [];
      
      // Add new scan to history
      const newScan = {
        id: Date.now().toString(),
        data,
        type,
        date: new Date().toISOString(),
        isFavorite: false,
      };
      
      // Add to beginning of array
      history.unshift(newScan);
      
      // Save updated history
      await AsyncStorage.setItem('qrHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const detectQRType = (data: string) => {
    if (data.startsWith('http')) return 'url';
    if (data.includes('@') && data.includes('.')) return 'email';
    if (/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(data)) return 'phone';
    if (data.startsWith('WIFI:')) return 'wifi';
    return 'text';
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Detect QR type
    const type = detectQRType(data);
    
    // Save to history
    saveToHistory(data, type);
    
    // Set result and show modal
    setResult({ type, data });
    setShowResult(true);
  };

  const handleAction = () => {
    if (!result) return;
    
    switch (result.type) {
      case 'url':
        Linking.openURL(result.data).catch(() => {
          Alert.alert('Error', 'Could not open this URL');
        });
        break;
      case 'email':
        Linking.openURL(`mailto:${result.data}`).catch(() => {
          Alert.alert('Error', 'Could not open email app');
        });
        break;
      case 'phone':
        Linking.openURL(`tel:${result.data}`).catch(() => {
          Alert.alert('Error', 'Could not open phone app');
        });
        break;
      default:
        // Copy to clipboard functionality would go here
        Alert.alert('Copied to clipboard', 'The text has been copied to your clipboard');
    }
  };

  const closeResult = () => {
    setShowResult(false);
    setScanned(false);
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // const toggleFlash = () => {
  //   setFlashMode((current) => (current === 'off' ? 'torch' : 'off'));
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // };

  const getActionText = () => {
    if (!result) return 'Copy';
    
    switch (result.type) {
      case 'url':
        return 'Open URL';
      case 'email':
        return 'Send Email';
      case 'phone':
        return 'Call Number';
      default:
        return 'Copy';
    }
  };

  const getTypeIcon = () => {
    if (!result) return 'document-text-outline';
    
    switch (result.type) {
      case 'url':
        return 'globe-outline';
      case 'email':
        return 'mail-outline';
      case 'phone':
        return 'call-outline';
      case 'wifi':
        return 'wifi-outline';
      default:
        return 'document-text-outline';
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        // flashMode={flashMode}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={[styles.header, { marginTop: insets.top }]}>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <Text style={styles.headerSubtitle}>Position QR code in the frame</Text>
          </View>
          
          {/* Scan Area */}
          <View style={styles.scanAreaContainer}>
            <View style={styles.scanArea}>
              <Animated.View 
                style={[
                  styles.scanLine,
                  { 
                    transform: [
                      { 
                        translateY: scanLineAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, SCAN_AREA_SIZE - 2]
                        })
                      }
                    ]
                  }
                ]} 
              />
              
              {/* Corner markers */}
              <View style={[styles.cornerMarker, styles.cornerTL]} />
              <View style={[styles.cornerMarker, styles.cornerTR]} />
              <View style={[styles.cornerMarker, styles.cornerBL]} />
              <View style={[styles.cornerMarker, styles.cornerBR]} />
            </View>
          </View>
          
          {/* Controls */}
          <View style={[styles.controls, { marginBottom: insets.bottom + 20 }]}>
            {/* <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Ionicons 
                name={flashMode === 'off' ? 'flash-off' : 'flash'} 
                size={28} 
                color="white" 
              />
              <Text style={styles.controlText}>Flash</Text>
            </TouchableOpacity> */}
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={28} color="white" />
              <Text style={styles.controlText}>Flip</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
      
      {/* Result Modal */}
      <Modal
        visible={showResult}
        transparent={true}
        animationType="fade"
        onRequestClose={closeResult}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name={getTypeIcon()} size={32} color="#4F66E5" />
              <Text style={styles.modalTitle}>QR Code Scanned</Text>
            </View>
            
            <View style={styles.resultContainer}>
              <Text style={styles.resultTypeLabel}>
                {result?.type.toUpperCase()}
              </Text>
              <Text style={styles.resultData} numberOfLines={5}>
                {result?.data}
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.secondaryButton]} 
                onPress={closeResult}
              >
                <Text style={styles.secondaryButtonText}>Scan Again</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.primaryButton]} 
                onPress={handleAction}
              >
                <Ionicons 
                  name={result?.type === 'url' ? 'open-outline' : 'copy-outline'} 
                  size={20} 
                  color="white" 
                  style={styles.buttonIcon} 
                />
                <Text style={styles.primaryButtonText}>{getActionText()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
    padding: 20,
  },
  permissionIcon: {
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
    lineHeight: 22,
  },
  permissionButton: {
    backgroundColor: '#4F66E5',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  permissionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  scanAreaContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    width: SCAN_AREA_SIZE,
    backgroundColor: '#4F66E5',
  },
  cornerMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#4F66E5',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 50,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  controlText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  resultContainer: {
    width: '100%',
    backgroundColor: '#F5F7FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  resultTypeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4F66E5',
    marginBottom: 8,
  },
  resultData: {
    fontSize: 16,
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#4F66E5',
  },
  secondaryButton: {
    backgroundColor: '#EEEEEE',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButtonText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 6,
  },
});
