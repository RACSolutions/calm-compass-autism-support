// src/screens/HelpScreen.js - Fixed with functional tools and better layout
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
  userData,
  onToolUse,
  onSaveData,
  accessibilityMode = false,
  navigation
}) => {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [completedTools, setCompletedTools] = useState([]);

  const tools = getToolsForZone(selectedZone);

  const handleBackPress = () => {
    navigation?.goBack();
  };

  const handleToolPress = async (tool) => {
    // Record tool usage
    if (onToolUse) {
      await onToolUse(tool.title);
    }

    // Handle different tool types with enhanced functionality
    if (tool.hasTimer) {
      setSelectedTool(tool);
      setActiveModal('timer');
    } else if (tool.hasAudioOptions) {
      setSelectedTool(tool);
      setActiveModal('audio');
    } else if (tool.hasCustomOptions) {
      setSelectedTool(tool);
      setActiveModal('stimming');
    } else {
      // Handle regular tools with guidance
      handleRegularTool(tool);
    }
  };

  const handleRegularTool = (tool) => {
    let alertTitle, alertMessage, buttons;

    switch(tool.id) {
      case 'blue_comfort_item':
        alertTitle = '🧸 Comfort Item';
        alertMessage = 'Your comfort items are important tools for feeling safe and calm.\n\n• Find your favorite comfort object\n• Hold it close and feel its texture\n• Notice how it makes you feel safer\n• It\'s okay to need comfort items at any age\n\nYou deserve comfort and security! 💙';
        buttons = [{ text: 'I have my comfort item ✨', onPress: () => markToolCompleted(tool) }];
        break;

      default:
        // Generic tool guidance
        alertTitle = `${tool.icon} ${tool.title}`;
        alertMessage = `${tool.description}\n\nTake your time with this activity. You\'re learning to navigate your emotions! 🧭`;
        buttons = [{ text: 'Let\'s try it!', onPress: () => markToolCompleted(tool) }];
    }

    Alert.alert(alertTitle, alertMessage, buttons);
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

  const markToolCompleted = (tool) => {
    setCompletedTools(prev => [...prev, tool.id]);
    
    // Save completion data
    if (onSaveData) {
      onSaveData({
        toolId: tool.id,
        zone: selectedZone,
        timestamp: new Date().toISOString(),
        completed: true
      });
    }
  };

  const isToolCompleted = (toolId) => {
    return completedTools.includes(toolId);
  };

  const handleProgressUpdate = async (progressType, label) => {
    // Record progress data
    const progressData = {
      timestamp: new Date().toISOString(),
      initialZone: selectedZone,
      outcome: progressType,
      id: Date.now()
    };
    
    const updatedData = {
      ...userData,
      progress: [...(userData.progress || []), progressData]
    };
    
    if (onSaveData) {
      await onSaveData(updatedData);
    }

    // Provide encouraging feedback
    let message = `Thanks for letting us know: ${label}.\n\nYou\'re doing such a great job taking care of yourself and learning about your emotions. Keep up the wonderful work! 💚`;
    
    if (progressType === 'struggling') {
      message = 'It\'s completely okay that you\'re still struggling. Feelings can take time to change, and that\'s normal.\n\nYou\'re being so brave by checking in with yourself. Would you like to try another tool or talk to someone?';
    }
    
    Alert.alert('Thank you for sharing! 🌟', message);
  };

  const renderModal = () => {
    if (!activeModal || !selectedTool) return null;

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
      >
        <ModalComponent
          tool={selectedTool}
          onComplete={handleModalComplete}
          onCancel={handleModalCancel}
          userPreferences={userData?.stimmingPreferences || []}
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

  return (
    <View style={styles.container}>
      {/* Zone Header as Main Header */}
      <View style={[
        styles.zoneHeader, 
        { backgroundColor: ZONE_COLORS[selectedZone] },
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
                'Wonderful! You\'ve done great work taking care of yourself. 🌟'
              )}
            >
              <Text style={styles.commButtonIcon}>✨</Text>
              <Text style={styles.commButtonText}>Feeling better</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Check-in Section - FIXED LAYOUT */}
        <View style={styles.checkinSection}>
          <Text style={styles.checkinTitle}>How do you feel now?</Text>
          <Text style={styles.checkinSubtitle}>
            Let us know how the tools are working!
          </Text>
          
          {/* Emotion Faces */}
          <View style={styles.emotionFaces}>
            <TouchableOpacity 
              style={styles.emotionButton}
              onPress={() => handleProgressUpdate('much_better', 'Much better!')}
            >
              <Text style={styles.emotionEmoji}>😄</Text>
              <Text style={styles.emotionLabel}>Much better!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.emotionButton}
              onPress={() => handleProgressUpdate('little_better', 'A little better')}
            >
              <Text style={styles.emotionEmoji}>🙂</Text>
              <Text style={styles.emotionLabel}>A little better</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.emotionButton}
              onPress={() => handleProgressUpdate('same', 'About the same')}
            >
              <Text style={styles.emotionEmoji}>😐</Text>
              <Text style={styles.emotionLabel}>About the same</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.emotionButton}
              onPress={() => handleProgressUpdate('struggling', 'Still struggling')}
            >
              <Text style={styles.emotionEmoji}>😔</Text>
              <Text style={styles.emotionLabel}>Still struggling</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.reminderText}>
            Remember: All feelings are okay. You're learning to navigate them! 🧭💚
          </Text>
        </View>
      </ScrollView>

      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Account for bottom tab navigation
  },
  
  // Zone Header
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, // Account for status bar
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSpacer: {
    width: 40, // Same width as back button for centering
  },
  
  // No zone selected state
  noZoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noZoneEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  noZoneTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  noZoneSubtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Message
  messageContainer: {
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
  zoneMessage: {
    fontSize: 16,
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Progress
  progressContainer: {
    backgroundColor: THEME.semantic.progress,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  
  // Tools
  toolsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  toolsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Communication
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
    justifyContent: 'center',
    marginBottom: 8,
  },
  communicationIcon: {
    fontSize: 24,
    marginRight: 8,
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
  },
  communicationButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
  },
  commButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: '30%',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  commButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  commButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
  },
  
  // Check-in Section - FIXED
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
    marginBottom: 8,
  },
  checkinSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emotionFaces: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  emotionButton: {
    alignItems: 'center',
    padding: 8,
    minWidth: 80,
    marginBottom: 10,
  },
  emotionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emotionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 16,
  },
  reminderText: {
    fontSize: 13,
    color: THEME.semantic.calm,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  
  // High contrast styles
  highContrastContainer: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastText: {
    color: THEME.accessibility.highContrast.text,
  },
  highContrastDescription: {
    color: THEME.accessibility.highContrast.secondary,
  },
});

export default HelpScreen;