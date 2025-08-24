// App.js - Updated to automatically navigate to tools when zone is selected
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { 
  SafeAreaView, 
  Alert, 
  Platform,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';

// Import vector icons from Expo
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

// Import screens
import ZonesScreen from './src/screens/ZonesScreen';
import HelpScreen from './src/screens/HelpScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Import utilities and data
import { DataManager } from './src/utils/dataManager';
import { getToolsForZone } from './src/data/tools';
import { THEME, ZONE_EMOJIS } from './src/styles/colors';

const Tab = createBottomTabNavigator();

// Custom Header Logo Component
const HeaderLogo = () => (
  <Image 
    source={require('./assets/logo.png')} 
    style={styles.headerLogo}
    resizeMode="contain"
  />
);

// Enhanced Tab Icon Component with vector icons
const TabIcon = ({ iconName, iconSet = 'Ionicons', focused, size = 24 }) => {
  const iconColor = focused ? THEME.semantic.calm : THEME.text.secondary;
  
  // Choose the right icon set
  const IconComponent = iconSet === 'MaterialIcons' ? MaterialIcons : 
                       iconSet === 'FontAwesome5' ? FontAwesome5 : Ionicons;
  
  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
      <IconComponent 
        name={iconName} 
        size={focused ? size + 2 : size} 
        color={iconColor}
      />
    </View>
  );
};

export default function App() {
  const [userData, setUserData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Create a ref to control navigation
  const navigationRef = useRef();

  // Initialize app data
  useEffect(() => {
    async function initializeApp() {
      try {
        const [loadedUserData, loadedSettings] = await Promise.all([
          DataManager.loadUserData(),
          DataManager.loadSettings()
        ]);
        
        setUserData(loadedUserData);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert('Welcome to Calm Compass! 🧭', 'Let\'s set up your emotional regulation journey together.');
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  // Handle zone selection - simple direct navigation like HTML concept
  const handleZoneSelection = async (zone) => {
    try {
      // Record the check-in silently
      const checkinData = {
        timestamp: new Date().toISOString(),
        zone: zone,
        id: Date.now()
      };
      
      const updatedUserData = await DataManager.recordCheckin(checkinData, userData);
      setUserData(updatedUserData);
      setSelectedZone(zone);
      
      // Navigate directly to Help tab (like HTML concept - no popup)
      navigationRef.current?.navigate('Help');
      
    } catch (error) {
      console.error('Error recording check-in:', error);
      setSelectedZone(zone);
      
      // Still navigate to tools even if data recording fails
      navigationRef.current?.navigate('Help');
    }
  };

  // Handle tool usage
  const handleToolUse = async (toolTitle) => {
    try {
      if (!userData || !userData.checkins.length) return;
      
      const currentCheckinId = userData.checkins[userData.checkins.length - 1].id;
      const updatedUserData = await DataManager.recordToolUsage(
        toolTitle, 
        currentCheckinId, 
        userData
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error recording tool usage:', error);
    }
  };

  // Update settings
  const handleUpdateSettings = async (newSettings) => {
    try {
      await DataManager.saveSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // Update user data
  const handleUpdateUserData = async (newUserData) => {
    try {
      await DataManager.saveUserData(newUserData);
      setUserData(newUserData);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // Export data for sharing
  const handleExportData = async () => {
    try {
      const exportData = await DataManager.exportData(userData, settings);
      if (exportData) {
        Alert.alert(
          'Your Progress Report is Ready! 📊✨',
          `Way to go! Here's what you've accomplished:\n\n🧭 Total Check-ins: ${userData.checkins.length}\n🔥 Current Streak: ${userData.streakDays} days\n⭐ Favorite Tools: ${exportData.analytics?.topTools?.[0]?.[0] || 'Still discovering!'}\n\nThis report can be shared with your parents, teachers, or counselors to show them how awesome you're doing!`,
          [{ text: 'That\'s amazing! 🎉', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Oops! 😅', 'Something went wrong creating your report. Let\'s try again later!');
    }
  };

  // Tab Screen Components
  const ZonesTab = () => (
    <ZonesScreen
      userData={userData}
      onZoneSelect={handleZoneSelection}
      accessibilityMode={settings?.theme === 'high_contrast'}
    />
  );

  const HelpTab = ({ navigation }) => (
    <HelpScreen
      selectedZone={selectedZone}
      tools={selectedZone ? getToolsForZone(selectedZone) : []}
      userData={userData}
      onToolUse={handleToolUse}
      onSaveData={handleUpdateUserData}
      accessibilityMode={settings?.theme === 'high_contrast'}
      navigation={navigation}
    />
  );

  const ProgressTab = () => (
    <ProgressScreen
      userData={userData}
      onExportData={handleExportData}
      accessibilityMode={settings?.theme === 'high_contrast'}
    />
  );

  const SettingsTab = () => (
    <SettingsScreen
      userData={userData}
      settings={settings}
      onUpdateSettings={handleUpdateSettings}
      onUpdateUserData={handleUpdateUserData}
      onClose={() => {}}
      accessibilityMode={settings?.theme === 'high_contrast'}
    />
  );

  // Loading screen
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🧭</Text>
        <Text style={styles.loadingTitle}>Calm Compass</Text>
        <Text style={styles.loadingText}>Getting ready for you...</Text>
      </SafeAreaView>
    );
  }

  // Tab bar styling
  const isHighContrast = settings?.theme === 'high_contrast';
  const isLargeText = settings?.fontSize === 'large';

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="light" backgroundColor={THEME.semantic.calm} />
      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: route.name !== 'Help', // Hide header only for Help screen
          headerStyle: {
            backgroundColor: THEME.semantic.calm,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 140,
          },
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: 'center',
          tabBarStyle: {
            backgroundColor: isHighContrast 
              ? THEME.accessibility.highContrast.background 
              : THEME.primary.white,
            borderTopColor: isHighContrast
              ? THEME.accessibility.highContrast.primary
              : '#e0e0e0',
            borderTopWidth: isHighContrast ? 2 : 1,
            height: Platform.OS === 'ios' ? 85 : 70,
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 25 : 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarActiveTintColor: THEME.semantic.calm,
          tabBarInactiveTintColor: isHighContrast 
            ? THEME.accessibility.highContrast.secondary 
            : THEME.text.secondary,
          tabBarLabelStyle: {
            fontSize: isLargeText ? 14 : 11,
            fontWeight: '600',
            marginTop: -4,
          }
        })}
      >
        <Tab.Screen 
          name="Zones" 
          component={ZonesTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="color-palette" focused={focused} />
            ),
          }}
        />
        <Tab.Screen 
          name="Help" 
          component={HelpTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="build" focused={focused} />
            ),
            tabBarBadge: selectedZone ? '🎯' : null,
            tabBarBadgeStyle: {
              backgroundColor: 'transparent',
              fontSize: 12,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              marginTop: -8,
              marginLeft: 8,
            }
          }}
        />
        <Tab.Screen 
          name="Progress" 
          component={ProgressTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="bar-chart" iconSet="Ionicons" focused={focused} />
            ),
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsTab}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon iconName="settings" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.semantic.calm,
  },
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  headerLogo: {
    width: 200,
    height: 100,
  },
  tabIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  tabIconFocused: {
    backgroundColor: THEME.semantic.calm + '20',
  },
});