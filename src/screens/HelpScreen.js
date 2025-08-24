// src/screens/HelpScreen.js - Fixed with proper timer modal and zone header
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
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

  // Debug logging
  console.log('📊 STATE UPDATE - activeModal:', activeModal, 'selectedTool:', selectedTool?.title || 'none');

  const tools = getToolsForZone(selectedZone);

  // Helper Functions
  const markToolCompleted = (tool) => {
    setCompletedTools(prev => [...prev, tool.id]);
    
    // Save completion data with error handling - delayed to not interfere with modals
    setTimeout(() => {
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
    }, 1000); // Delay to prevent modal interference
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

      case 'blue_hydration':
        alertTitle = '💧 Drink Water';
        alertMessage = 'Staying hydrated helps your body and brain feel better.\n\n• Get a glass of cool water\n• Drink slowly and mindfully\n• Notice how refreshing it feels\n• Your body needs and deserves care\n\nEvery sip is self-care! 💙';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'I\'ve had some water ✨', onPress: () => markToolCompleted(tool) }
        ];
        break;

      default:
        alertTitle = tool.icon + ' ' + tool.title;
        alertMessage = tool.description + '\n\nTake your time with this tool. You\'re doing great! 💙';
        buttons = [
          { text: 'Cancel', style: 'cancel' },
          { text: 'I tried this tool ✨', onPress: () => markToolCompleted(tool) }
        ];
        break;
    }

    Alert.alert(alertTitle, alertMessage, buttons);
  };

  // FIXED: Main tool press handler - prevent state conflicts
  const handleToolPress = (tool) => {
    console.log('=== TOOL PRESS 1 ===');
    console.log('Tool:', tool.title, 'hasTimer:', tool.hasTimer);
    console.log('Before state - activeModal:', activeModal, 'selectedTool:', selectedTool?.title);

    // Record tool usage in background without waiting
    if (onToolUse && typeof onToolUse === 'function') {
      onToolUse(tool);
    }

    // FIXED: Set modal state immediately without any async delays
    if (tool.hasTimer) {
      console.log('🎯 TRIGGERING TIMER modal immediately...');
      setSelectedTool(tool);
      setActiveModal('timer');
    } else if (tool.hasAudioOptions) {
      console.log('🎯 TRIGGERING AUDIO modal immediately...');
      setSelectedTool(tool);
      setActiveModal('audio');
    } else if (tool.hasStimmingOptions) {
      console.log('🎯 TRIGGERING STIMMING modal immediately...');
      setSelectedTool(tool);
      setActiveModal('stimming');
    } else {
      console.log('🎯 Using SIMPLE tool handling for:', tool.title);
      handleRegularTool(tool);
    }
  };

  // FIXED: Modal completion handler
  const handleModalComplete = (result) => {
    console.log('Modal completed with result:', result);
    
    if (selectedTool) {
      markToolCompleted(selectedTool);
      
      let message = 'You used the ' + selectedTool.title + ' tool! ';
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
    
    // Clear modal state
    setActiveModal(null);
    setSelectedTool(null);
  };

  const handleModalCancel = () => {
    console.log('Modal cancelled');
    setActiveModal(null);
    setSelectedTool(null);
  };

  // FIXED: Modal rendering with better state checks
  const renderModal = () => {
    console.log('🔍 renderModal - activeModal:', activeModal, 'selectedTool:', selectedTool?.title || 'null');
    
    if (!activeModal || !selectedTool) {
      return null;
    }

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
        console.warn('Unknown modal type:', activeModal);
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
      <SafeAreaView style={styles.container}>
        <View style={[styles.noZoneContainer, accessibilityMode && styles.highContrastContainer]}>
          <Text style={styles.noZoneEmoji}>🧭</Text>
          <Text style={[styles.noZoneTitle, accessibilityMode && styles.highContrastText]}>
            Choose Your Zone First
          </Text>
          <Text style={[styles.noZoneSubtitle, accessibilityMode && styles.highContrastDescription]}>
            Go to the Zones tab and tap on how you're feeling to get personalized tools and support!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get zone info
  const zoneColor = ZONE_COLORS[selectedZone];
  const zoneTitle = selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1) + ' Zone';

  return (
    <View style={styles.container}>
      {/* FIXED: Zone Header - full screen including status bar */}
      <SafeAreaView style={[styles.zoneHeader, { backgroundColor: zoneColor }]}>
        <View style={styles.zoneHeaderContent}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.navigate('Zones')}
            accessibilityRole="button"
            accessibilityLabel="Go back to zones"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Zone Title - replaces logo when in a zone */}
          <Text style={styles.zoneHeaderTitle}>
            {zoneTitle}
          </Text>
        </View>
      </SafeAreaView>

      {/* Tools List */}
      <ScrollView 
        style={styles.toolsList}
        contentContainerStyle={styles.toolsListContent}
        showsVerticalScrollIndicator={false}
      >
        {tools.map(tool => (
          <ToolButton
            key={tool.id}
            tool={tool}
            onPress={() => handleToolPress(tool)}
            completed={isToolCompleted(tool.id)}
            accessibilityMode={accessibilityMode}
          />
        ))}

        {/* Communication Support Section */}
        <View style={[styles.commSection, accessibilityMode && styles.highContrastContainer]}>
          <Text style={[styles.commTitle, accessibilityMode && styles.highContrastText]}>
            Need Help Talking?
          </Text>
          <Text style={[styles.commSubtitle, accessibilityMode && styles.highContrastDescription]}>
            Sometimes it's hard to find the right words
          </Text>

          <TouchableOpacity 
            style={styles.commButton}
            onPress={() => showCommunicationHelp(selectedZone)}
          >
            <Text style={styles.commButtonIcon}>💬</Text>
            <Text style={styles.commButtonText}>Communication Cards</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Check-in Section */}
        <View style={[styles.checkinSection, accessibilityMode && styles.highContrastContainer]}>
          <Text style={[styles.checkinTitle, accessibilityMode && styles.highContrastText]}>
            How was your tool time?
          </Text>
          
          <View style={styles.checkinButtons}>
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => recordDailyCheckin('good')}
            >
              <Text style={styles.progressButtonText}>😊 Really helpful!</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => recordDailyCheckin('okay')}
            >
              <Text style={styles.progressButtonText}>😐 It was okay</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.progressButton}
              onPress={() => recordDailyCheckin('not_helpful')}
            >
              <Text style={styles.progressButtonText}>😔 Didn't help much</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Render modals */}
      {renderModal()}
    </View>
  );
};

// Helper functions
const getZoneMessage = (zone) => {
  const messages = {
    blue: 'Take time to rest and recharge your energy. 💙',
    green: 'You\'re feeling great! Keep up the good energy! 💚',
    yellow: 'Let\'s work on feeling more calm and focused. 💛',
    red: 'Take some deep breaths. We\'ll help you feel safer. ❤️'
  };
  return messages[zone] || 'You\'re doing great! 🌟';
};

const showCommunicationHelp = (zone) => {
  const scripts = {
    blue: [
      "I need some quiet time please",
      "I'm feeling tired and need to rest",
      "Can I have my comfort item?",
      "I need a break from talking right now"
    ],
    green: [
      "I'm feeling good and ready to learn!",
      "I'm happy and want to share something",
      "I feel calm and focused right now",
      "I'm ready to try something new"
    ],
    yellow: [
      "I'm feeling a bit worried",
      "I need help staying focused",
      "Things feel overwhelming right now",
      "I'm having trouble with this"
    ],
    red: [
      "I need help feeling safe",
      "I'm feeling very upset right now",
      "I need someone to stay with me",
      "This is too much for me right now"
    ]
  };

  const zoneScripts = scripts[zone] || scripts.blue;
  const scriptText = zoneScripts.map((script, index) => `${index + 1}. "${script}"`).join('\n\n');

  Alert.alert(
    '💬 Communication Help',
    `Here are some phrases you can use:\n\n${scriptText}\n\nIt's okay to ask for help! You deserve support and understanding.`,
    [{ text: 'Thank you! 💙', style: 'default' }]
  );
};

const recordDailyCheckin = (feeling) => {
  const messages = {
    good: 'Thank you for sharing! It makes us happy to know the tools are helping you feel better! 🌟',
    okay: 'Thank you for trying! Sometimes tools help in small ways, and that\'s okay too. Every little bit counts! 💙',
    not_helpful: 'Thank you for being honest! Not every tool works for everyone. We appreciate you trying, and you can always come back when you\'re ready. 🌈'
  };

  Alert.alert(
    'Thank You! ✨',
    messages[feeling],
    [{ text: 'You\'re welcome! 😊', style: 'default' }]
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // FIXED: Zone Header (extends to top of screen)
  zoneHeader: {
    paddingTop: 0, // Remove padding - SafeAreaView handles it
    paddingBottom: 15, // Reduced padding since we removed the message
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  zoneHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20, // Small padding inside SafeAreaView
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneHeaderTitle: {
    fontSize: 28,
    fontWeight: '700',
    paddingBottom: 20,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  
  // Tools list styles
  toolsList: {
    flex: 1,
  },
  toolsListContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Communication section
  commSection: {
    backgroundColor: 'white',
    marginHorizontal: 0,
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  commTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  commSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  commButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginHorizontal: 0,
    marginTop: 20,
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