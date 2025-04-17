// Example structure using React Navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScanScreen from "./(tabs)/ScanScreen"; // Adjust the import path as necessary
import { Scan, QrCode, History, Settings } from 'lucide-react-native'; // or your preferred icon library

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4F66E5',
        tabBarInactiveTintColor: '#9EAEFF',
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{
          tabBarIcon: ({ color }) => <Scan color={color} size={24} />,
        }}
      />

    </Tab.Navigator>
  );
}