// src/utils/dataManager.js - Enhanced data persistence and management
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_DATA: '@CalmCompass:userData',
  SETTINGS: '@CalmCompass:settings',
  CHECKIN_HISTORY: '@CalmCompass:checkinHistory',
  TOOL_USAGE: '@CalmCompass:toolUsage',
  PROGRESS_DATA: '@CalmCompass:progressData'
};

export class DataManager {
  
  // Initialize default user data
  static getDefaultUserData() {
    return {
      userName: '',
      preferredName: '',
      age: null,
      setupCompleted: false,
      accessibilityMode: false,
      parentalControlsEnabled: false,
      zoneDescriptions: {
        blue: "Feeling sad, tired, or need quiet time",
        green: "Feeling happy, calm, and ready to learn", 
        yellow: "Feeling worried, frustrated, or wiggly",
        red: "Feeling angry, scared, or overwhelmed"
      },
      customZoneDescriptions: {},
      favoriteTools: [],
      blockedTools: [],
      checkins: [],
      streakDays: 0,
      totalCheckins: 0,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
  }

  // Get default app settings
  static getDefaultSettings() {
    return {
      theme: 'default', // 'default', 'high_contrast', 'dark'
      soundEnabled: true,
      hapticEnabled: true,
      reminderNotifications: false,
      reminderTime: '18:00',
      parentalReportsEnabled: false,
      parentalEmail: '',
      language: 'en',
      fontSize: 'normal', // 'small', 'normal', 'large'
      reducedMotion: false,
      autoSaveProgress: true,
      dataSharingEnabled: false
    };
  }

  // Load user data
  static async loadUserData() {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const parsed = JSON.parse(userData);
        // Merge with defaults to ensure all properties exist
        return { ...this.getDefaultUserData(), ...parsed };
      }
      return this.getDefaultUserData();
    } catch (error) {
      console.error('Error loading user data:', error);
      return this.getDefaultUserData();
    }
  }

  // Save user data
  static async saveUserData(userData) {
    try {
      const dataToSave = {
        ...userData,
        lastUsed: new Date().toISOString()
      };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  // Load app settings
  static async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (settings) {
        const parsed = JSON.parse(settings);
        return { ...this.getDefaultSettings(), ...parsed };
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Save app settings
  static async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Record a check-in
  static async recordCheckin(zone, userData) {
    const checkin = {
      id: Date.now().toString(),
      zone,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString(),
      tools_used: [],
      mood_before: null,
      mood_after: null,
      notes: ''
    };

    const updatedCheckins = [...userData.checkins, checkin];
    const updatedUserData = {
      ...userData,
      checkins: updatedCheckins,
      totalCheckins: updatedCheckins.length,
      streakDays: this.calculateStreak(updatedCheckins)
    };

    await this.saveUserData(updatedUserData);
    return updatedUserData;
  }

  // Record tool usage
  static async recordToolUsage(toolTitle, checkinId, userData) {
    try {
      // Update the current checkin with tool usage
      const updatedCheckins = userData.checkins.map(checkin => {
        if (checkin.id === checkinId || checkin === userData.checkins[userData.checkins.length - 1]) {
          return {
            ...checkin,
            tools_used: [...(checkin.tools_used || []), {
              tool: toolTitle,
              timestamp: new Date().toISOString()
            }]
          };
        }
        return checkin;
      });

      const updatedUserData = {
        ...userData,
        checkins: updatedCheckins
      };

      // Save tool usage statistics
      const toolUsage = await this.loadToolUsage();
      toolUsage[toolTitle] = (toolUsage[toolTitle] || 0) + 1;
      await AsyncStorage.setItem(STORAGE_KEYS.TOOL_USAGE, JSON.stringify(toolUsage));

      await this.saveUserData(updatedUserData);
      return updatedUserData;
    } catch (error) {
      console.error('Error recording tool usage:', error);
      return userData;
    }
  }

  // Load tool usage statistics
  static async loadToolUsage() {
    try {
      const toolUsage = await AsyncStorage.getItem(STORAGE_KEYS.TOOL_USAGE);
      return toolUsage ? JSON.parse(toolUsage) : {};
    } catch (error) {
      console.error('Error loading tool usage:', error);
      return {};
    }
  }

  // Calculate streak days
  static calculateStreak(checkins) {
    if (!checkins.length) return 0;

    const sortedCheckins = checkins
      .map(c => new Date(c.date))
      .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedCheckins.length; i++) {
      const checkinDate = new Date(sortedCheckins[i]);
      checkinDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate - checkinDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak + 1) {
        break;
      }
    }

    return streak;
  }

  // Get analytics data
  static async getAnalytics(userData) {
    try {
      const toolUsage = await this.loadToolUsage();
      const checkins = userData.checkins || [];
      
      // Zone usage statistics
      const zoneStats = checkins.reduce((acc, checkin) => {
        acc[checkin.zone] = (acc[checkin.zone] || 0) + 1;
        return acc;
      }, {});

      // Weekly progress
      const weeklyData = this.getWeeklyProgress(checkins);
      
      // Most used tools
      const topTools = Object.entries(toolUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return {
        totalCheckins: checkins.length,
        streakDays: userData.streakDays || 0,
        zoneStats,
        weeklyData,
        topTools,
        averageDaily: checkins.length / Math.max(1, this.getDaysSinceStart(userData.createdAt))
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      return null;
    }
  }

  // Get weekly progress data for charts
  static getWeeklyProgress(checkins) {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      
      const dayCheckins = checkins.filter(c => c.date === dateString);
      last7Days.push({
        date: dateString,
        shortDate: date.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayCheckins.length,
        zones: dayCheckins.map(c => c.zone)
      });
    }
    
    return last7Days;
  }

  // Calculate days since app first use
  static getDaysSinceStart(createdAt) {
    const start = new Date(createdAt);
    const now = new Date();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  }

  // Export data for backup or sharing with caregivers
  static async exportData(userData, settings) {
    try {
      const toolUsage = await this.loadToolUsage();
      const analytics = await this.getAnalytics(userData);
      
      return {
        exportDate: new Date().toISOString(),
        userData: {
          ...userData,
          // Remove sensitive information
          parentalEmail: settings.parentalEmail ? '[REDACTED]' : ''
        },
        settings: {
          ...settings,
          parentalEmail: settings.parentalEmail ? '[REDACTED]' : ''
        },
        toolUsage,
        analytics,
        version: '1.0.0'
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }

  // Clear all data (for reset functionality)
  static async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.CHECKIN_HISTORY,
        STORAGE_KEYS.TOOL_USAGE,
        STORAGE_KEYS.PROGRESS_DATA
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}