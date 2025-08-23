// src/screens/ZonesScreen.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ZoneCard from '../components/zones/ZoneCard';
import { THEME } from '../styles/colors';

const ZonesScreen = ({ 
  userData, 
  onZoneSelect, 
  accessibilityMode = false 
}) => {
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userData.userName || "friend";
    
    if (hour < 12) return `Good morning, ${name}! Let's check in with your compass`;
    if (hour < 17) return `Good afternoon, ${name}! How is your compass pointing?`;
    return `Good evening, ${name}! Let's see how you're navigating today`;
  };

  const zones = [
    { 
      key: 'blue', 
      title: 'Blue Zone', 
      description: userData.zoneDescriptions.blue 
    },
    { 
      key: 'green', 
      title: 'Green Zone', 
      description: userData.zoneDescriptions.green 
    },
    { 
      key: 'yellow', 
      title: 'Yellow Zone', 
      description: userData.zoneDescriptions.yellow 
    },
    { 
      key: 'red', 
      title: 'Red Zone', 
      description: userData.zoneDescriptions.red 
    }
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.questionContainer, accessibilityMode && styles.highContrastContainer]}>
        <Text style={[styles.question, accessibilityMode && styles.highContrastText]}>
          How is your body feeling right now?
        </Text>
        <Text style={[styles.questionSubtext, accessibilityMode && styles.highContrastSubtext]}>
          Choose the zone that matches your feelings
        </Text>
      </View>

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
          You've used your compass {userData.checkins.length} times!
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
    paddingBottom: 40, // Extra space for scrolling
  },
  questionContainer: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 15,
    marginTop: 15,
    marginBottom: 10,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  question: {
    fontSize: 20, // Adjusted for mobile
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  questionSubtext: {
    fontSize: 13,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 10,
  },
  progressContainer: {
    backgroundColor: THEME.primary.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30, // Ensures scroll clearance
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
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    fontSize: 24, // Slightly smaller for mobile
    marginHorizontal: 3,
  },
  progressText: {
    fontSize: 16,
    color: THEME.semantic.progress,
    textAlign: 'center',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: THEME.semantic.calm,
    textAlign: 'center',
    fontWeight: '600',
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
  highContrastSubtext: {
    color: THEME.accessibility.highContrast.secondary,
  },
});

export default ZonesScreen;