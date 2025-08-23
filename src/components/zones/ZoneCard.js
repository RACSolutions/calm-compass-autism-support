// src/components/zones/ZoneCard.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { ZONE_COLORS, ZONE_EMOJIS, TEXT_COLORS } from '../../styles/colors';

const { width } = Dimensions.get('window');

const ZoneCard = ({ 
  zone, 
  title, 
  description, 
  onPress, 
  isSelected = false,
  accessibilityMode = false 
}) => {
  const backgroundColor = ZONE_COLORS[zone];
  const emoji = ZONE_EMOJIS[zone];

  return (
    <TouchableOpacity
      style={[
        styles.zoneCard,
        { backgroundColor },
        isSelected && styles.selectedCard,
        accessibilityMode && styles.highContrastCard
      ]}
      onPress={() => onPress(zone)}
      accessibilityLabel={`${zone} zone: ${description}`}
      accessibilityRole="button"
      accessibilityHint="Tap to get help and tools for this emotional zone"
      accessibilityState={{ selected: isSelected }}
      activeOpacity={0.8}
    >
      <Text style={styles.zoneEmoji}>{emoji}</Text>
      <Text style={[styles.zoneTitle, accessibilityMode && styles.highContrastText]}>
        {title}
      </Text>
      <Text style={[styles.zoneDescription, accessibilityMode && styles.highContrastDescription]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  zoneCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
    elevation: 6,
    // Gentler opacity for autism-friendly design
    opacity: 0.95,
  },
  selectedCard: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.02 }],
    opacity: 1,
    shadowOpacity: 0.2,
  },
  highContrastCard: {
    borderWidth: 2,
    borderColor: '#000000',
    opacity: 1,
  },
  zoneEmoji: {
    fontSize: 42, // Slightly smaller for mobile
    marginBottom: 8,
  },
  zoneTitle: {
    fontSize: 16, // Reduced for mobile
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    textAlign: 'center',
    // Add text shadow for better readability on soft colors
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  zoneDescription: {
    fontSize: 12, // Reduced for mobile
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 16,
    // Add subtle text shadow
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  highContrastText: {
    color: '#000000',
    textShadowColor: '#FFFFFF',
  },
  highContrastDescription: {
    color: '#000000',
    opacity: 1,
    textShadowColor: '#FFFFFF',
  },
});

export default ZoneCard;