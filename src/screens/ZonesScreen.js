// src/screens/ZonesScreen.js - Kid-friendly version with logo and simplified text
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import ZoneCard from '../components/zones/ZoneCard';
import { THEME } from '../styles/colors';

const ZonesScreen = ({ 
  userData, 
  onZoneSelect, 
  accessibilityMode = false 
}) => {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userData?.userName || userData?.preferredName || "friend";
    
    if (hour < 12) return `Good morning, ${name}! 🌅`;
    if (hour < 17) return `Good afternoon, ${name}! ☀️`;
    return `Good evening, ${name}! 🌙`;
  };

  const zones = [
    { 
      key: 'blue', 
      title: 'Blue Zone', 
      description: userData?.zoneDescriptions?.blue || "Feeling sad, tired, or need quiet time"
    },
    { 
      key: 'green', 
      title: 'Green Zone', 
      description: userData?.zoneDescriptions?.green || "Feeling happy, calm, and ready to learn"
    },
    { 
      key: 'yellow', 
      title: 'Yellow Zone', 
      description: userData?.zoneDescriptions?.yellow || "Feeling worried, frustrated, or wiggly"
    },
    { 
      key: 'red', 
      title: 'Red Zone', 
      description: userData?.zoneDescriptions?.red || "Feeling angry, scared, or overwhelmed"
    }
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Optional greeting can be added here if needed */}

      {/* Simplified Question */}
      <View style={[styles.questionContainer, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.question, accessibilityMode && styles.highContrastText]}>
          How do you feel right now?
        </Text>
      </View>

      {/* Zone Cards */}
      <View style={styles.zonesGrid}>
        {zones.map(zone => (
          <ZoneCard
            key={zone.key}
            zone={zone.key}
            title={zone.title}
            description={zone.description}
            onPress={onZoneSelect}
            accessibilityMode={accessibilityMode}
          />
        ))}
      </View>

      {/* Progress Section */}
      <View style={[styles.progressContainer, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.progressTitle, accessibilityMode && styles.highContrastText]}>
          Great job checking in! 🌟
        </Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.star}>⭐</Text>
          ))}
        </View>
        <Text style={[styles.progressText, accessibilityMode && styles.highContrastText]}>
          You've used your compass {userData?.checkins?.length || 0} times!
        </Text>
        <Text style={[styles.encouragementText, accessibilityMode && styles.highContrastText]}>
          Every check-in helps you understand yourself better! 💚
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  // Removed header container styles since logo is now in navigation header
  questionContainer: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 30, // Increased from 15 to add more space from header
    marginBottom: 15,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
  },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 15,
  },
  progressContainer: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 24,
    marginHorizontal: 3,
  },
  progressText: {
    fontSize: 16,
    color: THEME.semantic.progress,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  encouragementText: {
    fontSize: 14,
    color: THEME.semantic.calm,
    textAlign: 'center',
    fontWeight: '500',
  },
  // High contrast mode styles
  highContrastContainer: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  highContrastText: {
    color: THEME.accessibility.highContrast.text,
  },
});

export default ZonesScreen;