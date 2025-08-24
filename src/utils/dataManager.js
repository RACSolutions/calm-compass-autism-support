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
      if (!userData || typeof userData !== 'object') {
        throw new Error('Invalid userData provided');
      }
      
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
      if (!settings || typeof settings !== 'object') {
        throw new Error('Invalid settings provided');
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  // Record a check-in - FIXED
  static async recordCheckin(zone, userData) {
    try {
      if (!zone || !userData) {
        throw new Error('Missing zone or userData');
      }
      
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

      // Ensure checkins array exists
      const currentCheckins = Array.isArray(userData.checkins) ? userData.checkins : [];
      const updatedCheckins = [...currentCheckins, checkin];
      
      const updatedUserData = {
        ...userData,
        checkins: updatedCheckins,
        totalCheckins: updatedCheckins.length,
        streakDays: this.calculateStreak(updatedCheckins)
      };

      await this.saveUserData(updatedUserData);
      return updatedUserData;
    } catch (error) {
      console.error('Error recording checkin:', error);
      return userData;
    }
  }

  // Record tool usage - FIXED
  static async recordToolUsage(toolTitle, userData) {
    try {
      if (!toolTitle || !userData) {
        console.warn('Missing toolTitle or userData');
        return userData;
      }

      // Ensure checkins array exists
      const currentCheckins = Array.isArray(userData.checkins) ? userData.checkins : [];
      
      if (currentCheckins.length === 0) {
        console.warn('No checkins available to record tool usage');
        return userData;
      }

      // Update the most recent checkin with tool usage
      const updatedCheckins = currentCheckins.map((checkin, index) => {
        if (index === currentCheckins.length - 1) { // Last checkin
          const currentToolsUsed = Array.isArray(checkin.tools_used) ? checkin.tools_used : [];
          return {
            ...checkin,
            tools_used: [...currentToolsUsed, {
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
      try {
        const toolUsage = await this.loadToolUsage();
        toolUsage[toolTitle] = (toolUsage[toolTitle] || 0) + 1;
        await AsyncStorage.setItem(STORAGE_KEYS.TOOL_USAGE, JSON.stringify(toolUsage));
      } catch (toolUsageError) {
        console.error('Error saving tool usage stats:', toolUsageError);
        // Continue even if tool usage stats fail
      }

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
    if (!Array.isArray(checkins) || checkins.length === 0) return 0;

    try {
      // Get unique dates
      const uniqueDates = [...new Set(checkins.map(c => c.date))];
      const sortedDates = uniqueDates
        .map(d => new Date(d))
        .sort((a, b) => b - a);

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < sortedDates.length; i++) {
        const checkinDate = new Date(sortedDates[i]);
        checkinDate.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((currentDate - checkinDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else if (daysDiff > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating streak:', error);
      return 0;
    }
  }

  // Get analytics data
  static async getAnalytics(userData) {
    try {
      const toolUsage = await this.loadToolUsage();
      const checkins = Array.isArray(userData.checkins) ? userData.checkins : [];
      
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
      return {
        totalCheckins: 0,
        streakDays: 0,
        zoneStats: {},
        weeklyData: [],
        topTools: [],
        averageDaily: 0
      };
    }
  }

  // Get weekly progress data for charts
  static getWeeklyProgress(checkins) {
    try {
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
    } catch (error) {
      console.error('Error generating weekly progress:', error);
      return [];
    }
  }

  // Calculate days since app first use
  static getDaysSinceStart(createdAt) {
    try {
      const start = new Date(createdAt);
      const now = new Date();
      return Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1;
    } catch (error) {
      console.error('Error calculating days since start:', error);
      return 1;
    }
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
          // Remove sensitive information if needed
          parentalEmail: settings?.parentalEmail ? '[REDACTED]' : ''
        },
        settings: {
          ...settings,
          parentalEmail: settings?.parentalEmail ? '[REDACTED]' : ''
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