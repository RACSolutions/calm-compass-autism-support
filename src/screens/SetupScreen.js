// src/screens/SetupScreen.js - First-time user setup
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { THEME } from '../styles/colors';

const { width, height } = Dimensions.get('window');

const SetupScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    userName: '',
    preferredName: '',
    age: '',
    useAccessibility: false,
    customZoneDescriptions: {
      blue: '',
      green: '',
      yellow: '',
      red: ''
    }
  });

  const steps = [
    {
      title: "Welcome to Calm Compass! 🧭",
      subtitle: "Let's set up your emotional navigation system",
      component: WelcomeStep
    },
    {
      title: "Tell us about you 👋",
      subtitle: "Help us personalize your experience",
      component: ProfileStep
    },
    {
      title: "Customize your zones 🎨",
      subtitle: "Make the zones feel right for you",
      component: ZonesStep
    },
    {
      title: "Accessibility options ♿",
      subtitle: "Set up features that help you best",
      component: AccessibilityStep
    },
    {
      title: "You're all set! 🌟",
      subtitle: "Ready to start your emotional journey",
      component: CompleteStep
    }
  ];

  function WelcomeStep() {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.welcomeEmoji}>🧭</Text>
        <Text style={styles.welcomeTitle}>Calm Compass</Text>
        <Text style={styles.welcomeSubtitle}>
          Your personal guide for navigating emotions
        </Text>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>💙</Text>
            <Text style={styles.featureText}>
              Understand your feelings with colorful zones
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🛠️</Text>
            <Text style={styles.featureText}>
              Learn coping tools that work for you
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>
              Track your progress and celebrate growth
            </Text>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>♿</Text>
            <Text style={styles.featureText}>
              Designed to be accessible for everyone
            </Text>
          </View>
        </View>

        <Text style={styles.setupNote}>
          This setup takes about 2 minutes and helps us create the best experience for you.
        </Text>
      </View>
    );
  }

  function ProfileStep() {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>What should we call you?</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your name</Text>
          <TextInput
            style={styles.textInput}
            value={userData.userName}
            onChangeText={(text) => setUserData(prev => ({ ...prev, userName: text }))}
            placeholder="Enter your name"
            placeholderTextColor={THEME.text.light}
            autoFocus={true}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Preferred name (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={userData.preferredName}
            onChangeText={(text) => setUserData(prev => ({ ...prev, preferredName: text }))}
            placeholder="Nickname or what you'd like to be called"
            placeholderTextColor={THEME.text.light}
          />
          <Text style={styles.inputHelp}>
            This is what the app will call you in messages and encouragements
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age (optional)</Text>
          <TextInput
            style={styles.textInput}
            value={userData.age}
            onChangeText={(text) => setUserData(prev => ({ ...prev, age: text }))}
            placeholder="Your age"
            placeholderTextColor={THEME.text.light}
            keyboardType="numeric"
            maxLength={3}
          />
          <Text style={styles.inputHelp}>
            Helps us provide age-appropriate content and tools
          </Text>
        </View>
      </View>
    );
  }

  function ZonesStep() {
    const zones = [
      { 
        key: 'blue', 
        name: 'Blue Zone', 
        emoji: '😴', 
        defaultDescription: 'Feeling sad, tired, or need quiet time',
        color: THEME.zones.blue
      },
      { 
        key: 'green', 
        name: 'Green Zone', 
        emoji: '😊', 
        defaultDescription: 'Feeling happy, calm, and ready to learn',
        color: THEME.zones.green
      },
      { 
        key: 'yellow', 
        name: 'Yellow Zone', 
        emoji: '😤', 
        defaultDescription: 'Feeling worried, frustrated, or wiggly',
        color: THEME.zones.yellow
      },
      { 
        key: 'red', 
        name: 'Red Zone', 
        emoji: '😡', 
        defaultDescription: 'Feeling angry, scared, or overwhelmed',
        color: THEME.zones.red
      }
    ];

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Customize Your Zones</Text>
        <Text style={styles.stepSubtitle}>
          These describe how you might feel in each zone. You can use our defaults or write your own!
        </Text>

        {zones.map(zone => (
          <View key={zone.key} style={[styles.zoneCard, { borderLeftColor: zone.color }]}>
            <View style={styles.zoneHeader}>
              <Text style={styles.zoneEmoji}>{zone.emoji}</Text>
              <Text style={styles.zoneName}>{zone.name}</Text>
            </View>
            
            <TextInput
              style={styles.zoneInput}
              value={userData.customZoneDescriptions[zone.key] || zone.defaultDescription}
              onChangeText={(text) => setUserData(prev => ({
                ...prev,
                customZoneDescriptions: {
                  ...prev.customZoneDescriptions,
                  [zone.key]: text
                }
              }))}
              placeholder={zone.defaultDescription}
              placeholderTextColor={THEME.text.light}
              multiline={true}
              numberOfLines={2}
            />
          </View>
        ))}
      </View>
    );
  }

  function AccessibilityStep() {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Accessibility Features</Text>
        <Text style={styles.stepSubtitle}>
          Let's make sure Calm Compass works perfectly for you
        </Text>

        <View style={styles.accessibilityOptions}>
          <TouchableOpacity
            style={[
              styles.accessibilityCard,
              userData.useAccessibility && styles.accessibilityCardSelected
            ]}
            onPress={() => setUserData(prev => ({ ...prev, useAccessibility: !prev.useAccessibility }))}
          >
            <Text style={styles.accessibilityIcon}>♿</Text>
            <View style={styles.accessibilityText}>
              <Text style={styles.accessibilityTitle}>
                Enhanced Accessibility
              </Text>
              <Text style={styles.accessibilityDescription}>
                • High contrast colors{'\n'}
                • Larger text options{'\n'}
                • Reduced motion effects{'\n'}
                • Screen reader optimized
              </Text>
            </View>
            <View style={[styles.checkbox, userData.useAccessibility && styles.checkboxSelected]}>
              {userData.useAccessibility && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>

          <View style={styles.accessibilityNote}>
            <Text style={styles.accessibilityNoteText}>
              💡 You can always change these settings later in the Settings tab
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function CompleteStep() {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.completeEmoji}>🎉</Text>
        <Text style={styles.completeTitle}>You're All Set!</Text>
        <Text style={styles.completeSubtitle}>
          Your Calm Compass is ready to help you navigate your emotions
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Setup Summary:</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text style={styles.summaryValue}>
              {userData.preferredName || userData.userName || 'Not specified'}
            </Text>
          </View>
          {userData.age && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Age:</Text>
              <Text style={styles.summaryValue}>{userData.age}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Accessibility:</Text>
            <Text style={styles.summaryValue}>
              {userData.useAccessibility ? 'Enhanced' : 'Standard'}
            </Text>
          </View>
        </View>

        <Text style={styles.getStartedText}>
          Ready to start your emotional wellness journey? 🚀
        </Text>
      </View>
    );
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Prepare the final user data
      const finalUserData = {
        userName: userData.userName || 'Friend',
        preferredName: userData.preferredName || userData.userName || '',
        age: userData.age ? parseInt(userData.age) : null,
        setupCompleted: true,
        accessibilityMode: userData.useAccessibility,
        zoneDescriptions: {
          blue: userData.customZoneDescriptions.blue || "Feeling sad, tired, or need quiet time",
          green: userData.customZoneDescriptions.green || "Feeling happy, calm, and ready to learn",
          yellow: userData.customZoneDescriptions.yellow || "Feeling worried, frustrated, or wiggly",
          red: userData.customZoneDescriptions.red || "Feeling angry, scared, or overwhelmed"
        },
        checkins: [],
        streakDays: 0,
        totalCheckins: 0,
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString()
      };

      const finalSettings = {
        theme: userData.useAccessibility ? 'high_contrast' : 'default',
        fontSize: userData.useAccessibility ? 'large' : 'normal',
        reducedMotion: userData.useAccessibility,
        soundEnabled: true,
        hapticEnabled: true,
        reminderNotifications: false,
        autoSaveProgress: true
      };

      await onComplete(finalUserData, finalSettings);
    } catch (error) {
      console.error('Setup completion error:', error);
      Alert.alert(
        'Setup Error',
        'There was a problem completing your setup. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return userData.userName.trim().length > 0;
    }
    return true;
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>
        
        <Text style={styles.headerTitle}>{steps[currentStep].title}</Text>
        <Text style={styles.headerSubtitle}>{steps[currentStep].subtitle}</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CurrentStepComponent />
      </ScrollView>

      <View style={styles.navigationBar}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.spacer} />
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={[
            styles.nextButtonText,
            !canProceed() && styles.nextButtonTextDisabled
          ]}>
            {currentStep === steps.length - 1 ? 'Get Started! 🚀' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  header: {
    backgroundColor: THEME.semantic.calm,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  progressText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
    minHeight: height * 0.6,
  },
  // Welcome Step
  welcomeEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  featureText: {
    fontSize: 15,
    color: THEME.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  setupNote: {
    fontSize: 13,
    color: THEME.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  // Profile Step
  stepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: THEME.text.primary,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputHelp: {
    fontSize: 12,
    color: THEME.text.secondary,
    marginTop: 6,
    lineHeight: 16,
  },
  // Zones Step
  zoneCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  zoneInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: THEME.text.primary,
    backgroundColor: '#f8f8f8',
    textAlignVertical: 'top',
    minHeight: 60,
  },
  // Accessibility Step
  accessibilityOptions: {
    marginTop: 20,
  },
  accessibilityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accessibilityCardSelected: {
    borderColor: THEME.semantic.calm,
    backgroundColor: THEME.semantic.calm + '10',
  },
  accessibilityIcon: {
    fontSize: 32,
    marginRight: 16,
    marginTop: 4,
  },
  accessibilityText: {
    flex: 1,
    marginRight: 16,
  },
  accessibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 8,
  },
  accessibilityDescription: {
    fontSize: 13,
    color: THEME.text.secondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  checkboxSelected: {
    borderColor: THEME.semantic.calm,
    backgroundColor: THEME.semantic.calm,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  accessibilityNote: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: THEME.semantic.calm,
  },
  accessibilityNoteText: {
    fontSize: 13,
    color: THEME.text.primary,
    lineHeight: 18,
  },
  // Complete Step
  completeEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 20,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  completeSubtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: THEME.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME.text.primary,
  },
  getStartedText: {
    fontSize: 16,
    color: THEME.text.primary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  // Navigation
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  backButtonText: {
    fontSize: 14,
    color: THEME.text.secondary,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: THEME.semantic.calm,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#999',
  },
});

export default SetupScreen;