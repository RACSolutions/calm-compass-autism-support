// src/screens/SettingsScreen.js - Fixed version with proper syntax
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { THEME } from '../styles/colors';
import { DataManager } from '../utils/dataManager';

const { width } = Dimensions.get('window');

const SettingsScreen = ({ 
  userData, 
  settings, 
  onUpdateSettings, 
  onUpdateUserData, 
  onClose,
  accessibilityMode = false 
}) => {
  const [localSettings, setLocalSettings] = useState(settings || {});
  const [localUserData, setLocalUserData] = useState(userData || {});
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (userData) setLocalUserData(userData);
  }, [userData]);

  const SettingSection = ({ title, children, icon }) => (
    <View style={[styles.section, accessibilityMode && styles.highContrastSection]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

  const SettingRow = ({ 
    title, 
    subtitle, 
    value, 
    onValueChange, 
    type = 'switch', 
    options = [],
    placeholder = '' 
  }) => {
    // Local state for text inputs to prevent re-render issues
    const [localValue, setLocalValue] = useState(value || '');
    
    useEffect(() => {
      setLocalValue(value || '');
    }, [value]);

    const handleTextChange = (text) => {
      setLocalValue(text);
      // Debounce the actual state update
      setTimeout(() => {
        onValueChange(text);
      }, 0);
    };

    return (
      <View style={[styles.settingRow, accessibilityMode && styles.highContrastRow]}>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, accessibilityMode && styles.highContrastText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, accessibilityMode && styles.highContrastSubtitle]}>
              {subtitle}
            </Text>
          )}
        </View>
        <View style={styles.settingControl}>
          {type === 'switch' && (
            <Switch
              value={value}
              onValueChange={onValueChange}
              trackColor={{ false: '#ccc', true: THEME.semantic.calm }}
              thumbColor={value ? '#fff' : '#f4f3f4'}
              accessibilityLabel={title}
              accessibilityRole="switch"
            />
          )}
          {type === 'select' && (
            <TouchableOpacity
              style={[styles.selectButton, accessibilityMode && styles.highContrastButton]}
              onPress={() => showOptionsModal(title, options, value, onValueChange)}
              accessibilityRole="button"
              accessibilityLabel={`${title}: ${value}`}
            >
              <Text style={[styles.selectText, accessibilityMode && styles.highContrastText]}>
                {value}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          )}
          {type === 'input' && (
            <TextInput
              style={[styles.textInput, accessibilityMode && styles.highContrastInput]}
              value={localValue}
              onChangeText={handleTextChange}
              placeholder={placeholder}
              placeholderTextColor={THEME.text.light}
              accessibilityLabel={title}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          )}
        </View>
      </View>
    );
  };

  const showOptionsModal = (title, options, currentValue, onSelect) => {
    Alert.alert(
      title,
      'Choose an option:',
      options.map(option => ({
        text: option,
        onPress: () => onSelect(option),
        style: option === currentValue ? 'default' : 'cancel'
      }))
    );
  };

  const handleSave = async () => {
    try {
      await onUpdateSettings(localSettings);
      await onUpdateUserData(localUserData);
      Alert.alert('Settings Saved! 🎉', 'Your preferences have been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleReset = async () => {
    try {
      const success = await DataManager.clearAllData();
      if (success) {
        Alert.alert(
          'Reset Complete! 🔄',
          'All data has been cleared. The app will restart with default settings.',
          [{ text: 'OK', onPress: () => onClose() }]
        );
      } else {
        Alert.alert('Error', 'Failed to reset data. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during reset.');
    }
  };

  const handleExportData = async () => {
    try {
      const exportData = await DataManager.exportData(userData, settings);
      if (exportData) {
        Alert.alert(
          'Export Ready! 📤',
          'Your data has been prepared for export. This feature will allow sharing with caregivers in future updates.',
          [{ text: 'Got it!', style: 'default' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data.');
    }
  };

  return (
    <View style={[styles.container, accessibilityMode && styles.highContrastContainer]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        <SettingSection title="Profile" icon="👤">
          <SettingRow
            title="Your Name"
            subtitle="What should we call you?"
            type="input"
            value={localUserData?.userName || ''}
            placeholder="Enter your name"
            onValueChange={(value) => 
              setLocalUserData(prev => ({ ...prev, userName: value }))
            }
          />
          <SettingRow
            title="Preferred Name"
            subtitle="A special name just for you"
            type="input"
            value={localUserData?.preferredName || ''}
            placeholder="Nickname or preferred name"
            onValueChange={(value) => 
              setLocalUserData(prev => ({ ...prev, preferredName: value }))
            }
          />
        </SettingSection>

        {/* Accessibility */}
        <SettingSection title="Accessibility" icon="♿">
          <SettingRow
            title="High Contrast Mode"
            subtitle="Easier to see colors and text"
            value={localSettings?.theme === 'high_contrast'}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ 
                ...prev, 
                theme: value ? 'high_contrast' : 'default' 
              }))
            }
          />
          <SettingRow
            title="Text Size"
            subtitle="Make text larger or smaller"
            type="select"
            value={localSettings?.fontSize || 'normal'}
            options={['Small', 'Normal', 'Large']}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, fontSize: value.toLowerCase() }))
            }
          />
          <SettingRow
            title="Reduced Motion"
            subtitle="Less animations and movement"
            value={localSettings?.reducedMotion || false}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, reducedMotion: value }))
            }
          />
        </SettingSection>

        {/* Notifications & Sounds */}
        <SettingSection title="Sounds & Notifications" icon="🔔">
          <SettingRow
            title="Sound Effects"
            subtitle="Play sounds when using tools"
            value={localSettings.soundEnabled}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, soundEnabled: value }))
            }
          />
          <SettingRow
            title="Haptic Feedback"
            subtitle="Phone vibrates for feedback"
            value={localSettings.hapticEnabled}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, hapticEnabled: value }))
            }
          />
          <SettingRow
            title="Daily Reminders"
            subtitle="Gentle reminders to check in"
            value={localSettings.reminderNotifications}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, reminderNotifications: value }))
            }
          />
        </SettingSection>

        {/* Zone Customization */}
        <SettingSection title="Customize Your Zones" icon="🎨">
          <View style={styles.zoneCustomization}>
            <Text style={[styles.customizationTitle, accessibilityMode && styles.highContrastText]}>
              Make your zones feel just right for you! 💙
            </Text>
            <Text style={[styles.customizationSubtitle, accessibilityMode && styles.highContrastSubtitle]}>
              These descriptions help you understand each zone better.
            </Text>
            
            {Object.entries(localUserData?.zoneDescriptions || {}).map(([zone, description]) => {
              const ZoneTextInput = () => {
                const [localZoneValue, setLocalZoneValue] = useState(description || '');
                
                useEffect(() => {
                  setLocalZoneValue(description || '');
                }, [description]);

                const handleZoneTextChange = (text) => {
                  setLocalZoneValue(text);
                  setTimeout(() => {
                    setLocalUserData(prev => ({
                      ...prev,
                      zoneDescriptions: {
                        ...prev.zoneDescriptions,
                        [zone]: text
                      }
                    }));
                  }, 0);
                };

                return (
                  <TextInput
                    style={[styles.zoneInput, accessibilityMode && styles.highContrastInput]}
                    value={localZoneValue}
                    onChangeText={handleZoneTextChange}
                    placeholder={`Describe your ${zone} zone...`}
                    multiline
                    numberOfLines={2}
                    accessibilityLabel={`${zone} zone description`}
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                );
              };

              return (
                <View key={zone} style={styles.zoneCustomRow}>
                  <Text style={styles.zoneName}>
                    {zone.charAt(0).toUpperCase() + zone.slice(1)} Zone
                  </Text>
                  <ZoneTextInput />
                </View>
              );
            })}
          </View>
        </SettingSection>

        {/* Data & Privacy */}
        <SettingSection title="Data & Privacy" icon="🔒">
          <SettingRow
            title="Auto-Save Progress"
            subtitle="Automatically save your check-ins"
            value={localSettings?.autoSaveProgress || true}
            onValueChange={(value) => 
              setLocalSettings(prev => ({ ...prev, autoSaveProgress: value }))
            }
          />
          
          <TouchableOpacity
            style={[styles.actionButton, styles.exportButton]}
            onPress={() => setShowExportModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Export your data"
          >
            <Text style={styles.actionButtonText}>📤 Export My Data</Text>
            <Text style={styles.actionButtonSubtext}>
              Create a report to share with caregivers
            </Text>
          </TouchableOpacity>
        </SettingSection>

        {/* Advanced */}
        <SettingSection title="Advanced" icon="🔧">
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={() => setShowResetModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Reset all data"
          >
            <Text style={[styles.actionButtonText, { color: THEME.text.error }]}>
              🔄 Reset All Data
            </Text>
            <Text style={styles.actionButtonSubtext}>
              Clear all progress and start fresh
            </Text>
          </TouchableOpacity>

          <View style={styles.versionInfo}>
            <Text style={[styles.versionText, accessibilityMode && styles.highContrastSubtitle]}>
              Calm Compass v1.0.0
            </Text>
            <Text style={[styles.versionText, accessibilityMode && styles.highContrastSubtitle]}>
              Made with 💚 for emotional wellness
            </Text>
          </View>
        </SettingSection>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Save Button at Bottom */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={styles.bottomSaveButton}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Save all settings"
        >
          <Text style={styles.bottomSaveButtonText}>💾 Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Reset Confirmation Modal */}
      <Modal
        visible={showResetModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResetModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, accessibilityMode && styles.highContrastModal]}>
            <Text style={styles.modalTitle}>⚠️ Reset All Data</Text>
            <Text style={[styles.modalText, accessibilityMode && styles.highContrastText]}>
              This will permanently delete all your progress, check-ins, and settings. 
              You cannot undo this action.
            </Text>
            <Text style={[styles.modalSubtext, accessibilityMode && styles.highContrastSubtitle]}>
              Are you absolutely sure you want to continue?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowResetModal(false)}
              >
                <Text style={styles.cancelButtonText}>Keep My Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowResetModal(false);
                  handleReset();
                }}
              >
                <Text style={styles.confirmButtonText}>Reset Everything</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Export Modal */}
      <Modal
        visible={showExportModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, accessibilityMode && styles.highContrastModal]}>
            <Text style={styles.modalTitle}>📤 Export Data</Text>
            <Text style={[styles.modalText, accessibilityMode && styles.highContrastText]}>
              Create a summary report of your progress to share with parents, 
              teachers, or counselors.
            </Text>
            <Text style={[styles.modalSubtext, accessibilityMode && styles.highContrastSubtitle]}>
              This report includes your zone usage, favorite tools, and progress 
              over time, but no personal information.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.cancelButtonText}>Not Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setShowExportModal(false);
                  handleExportData();
                }}
              >
                <Text style={styles.confirmButtonText}>Create Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    backgroundColor: THEME.primary.white,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: THEME.text.secondary,
    lineHeight: 18,
  },
  settingControl: {
    alignItems: 'flex-end',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    minWidth: 80,
  },
  selectText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text.primary,
    marginRight: 6,
  },
  selectArrow: {
    fontSize: 10,
    color: THEME.text.secondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: THEME.text.primary,
    backgroundColor: 'white',
    minWidth: 120,
  },
  zoneCustomization: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  customizationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 8,
  },
  customizationSubtitle: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginBottom: 20,
    lineHeight: 18,
  },
  zoneCustomRow: {
    marginBottom: 16,
  },
  zoneName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 8,
  },
  zoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.text.primary,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  actionButton: {
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exportButton: {
    backgroundColor: THEME.semantic.calm + '10',
    borderColor: THEME.semantic.calm,
  },
  resetButton: {
    backgroundColor: '#fee',
    borderColor: THEME.text.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionButtonSubtext: {
    fontSize: 13,
    color: THEME.text.secondary,
  },
  versionInfo: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 12,
    color: THEME.text.light,
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 40,
  },
  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME.primary.white,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomSaveButton: {
    backgroundColor: THEME.semantic.calm,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSaveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: THEME.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  modalSubtext: {
    fontSize: 13,
    color: THEME.text.secondary,
    lineHeight: 18,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 0.48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: THEME.semantic.attention,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  // High contrast styles
  highContrastContainer: {
    backgroundColor: THEME.accessibility.highContrast.background,
  },
  highContrastSection: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastRow: {
    borderBottomColor: THEME.accessibility.highContrast.secondary,
  },
  highContrastText: {
    color: THEME.accessibility.highContrast.text,
  },
  highContrastSubtitle: {
    color: THEME.accessibility.highContrast.secondary,
  },
  highContrastButton: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastInput: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderColor: THEME.accessibility.highContrast.primary,
    color: THEME.accessibility.highContrast.text,
  },
  highContrastModal: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
});

export default SettingsScreen;