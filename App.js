// App.js - Fixed with proper error handling and data management (keeping original logo)
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

// Custom Header Logo Component - KEEPING YOUR ORIGINAL
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
        console.log('Initializing app...');
        
        const [loadedUserData, loadedSettings] = await Promise.all([
          DataManager.loadUserData(),
          DataManager.loadSettings()
        ]);
        
        console.log('Loaded user data:', loadedUserData);
        console.log('Loaded settings:', loadedSettings);
        
        setUserData(loadedUserData);
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        
        // Use defaults if loading fails
        setUserData(DataManager.getDefaultUserData());
        setSettings(DataManager.getDefaultSettings());
        
        Alert.alert(
          'Welcome to Calm Compass! 🧭', 
          'Let\'s set up your emotional regulation journey together.'
        );
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  // Handle zone selection - FIXED
  const handleZoneSelection = async (zone) => {
    try {
      console.log('Zone selected:', zone);
      
      if (!zone || typeof zone !== 'string') {
        console.error('Invalid zone selection:', zone);
        return;
      }

      if (!userData) {
        console.error('No userData available');
        return;
      }
      
      // Record the check-in
      const updatedUserData = await DataManager.recordCheckin(zone, userData);
      console.log('Check-in recorded, updated userData:', updatedUserData);
      
      setUserData(updatedUserData);
      setSelectedZone(zone);
      
      // Navigate directly to Help tab
      if (navigationRef.current) {
        navigationRef.current.navigate('Help');
      }
      
    } catch (error) {
      console.error('Error recording check-in:', error);
      
      // Still set zone and navigate even if recording fails
      setSelectedZone(zone);
      
      if (navigationRef.current) {
        navigationRef.current.navigate('Help');
      }
    }
  };

  // Handle tool usage - FIXED
  const handleToolUse = async (toolTitle) => {
    try {
      console.log('Tool used:', toolTitle);
      
      if (!toolTitle || !userData) {
        console.warn('Missing tool title or userData');
        return;
      }
      
      const updatedUserData = await DataManager.recordToolUsage(toolTitle, userData);
      console.log('Tool usage recorded, updated userData:', updatedUserData);
      
      setUserData(updatedUserData);
    } catch (error) {
      console.error('Error recording tool usage:', error);
    }
  };

  // Update settings - FIXED
  const handleUpdateSettings = async (newSettings) => {
    try {
      console.log('Updating settings:', newSettings);
      
      if (!newSettings || typeof newSettings !== 'object') {
        throw new Error('Invalid settings data');
      }
      
      const success = await DataManager.saveSettings(newSettings);
      if (success) {
        setSettings(newSettings);
        console.log('Settings updated successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      Alert.alert('Settings Error', 'Could not save your settings. Please try again.');
      throw error;
    }
  };

  // Update user data - FIXED
  const handleUpdateUserData = async (newUserData) => {
    try {
      console.log('Updating user data:', newUserData);
      
      if (!newUserData || typeof newUserData !== 'object') {
        throw new Error('Invalid user data');
      }
      
      const success = await DataManager.saveUserData(newUserData);
      if (success) {
        setUserData(newUserData);
        console.log('User data updated successfully');
      } else {
        throw new Error('Failed to save user data');
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      Alert.alert('Data Error', 'Could not save your data. Please try again.');
      throw error;
    }
  };

  // Export data for sharing - FIXED
  const handleExportData = async () => {
    try {
      if (!userData || !settings) {
        Alert.alert('No Data', 'No data available to export yet!');
        return;
      }
      
      const exportData = await DataManager.exportData(userData, settings);
      if (exportData && exportData.analytics) {
        const totalCheckins = exportData.analytics.totalCheckins || 0;
        const streakDays = exportData.analytics.streakDays || 0;
        const topTool = exportData.analytics.topTools?.[0]?.[0] || 'Still discovering!';
        
        Alert.alert(
          'Your Progress Report is Ready! 📊✨',
          `Way to go! Here's what you've accomplished:\n\n🧭 Total Check-ins: ${totalCheckins}\n🔥 Current Streak: ${streakDays} days\n⭐ Favorite Tool: ${topTool}\n\nThis report can be shared with your parents, teachers, or counselors to show them how awesome you're doing!`,
          [{ text: 'That\'s amazing! 🎉', style: 'default' }]
        );
      } else {
        Alert.alert('Export Ready', 'Your data has been prepared for export!');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Oops! 😅', 'Something went wrong creating your report. Let\'s try again later!');
    }
  };

  // Tab Screen Components with error boundaries
  const ZonesTab = (props) => {
    if (!userData || !settings) {
      return (
        <View style={styles.tabLoadingContainer}>
          <Text style={styles.tabLoadingText}>Loading zones...</Text>
        </View>
      );
    }
    
    return (
      <ZonesScreen
        {...props}
        userData={userData}
        onZoneSelect={handleZoneSelection}
        accessibilityMode={settings.theme === 'high_contrast'}
      />
    );
  };

  const HelpTab = (props) => {
    const tools = selectedZone ? getToolsForZone(selectedZone) : [];
    
    return (
      <HelpScreen
        {...props}
        selectedZone={selectedZone}
        tools={tools}
        userData={userData}
        onToolUse={handleToolUse}
        onSaveData={handleUpdateUserData}
        accessibilityMode={settings?.theme === 'high_contrast'}
      />
    );
  };

  const ProgressTab = (props) => {
    if (!userData) {
      return (
        <View style={styles.tabLoadingContainer}>
          <Text style={styles.tabLoadingText}>Loading progress...</Text>
        </View>
      );
    }
    
    return (
      <ProgressScreen
        {...props}
        userData={userData}
        onExportData={handleExportData}
        accessibilityMode={settings?.theme === 'high_contrast'}
      />
    );
  };

  const SettingsTab = (props) => {
    if (!userData || !settings) {
      return (
        <View style={styles.tabLoadingContainer}>
          <Text style={styles.tabLoadingText}>Loading settings...</Text>
        </View>
      );
    }
    
    return (
      <SettingsScreen
        {...props}
        userData={userData}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onUpdateUserData={handleUpdateUserData}
        onClose={() => {}}
        accessibilityMode={settings.theme === 'high_contrast'}
      />
    );
  };

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
            height: 140, // KEEPING YOUR ORIGINAL HEIGHT
          },
          headerTitle: () => <HeaderLogo />, // KEEPING YOUR ORIGINAL LOGO COMPONENT
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
  tabLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.primary.background,
  },
  tabLoadingText: {
    fontSize: 16,
    color: THEME.text.secondary,
  },
  // KEEPING YOUR ORIGINAL LOGO STYLES
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