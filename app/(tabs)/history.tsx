import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Linking,
  ScrollView, // Added ScrollView import
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';

type HistoryItem = {
  id: string;
  type: string;
  data: string;
  date: string;
  isFavorite: boolean;
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyString = await AsyncStorage.getItem('qrHistory');
      if (historyString) {
        const parsedHistory = JSON.parse(historyString);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      Alert.alert('Error', 'Failed to load scan history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleFavorite = async (id: string) => {
    try {
      const updatedHistory = history.map(item => 
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      );
      
      setHistory(updatedHistory);
      await AsyncStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const deleteItem = async (id: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              const updatedHistory = history?.filter(item => item.id !== id);
              setHistory(updatedHistory);
              await AsyncStorage.setItem('qrHistory', JSON.stringify(updatedHistory));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error deleting item:', error);
            }
          }
        }
      ]
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    switch (item.type) {
      case 'url':
        Linking.openURL(item.data).catch(() => {
          Alert.alert('Error', 'Could not open this URL');
        });
        break;
      case 'email':
        Linking.openURL(`mailto:${item.data}`).catch(() => {
          Alert.alert('Error', 'Could not open email app');
        });
        break;
      case 'phone':
        Linking.openURL(`tel:${item.data}`).catch(() => {
          Alert.alert('Error', 'Could not open phone app');
        });
        break;
      default:
        // Show details or copy to clipboard
        Alert.alert(
          'QR Code Content',
          item.data,
          [
            { text: 'Copy', onPress: () => {
                 Clipboard.setStringAsync(item.data)
                       .then(() => {
                         Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                         Alert.alert('Copied to clipboard', 'The text has been copied to your clipboard');
                       })
                       .catch((error) => {
                         console.error('Clipboard error:', error);
                         Alert.alert('Error', 'Failed to copy text to clipboard');
                       });
              }
            },
            { text: 'Close' }
          ]
        );
    }
  };

  const filteredHistory = activeFilter === 'all' 
    ? history 
    : activeFilter === 'favorites' 
      ? history?.filter(item => item.isFavorite)
      : history?.filter(item => item.type === activeFilter);

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.itemIconContainer}>
        <Ionicons name={getTypeIcon(item.type)} size={24} color="#4F66E5" />
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemContentText} numberOfLines={1}>{item.data}</Text>
        <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons 
            name={item.isFavorite ? "star" : "star-outline"} 
            size={22} 
            color={item.isFavorite ? "#FB8C00" : "#999999"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => deleteItem(item.id)}
        >
          <Ionicons name="trash-outline" size={22} color="#999999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F66E5" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text 
              style={[
                styles.filterText,
                activeFilter === 'all' && styles.filterTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'favorites' && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter('favorites')}
          >
            <Ionicons 
              name="star" 
              size={16} 
              color={activeFilter === 'favorites' ? "#FFFFFF" : "#333333"} 
              style={styles.filterIcon}
            />
            <Text 
              style={[
                styles.filterText,
                activeFilter === 'favorites' && styles.filterTextActive
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'url' && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter('url')}
          >
            <Ionicons 
              name="globe-outline" 
              size={16} 
              color={activeFilter === 'url' ? "#FFFFFF" : "#333333"} 
              style={styles.filterIcon}
            />
            <Text 
              style={[
                styles.filterText,
                activeFilter === 'url' && styles.filterTextActive
              ]}
            >
              URLs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'text' && styles.filterButtonActive
            ]}
            onPress={() => setActiveFilter('text')}
          >
            <Ionicons 
              name="document-text-outline" 
              size={16} 
              color={activeFilter === 'text' ? "#FFFFFF" : "#333333"} 
              style={styles.filterIcon}
            />
            <Text 
              style={[
                styles.filterText,
                activeFilter === 'text' && styles.filterTextActive
              ]}
            >
              Text
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      {filteredHistory.length > 0 ? (
  <FlatList
    data={filteredHistory}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.listContent}
    showsVerticalScrollIndicator={false}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={['#4F66E5']}
        tintColor="#4F66E5"
      />
    }
  />
) : (
  <ScrollView
    contentContainerStyle={styles.emptyContainer}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={['#4F66E5']}
        tintColor="#4F66E5"
      />
    }
  >
    <Ionicons name="time-outline" size={80} color="#CCCCCC" />
    <Text style={styles.emptyText}>No scan history found</Text>
    <Text style={styles.emptySubtext}>
      Scanned QR codes will appear here
    </Text>
  </ScrollView>
)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterContainer: {
    paddingHorizontal: 20,
  },
  filterScroll: {
    paddingVertical: 5,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#4F66E5',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#333333',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  historyItem: {
    flexDirection: 'row',
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
  itemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(79, 102, 229, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContentText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 12,
    color: '#999999',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999999',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 8,
    textAlign: 'center',
  },
});