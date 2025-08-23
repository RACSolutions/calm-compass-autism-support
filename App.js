// App.js with beautiful vector icons
import React, { useState, useEffect } from 'react';
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

const App = () => {
  // State management
  const [userData, setUserData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load data on app start
  useEffect(() => {
    loadAppData();
  }, []);

  const loadAppData = async () => {
    try {
      const [loadedUserData, loadedSettings] = await Promise.all([
        DataManager.loadUserData(),
        DataManager.loadSettings()
      ]);
      
      setUserData(loadedUserData);
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error loading app data:', error);
      // Set defaults if loading fails
      setUserData(DataManager.getDefaultUserData());
      setSettings(DataManager.getDefaultSettings());
    } finally {
      setLoading(false);
    }
  };

  // Handle zone selection
  const handleZoneSelection = async (zone) => {
    try {
      setSelectedZone(zone);
      
      // Record the check-in
      const updatedUserData = await DataManager.recordCheckin(zone, userData);
      setUserData(updatedUserData);
      
      // Show kid-friendly encouragement
      const zoneMessages = {
        blue: "You're in the Blue Zone! 💙 That's okay - let's find some calm activities to help you feel better.",
        green: "Awesome! You're in the Green Zone! 💚 You're feeling great - let's keep it that way!",
        yellow: "You're in the Yellow Zone! 💛 Your feelings are getting big - let's find some tools to help!",
        red: "You're in the Red Zone! ❤️ Your feelings are really big right now - let's find ways to help you feel safe and calm."
      };
      
      Alert.alert(
        `${ZONE_EMOJIS[zone]} ${zone.charAt(0).toUpperCase() + zone.slice(1)} Zone`,
        zoneMessages[zone] || `You're in the ${zone} zone. Let's find some helpful tools! 🧭`,
        [{ text: 'Show me tools! 🛠️', style: 'default' }]
      );
    } catch (error) {
      console.error('Error recording check-in:', error);
      setSelectedZone(zone);
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

  const HelpTab = () => (
    <HelpScreen
      selectedZone={selectedZone}
      tools={selectedZone ? getToolsForZone(selectedZone) : []}
      userData={userData}
      onToolUse={handleToolUse}
      onSaveData={handleUpdateUserData}
      accessibilityMode={settings?.theme === 'high_contrast'}
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
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={THEME.semantic.calm} />
      
      <Tab.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: THEME.semantic.calm,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 120,
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
            fontSize: isLargeText ? 13 : 11,
            fontWeight: '600',
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          }
        }}
      >
        <Tab.Screen
          name="CheckIn"
          component={ZonesTab}
          options={{
            tabBarLabel: 'Check In',
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                iconName="home" 
                iconSet="Ionicons"
                focused={focused} 
                size={24}
              />
            ),
          }}
        />
        
        <Tab.Screen
          name="Tools"
          component={HelpTab}
          options={{
            tabBarLabel: 'My Tools',
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                iconName="build" 
                iconSet="Ionicons"
                focused={focused} 
                size={24}
              />
            ),
            tabBarBadge: selectedZone ? undefined : '!',
          }}
        />
        
        <Tab.Screen
          name="Progress"
          component={ProgressTab}
          options={{
            tabBarLabel: 'My Journey',
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                iconName="trending-up" 
                iconSet="Ionicons"
                focused={focused} 
                size={24}
              />
            ),
            tabBarBadge: userData?.streakDays > 3 ? userData.streakDays : undefined,
          }}
        />
        
        <Tab.Screen
          name="Settings"
          component={SettingsTab}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                iconName="settings" 
                iconSet="Ionicons"
                focused={focused} 
                size={24}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerLogo: {
    width: 220,
    height: 65,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.primary.background,
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  tabIconFocused: {
    backgroundColor: THEME.semantic.calm + '15',
  },
});

export default App;