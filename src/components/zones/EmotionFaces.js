// src/components/zones/EmotionFaces.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { THEME } from '../../styles/colors';

const EmotionFaces = ({ 
  onSelection, 
  accessibilityMode = false,
  title = "How do you feel now?",
  subtitle = "Let us know how the tools are working!"
}) => {
  
  const emotionOptions = [
    { 
      emoji: '😄', 
      label: 'Much better!', 
      value: 'much_better',
      description: 'I feel a lot better now'
    },
    { 
      emoji: '🙂', 
      label: 'A little better', 
      value: 'little_better',
      description: 'I feel somewhat better'
    },
    { 
      emoji: '😐', 
      label: 'About the same', 
      value: 'same',
      description: 'I feel about the same as before'
    },
    { 
      emoji: '😔', 
      label: 'Still struggling', 
      value: 'struggling',
      description: 'I\'m still having a hard time'
    }
  ];

  const handleSelection = (emotion) => {
    if (onSelection) {
      onSelection(emotion.value, emotion.label);
    }
  };

  return (
    <View style={[styles.container, accessibilityMode && styles.highContrastContainer]}>
      <Text style={[styles.title, accessibilityMode && styles.highContrastText]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, accessibilityMode && styles.highContrastSubtitle]}>
        {subtitle}
      </Text>
      
      <View style={styles.facesGrid}>
        {emotionOptions.map((emotion, index) => (
          <TouchableOpacity
            key={emotion.value}
            style={[
              styles.faceButton,
              accessibilityMode && styles.highContrastFaceButton
            ]}
            onPress={() => handleSelection(emotion)}
            accessibilityLabel={`${emotion.label}: ${emotion.description}`}
            accessibilityRole="button"
            accessibilityHint="Tap to report how you're feeling"
            activeOpacity={0.7}
          >
            <Text style={styles.faceEmoji}>{emotion.emoji}</Text>
            <Text style={[styles.faceLabel, accessibilityMode && styles.highContrastText]}>
              {emotion.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.encouragementContainer}>
        <Text style={[styles.encouragementText, accessibilityMode && styles.highContrastText]}>
          Remember: All feelings are okay. You're learning to navigate them! 🧭💚
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    marginBottom: 20,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: THEME.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 18,
  },
  facesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  faceButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
    backgroundColor: '#f8f9fa',
  },
  faceEmoji: {
    fontSize: 32, // Slightly smaller for mobile
    marginBottom: 6,
  },
  faceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 12,
  },
  encouragementContainer: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  encouragementText: {
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
  highContrastFaceButton: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastText: {
    color: THEME.accessibility.highContrast.text,
  },
  highContrastSubtitle: {
    color: THEME.accessibility.highContrast.secondary,
  },
});

export default EmotionFaces;