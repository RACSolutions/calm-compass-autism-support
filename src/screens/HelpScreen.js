// src/screens/HelpScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ToolButton from '../components/zones/ToolButton';
import EmotionFaces from '../components/zones/EmotionFaces';
import { THEME } from '../styles/colors';

const HelpScreen = ({ 
  selectedZone,
  tools = [],
  userData,
  onToolUse,
  onSaveData,
  accessibilityMode = false 
}) => {

  const handleToolPress = async (tool) => {
    // Record tool usage
    if (onToolUse) {
      await onToolUse(tool.title);
    }

    // Provide specific guidance based on tool type
    if (tool.title.includes('Breathing')) {
      Alert.alert(
        '🫁 Breathing Exercise', 
        'Let\'s breathe together to help your body feel calmer:\n\n1. Breathe in slowly for 4 counts\n2. Hold gently for 4 counts\n3. Breathe out slowly for 4 counts\n4. Repeat as many times as feels good\n\nYou\'re doing great! 💚',
        [{ text: 'Start Breathing', style: 'default' }]
      );
    } else if (tool.title.includes('STOP')) {
      Alert.alert(
        '🛑 STOP Technique',
        'Let\'s use the STOP method to help you feel in control:\n\nS - Stop what you\'re doing right now\nT - Take a slow, deep breath\nO - Observe how your body feels\nP - Proceed with a choice that helps you\n\nYou\'ve got this! 🌟',
        [{ text: 'I\'m ready', style: 'default' }]
      );
    } else if (tool.title.includes('Movement')) {
      Alert.alert(
        '🏃 Movement Break',
        'Moving your body can help regulate your emotions:\n\n• Find a safe space to move\n• Try jumping, pacing, or rocking\n• Listen to your body\n• Stop when you feel ready\n\nMovement is medicine for your nervous system! 💪',
        [{ text: 'Let\'s move!', style: 'default' }]
      );
    } else if (tool.title.includes('Support')) {
      Alert.alert(
        '🗣️ Getting Support',
        'It\'s brave to ask for help! You can:\n\n• Tell someone "I need help"\n• Show them this app\n• Write down how you feel\n• Point to what you need\n\nAsking for help shows strength! 💚',
        [{ text: 'I understand', style: 'default' }]
      );
    } else {
      Alert.alert(
        'Great Choice! 🌟', 
        `${tool.title} is a wonderful tool for the ${selectedZone} zone.\n\n${tool.description}\n\nTake your time with this activity. You\'re learning to navigate your emotions! 🧭`,
        [{ text: 'Let\'s try it!', style: 'default' }]
      );
    }
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
    if (progressType === 'struggling') {
      Alert.alert(
        'You\'re doing amazing! 💚', 
        'It\'s completely okay that you\'re still struggling. Feelings can take time to change, and that\'s normal.\n\nYou\'re being so brave by checking in with yourself. Would you like to try another tool or talk to someone?',
        [
          { text: 'Try more tools', onPress: () => {}, style: 'default' },
          { text: 'I\'m okay for now', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        'Thank you for sharing! 🌟', 
        `Thanks for letting us know: ${label}.\n\nYou\'re doing such a great job taking care of yourself and learning about your emotions. Keep up the wonderful work! 🧭💚`,
        [{ text: 'Keep going!', style: 'default' }]
      );
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.toolsSection}>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          🛠️ Your Compass Tools
        </Text>
        <Text style={[styles.sectionDescription, accessibilityMode && styles.highContrastDescription]}>
          These tools are specially chosen to help you feel better in the {selectedZone} zone
        </Text>
        
        {tools.map((tool, index) => (
          <ToolButton 
            key={`${tool.title}-${index}`}
            tool={tool}
            onPress={handleToolPress}
            accessibilityMode={accessibilityMode}
            size="normal"
          />
        ))}
      </View>

      <View style={[styles.communicationSection, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.sectionTitle, accessibilityMode && styles.highContrastText]}>
          💬 Need Help with Words?
        </Text>
        <Text style={[styles.sectionDescription, accessibilityMode && styles.highContrastDescription]}>
          Sometimes it's hard to find words. These communication tools can help:
        </Text>
        
        <View style={styles.communicationGrid}>
          {[
            { emoji: '⏸️', title: 'I need a break', script: 'I need to take a break right now, please.' },
            { emoji: '🔇', title: 'Too much noise', script: 'This is too loud/busy for me right now.' },
            { emoji: '😵‍💫', title: 'I feel overwhelmed', script: 'I\'m feeling overwhelmed by everything.' },
            { emoji: '🆘', title: 'I need help', script: 'I need some help right now, please.' }
          ].map((comm, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.communicationCard, accessibilityMode && styles.highContrastCard]}
              onPress={() => Alert.alert(
                `${comm.emoji} ${comm.title}`,
                `You can say or show:\n\n"${comm.script}"\n\nIt\'s okay to communicate in whatever way feels right for you.`
              )}
              accessibilityLabel={`Communication help: ${comm.title}`}
              accessibilityRole="button"
            >
              <Text style={styles.commEmoji}>{comm.emoji}</Text>
              <Text style={[styles.commText, accessibilityMode && styles.highContrastText]}>
                {comm.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <EmotionFaces 
        onSelection={handleProgressUpdate}
        accessibilityMode={accessibilityMode}
      />
    </ScrollView>
  );
};

// Get relevant communication options based on current zone
const getRelevantCommunicationOptions = (zone) => {
  const baseOptions = [
    { emoji: '🆘', title: 'I need help', script: 'I need some help right now, please.' },
    { emoji: '✨', title: 'I feel better', script: 'I\'m starting to feel better now.' }
  ];
  
  if (zone === 'red' || zone === 'yellow') {
    return [
      { emoji: '⏸️', title: 'I need a break', script: 'I need to take a break right now, please.' },
      { emoji: '🔇', title: 'Too much noise', script: 'This is too loud/busy for me right now.' },
      { emoji: '😵‍💫', title: 'I feel overwhelmed', script: 'I\'m feeling overwhelmed by everything.' },
      ...baseOptions
    ];
  }
  
  if (zone === 'blue') {
    return [
      { emoji: '🏠', title: 'I need space', script: 'I need some quiet space right now.' },
      { emoji: '🤐', title: 'Hard to talk', script: 'It\'s hard for me to use words right now.' },
      ...baseOptions
    ];
  }
  
  return [
    { emoji: '🎯', title: 'I\'m focused', script: 'I\'m feeling focused and ready.' },
    ...baseOptions
  ];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  toolsSection: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 18,
  },
  communicationSection: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    marginBottom: 15,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  communicationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  communicationCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  commEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  commText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 14,
  },
  // High contrast styles
  highContrastContainer: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastCard: {
    backgroundColor: THEME.accessibility.highContrast.background,
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