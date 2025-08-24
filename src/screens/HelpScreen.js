// src/screens/HelpScreen.js - Fixed with proper timer modal handling
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ToolButton from '../components/zones/ToolButton';
import { 
  TimerComponent, 
  AudioPlayerComponent, 
  StimmingOptionsComponent 
} from '../components/BlueZoneComponents';
import { THEME, ZONE_COLORS } from '../styles/colors';
import { getToolsForZone } from '../data/tools';

const HelpScreen = ({ 
  selectedZone = 'blue',
  userData = {},
  onToolUse,
  onSaveData,
  accessibilityMode = false,
  navigation
}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [completedTools, setCompletedTools] = useState([]);

  const tools = getToolsForZone(selectedZone);

  // Helper Functions
  const handleBackPress = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const markToolCompleted = (tool) => {
    setCompletedTools(prev => [...prev, tool.id]);
    
    // Save completion data with error handling
    try {
      if (onSaveData && typeof onSaveData === 'function') {
        onSaveData({
          toolId: tool.id,
          zone: selectedZone,
          timestamp: new Date().toISOString(),
          completed: true
        });
      }
    } catch (error) {
      console.error('Error saving tool completion:', error);
    }
  };

  const isToolCompleted = (toolId) => {
    return completedTools.includes(toolId);
  };

  const handleRegularTool = (tool) => {
    let alertTitle, alertMessage, buttons;

    switch(tool.id) {
      case 'blue_comfort_item':
        alertTitle = '🧸 Comfort Item';
        alertMessage = 'Your comfort items are important tools for feeling safe and calm.\n\n• Find your favorite comfort object\n• Hold it close and feel its texture\n• Notice how it makes you feel safer\n• It\'s okay to need comfort items at any age\n\nYou deserve comfort and security! 💙';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'I have my comfort item ✨', onPress: () => markToolCompleted(tool) }
        ];
        break;

      case 'blue_deep_pressure':
        alertTitle = '🤗 Weighted Blanket Hug';
        alertMessage = 'Use deep pressure to feel calm and secure.\n\n• Get your weighted blanket or heavy pillow\n• Wrap it around yourself snugly\n• Feel the gentle, even pressure\n• Breathe slowly and deeply\n• Stay as long as it feels good\n\nDeep pressure can be so comforting! 💙';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Using deep pressure ✨', onPress: () => markToolCompleted(tool) }
        ];
        break;

      case 'blue_soft_music':
        alertTitle = '🎵 Gentle Music';
        alertMessage = 'Listen to soft, calming sounds or music.\n\n• Choose your favorite calm music\n• Use comfortable headphones if needed\n• Close your eyes and listen\n• Let the music wash over you\n• Focus only on the sounds\n\nMusic can be so healing! 💙';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Music is playing ✨', onPress: () => markToolCompleted(tool) }
        ];
        break;

      case 'blue_gentle_stim':
        alertTitle = '🌸 Soft Stimming';
        alertMessage = 'Use gentle self-soothing movements.\n\n• Rock gently back and forth\n• Play with a soft fidget toy\n• Gentle hand movements\n• Whatever feels soothing to you\n• Go at your own pace\n\nStimming is a wonderful way to self-regulate! 💙';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Stimming feels good ✨', onPress: () => markToolCompleted(tool) }
        ];
        break;

      default:
        alertTitle = `${tool.icon} ${tool.title}`;
        alertMessage = `${tool.description}\n\nTake your time with this activity. You're learning to navigate your emotions! 🧭`;
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Let\'s try it! ✨', onPress: () => markToolCompleted(tool) }
        ];
    }

    Alert.alert(alertTitle, alertMessage, buttons);
  };

  const handleToolPress = async (tool) => {
    console.log('Tool pressed:', tool.title, 'hasTimer:', tool.hasTimer);
    
    try {
      // Record tool usage
      if (onToolUse && typeof onToolUse === 'function') {
        await onToolUse(tool.title);
      }
    } catch (error) {
      console.error('Error recording tool usage:', error);
    }

    // Handle different tool types - FIXED LOGIC
    if (tool.hasTimer === true) {
      console.log('Opening timer modal for:', tool.title);
      setSelectedTool(tool);
      setActiveModal('timer');
    } else if (tool.hasAudioOptions === true) {
      console.log('Opening audio modal for:', tool.title);
      setSelectedTool(tool);
      setActiveModal('audio');
    } else if (tool.hasCustomOptions === true) {
      console.log('Opening stimming modal for:', tool.title);
      setSelectedTool(tool);
      setActiveModal('stimming');
    } else {
      // Handle regular tools with guidance
      console.log('Using regular tool handling for:', tool.title);
      handleRegularTool(tool);
    }
  };

  const handleModalComplete = (result) => {
    if (selectedTool) {
      markToolCompleted(selectedTool);
      
      // Show completion message based on result
      let message = 'Great job using that tool! ';
      switch(result) {
        case 'better':
          message += 'It sounds like it really helped you feel better! 😊';
          break;
        case 'same': 
          message += 'That\'s okay - sometimes tools help in small ways. Every bit counts! 🌟';
          break;
        case 'completed':
          message += 'You took wonderful care of yourself! 💙';
          break;
        default:
          message += 'Thank you for trying! 🌟';
      }
      
      Alert.alert('Well Done! ✨', message);
    }
    
    setActiveModal(null);
    setSelectedTool(null);
  };

  const handleModalCancel = () => {
    setActiveModal(null);
    setSelectedTool(null);
  };

  const renderModal = () => {
    if (!activeModal || !selectedTool) {
      console.log('Not rendering modal - activeModal:', activeModal, 'selectedTool:', selectedTool);
      return null;
    }

    console.log('Rendering modal:', activeModal, 'for tool:', selectedTool.title);

    let ModalComponent;
    switch(activeModal) {
      case 'timer':
        ModalComponent = TimerComponent;
        break;
      case 'audio':
        ModalComponent = AudioPlayerComponent;
        break;
      case 'stimming':
        ModalComponent = StimmingOptionsComponent;
        break;
      default:
        return null;
    }

    return (
      <Modal
        visible={true}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleModalCancel}
      >
        <ModalComponent
          tool={selectedTool}
          onComplete={handleModalComplete}
          onCancel={handleModalCancel}
          userPreferences={(userData && userData.stimmingPreferences) ? userData.stimmingPreferences : []}
        />
      </Modal>
    );
  };

  // Show default message if no zone selected
  if (!selectedZone) {
    return (
      <View style={styles.container}>
        <View style={[styles.noZoneContainer, accessibilityMode && styles.highContrastContainer]}>
          <Text style={styles.noZoneEmoji}>🧭</Text>
          <Text style={[styles.noZoneTitle, accessibilityMode && styles.highContrastText]}>
            Choose Your Zone First
          </Text>
          <Text style={[styles.noZoneSubtitle, accessibilityMode && styles.highContrastDescription]}>
            Go to the Zones tab and tap on how you're feeling to get personalized tools and support!
          </Text>
        </View>
      </View>
    );
  }

  // If no tools available, show message
  if (!tools || tools.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.noZoneContainer, accessibilityMode && styles.highContrastContainer]}>
          <Text style={styles.noZoneEmoji}>🔧</Text>
          <Text style={[styles.noZoneTitle, accessibilityMode && styles.highContrastText]}>
            Tools Loading...
          </Text>
          <Text style={[styles.noZoneSubtitle, accessibilityMode && styles.highContrastDescription]}>
            We're getting your {selectedZone} zone tools ready!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Zone Header as Main Header */}
      <View style={[
        styles.zoneHeader, 
        { backgroundColor: ZONE_COLORS[selectedZone] || THEME.zones.blue },
        accessibilityMode && styles.highContrastContainer
      ]}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
          accessibilityRole="button"
          accessibilityLabel="Go back to zones"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {/* Zone Title */}
        <Text style={[styles.zoneHeaderTitle, accessibilityMode && styles.highContrastText]}>
          {selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)} Zone
        </Text>
        
        {/* Empty view for centering */}
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Zone Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.zoneMessage}>
            {selectedZone === 'blue' && "You're in the Blue Zone. Take time to rest and recharge your energy. 💙"}
            {selectedZone === 'green' && "You're in the Green Zone. Great time to learn and be creative! 💚"}
            {selectedZone === 'yellow' && "You're in the Yellow Zone. Let's use some tools to help you feel more balanced. 💛"}
            {selectedZone === 'red' && "You're in the Red Zone. Let's find safe ways to handle these big feelings. ❤️"}
          </Text>
        </View>

        {/* Progress Indicator */}
        {completedTools.length > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              🌟 {completedTools.length} tool{completedTools.length !== 1 ? 's' : ''} used today!
            </Text>
          </View>
        )}

        {/* Tools List */}
        <View style={styles.toolsContainer}>
          <Text style={styles.toolsHeader}>Choose a tool that feels right:</Text>
          
          {tools.map((tool, index) => (
            <ToolButton
              key={tool.id || `${tool.title}-${index}`}
              tool={tool}
              onPress={handleToolPress}
              accessibilityMode={accessibilityMode}
              isCompleted={isToolCompleted(tool.id)}
              showStatus={true}
            />
          ))}
        </View>

        {/* Help with Words Section */}
        <View style={styles.communicationSection}>
          <View style={styles.communicationHeader}>
            <Text style={styles.communicationIcon}>💬</Text>
            <Text style={styles.communicationTitle}>Need Help with Words?</Text>
          </View>
          <Text style={styles.communicationSubtitle}>
            Sometimes it's hard to say how we feel. That's okay!
          </Text>
          
          <View style={styles.communicationButtons}>
            <TouchableOpacity 
              style={styles.commButton}
              onPress={() => Alert.alert(
                '🆘 I need help', 
                'You can show this to someone you trust, or point to what you need. Asking for help is brave! 💪'
              )}
            >
              <Text style={styles.commButtonIcon}>🆘</Text>
              <Text style={styles.commButtonText}>I need help</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.commButton}
              onPress={() => Alert.alert(
                '🏠 I need space', 
                'It\'s okay to need quiet time or space. You can show this to let someone know. 🌟'
              )}
            >
              <Text style={styles.commButtonIcon}>🏠</Text>
              <Text style={styles.commButtonText}>I need space</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.commButton}
              onPress={() => Alert.alert(
                '✨ Feeling better', 
                'Wonderful! You\'ve done great work taking care of yourself. 💙'
              )}
            >
              <Text style={styles.commButtonIcon}>✨</Text>
              <Text style={styles.commButtonText}>Feeling better</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Check-in Section */}
        <View style={styles.checkinSection}>
          <Text style={styles.checkinTitle}>How are you doing now? 🌟</Text>
          <View style={styles.checkinButtons}>
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => handleProgressUpdate('better', 'Much better!')}
            >
              <Text style={styles.progressButtonText}>Much Better! 😊</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => handleProgressUpdate('some_better', 'A little better')}
            >
              <Text style={styles.progressButtonText}>A Little Better 🙂</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => handleProgressUpdate('same', 'About the same')}
            >
              <Text style={styles.progressButtonText}>About the Same 😐</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => handleProgressUpdate('struggling', 'Still struggling')}
            >
              <Text style={styles.progressButtonText}>Still Struggling 😔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Render Modal */}
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  
  // Zone Header
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  zoneHeaderTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginLeft: -40, // Offset back button for centering
  },
  headerSpacer: {
    width: 40,
  },
  
  // Content
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  messageContainer: {
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  zoneMessage: {
    fontSize: 16,
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Progress
  progressContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    margin: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.semantic.progress,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.semantic.progress,
    textAlign: 'center',
  },
  
  // Tools
  toolsContainer: {
    paddingHorizontal: 20,
  },
  toolsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  
  // Communication Section
  communicationSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  communicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  communicationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  communicationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  communicationSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  communicationButtons: {
    gap: 12,
  },
  commButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commButtonIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  commButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.text.primary,
  },
  
  // Check-in Section
  checkinSection: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  checkinTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  checkinButtons: {
    gap: 12,
  },
  progressButton: {
    backgroundColor: THEME.primary.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  progressButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.text.primary,
    textAlign: 'center',
  },
  
  // No Zone States
  noZoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noZoneEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  noZoneTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  noZoneSubtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  
  // High Contrast Support
  highContrastContainer: {
    backgroundColor: THEME.accessibility.highContrast.background,
  },
  highContrastText: {
    color: THEME.accessibility.highContrast.text,
  },
  highContrastDescription: {
    color: THEME.accessibility.highContrast.secondary,
  },
});

export default HelpScreen;