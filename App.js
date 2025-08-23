// App.js - Simple Working Calm Compass (No external file dependencies)
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Colors
const THEME = {
  primary: {
    softTeal: '#4DB6AC',
    white: '#FFFFFF',
    background: '#f5f7fa',
    shadow: '#000000',
  },
  zones: {
    blue: '#7BB3F0',
    green: '#7BC97B',
    yellow: '#F7C52D',
    red: '#F28B82',
  },
  text: {
    primary: '#2c3e50',
    secondary: '#7f8c8d',
    white: '#FFFFFF',
  }
};

const ZONE_EMOJIS = {
  blue: '😴',
  green: '😊',
  yellow: '😤',
  red: '😡',
};

const ZONE_TOOLS = {
  blue: [
    { icon: '💤', title: 'Rest Time', description: 'Find a quiet, safe space to recharge' },
    { icon: '🤗', title: 'Comfort Touch', description: 'Ask for a gentle hug or hold comfort item' },
    { icon: '🎵', title: 'Soothing Sounds', description: 'Listen to calming music or nature sounds' },
    { icon: '🧸', title: 'Comfort Object', description: 'Hold your favorite stuffed animal or blanket' },
    { icon: '💧', title: 'Hydration Check', description: 'Drink some water and check if hungry' }
  ],
  green: [
    { icon: '🎨', title: 'Creative Time', description: 'Draw, build, or make something' },
    { icon: '📚', title: 'Learning', description: 'Read, explore, or solve puzzles' },
    { icon: '🤸', title: 'Gentle Movement', description: 'Stretch, walk, or light exercise' },
    { icon: '👥', title: 'Social Time', description: 'Spend time with friends or family' },
    { icon: '🌟', title: 'Help Others', description: 'Do something kind for someone' }
  ],
  yellow: [
    { icon: '🫁', title: 'Breathing Practice', description: 'Take slow, deep breaths' },
    { icon: '🚶', title: 'Movement Break', description: 'Walk or pace to release energy' },
    { icon: '🤫', title: 'Quiet Space', description: 'Find a calm, less stimulating area' },
    { icon: '🎧', title: 'Noise Control', description: 'Use headphones or ear protection' },
    { icon: '🧘', title: 'Grounding', description: 'Count 5 things you see, 4 you can touch' }
  ],
  red: [
    { icon: '🛑', title: 'STOP & Pause', description: 'Stop current activity and take a break' },
    { icon: '🫁', title: 'Emergency Breathing', description: 'Take 10 very slow, deep breaths' },
    { icon: '🏃', title: 'Safe Movement', description: 'Physical activity in a safe space' },
    { icon: '❄️', title: 'Cooling Down', description: 'Cold water, ice pack, or cool air' },
    { icon: '🗣️', title: 'Get Support', description: 'Tell a trusted person how you feel' }
  ]
};

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('zones');
  const [selectedZone, setSelectedZone] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userData, setUserData] = useState({
    checkins: [],
    zoneDescriptions: {
      blue: 'Tired, sad, or low energy',
      green: 'Happy, calm, ready to learn',
      yellow: 'Excited, worried, or wiggly',
      red: 'Mad, angry, or overwhelmed'
    },
    toolUsage: {}
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const saved = await AsyncStorage.getItem('calmCompassUserData');
      if (saved) {
        setUserData({ ...userData, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.log('Error loading user data:', error);
    }
  };

  const saveUserData = async (newData) => {
    try {
      await AsyncStorage.setItem('calmCompassUserData', JSON.stringify(newData));
      setUserData(newData);
    } catch (error) {
      console.log('Error saving user data:', error);
    }
  };

  const handleZoneSelection = (zone) => {
    setSelectedZone(zone);
    
    const newCheckin = {
      timestamp: new Date().toISOString(),
      zone: zone,
      id: Date.now()
    };
    
    const updatedData = {
      ...userData,
      checkins: [...userData.checkins, newCheckin]
    };
    
    saveUserData(updatedData);
    setCurrentScreen('help');
  };

  const handleToolPress = (tool) => {
    // Record tool usage
    const updatedData = {
      ...userData,
      toolUsage: {
        ...userData.toolUsage,
        [tool.title]: (userData.toolUsage[tool.title] || 0) + 1
      }
    };
    saveUserData(updatedData);

    // Show helpful guidance
    if (tool.title.includes('Breathing')) {
      Alert.alert(
        '🫁 Breathing Exercise', 
        'Let\'s breathe together:\n\n1. Breathe in slowly for 4 counts\n2. Hold for 4 counts\n3. Breathe out for 4 counts\n4. Repeat as needed\n\nYou\'re doing great! 💚'
      );
    } else if (tool.title.includes('STOP')) {
      Alert.alert(
        '🛑 STOP Technique',
        'Let\'s use the STOP method:\n\nS - Stop what you\'re doing\nT - Take a breath\nO - Observe how you feel\nP - Proceed with a helpful choice\n\nYou\'ve got this! 🌟'
      );
    } else {
      Alert.alert(
        'Great Choice! 🌟', 
        `${tool.title} is perfect for the ${selectedZone} zone.\n\n${tool.description}\n\nTake your time with this activity! 🧭`
      );
    }
  };

  const ZoneCard = ({ zone }) => (
    <TouchableOpacity
      style={[styles.zoneCard, { backgroundColor: THEME.zones[zone.key] }]}
      onPress={() => handleZoneSelection(zone.key)}
      accessibilityLabel={`${zone.key} zone: ${zone.description}`}
      accessibilityRole="button"
    >
      <Text style={styles.zoneEmoji}>{ZONE_EMOJIS[zone.key]}</Text>
      <Text style={styles.zoneTitle}>{zone.title}</Text>
      <Text style={styles.zoneDescription}>{zone.description}</Text>
    </TouchableOpacity>
  );

  const ToolButton = ({ tool }) => (
    <TouchableOpacity
      style={styles.toolButton}
      onPress={() => handleToolPress(tool)}
      accessibilityLabel={`${tool.title}: ${tool.description}`}
      accessibilityRole="button"
    >
      <Text style={styles.toolIcon}>{tool.icon}</Text>
      <View style={styles.toolText}>
        <Text style={styles.toolTitle}>{tool.title}</Text>
        <Text style={styles.toolDescription}>{tool.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const ZonesScreen = () => (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.questionContainer}>
        <Text style={styles.question}>How is your body feeling right now?</Text>
        <Text style={styles.questionSubtext}>Choose the zone that matches your feelings</Text>
      </View>

      <View style={styles.zonesGrid}>
        {[
          { key: 'blue', title: 'Blue Zone', description: userData.zoneDescriptions.blue },
          { key: 'green', title: 'Green Zone', description: userData.zoneDescriptions.green },
          { key: 'yellow', title: 'Yellow Zone', description: userData.zoneDescriptions.yellow },
          { key: 'red', title: 'Red Zone', description: userData.zoneDescriptions.red }
        ].map(zone => (
          <ZoneCard key={zone.key} zone={zone} />
        ))}
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Great job checking in! 🌟</Text>
        <View style={styles.starsContainer}>
          {[...Array(5)].map((_, i) => (
            <Text key={i} style={styles.star}>⭐</Text>
          ))}
        </View>
        <Text style={styles.progressText}>
          You've used your compass {userData.checkins.length} times!
        </Text>
        <Text style={styles.encouragementText}>
          Every check-in helps you understand yourself better! 💚
        </Text>
      </View>
    </ScrollView>
  );

  const HelpScreen = () => {
    const tools = ZONE_TOOLS[selectedZone] || [];
    
    return (
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>🛠️ Your Compass Tools</Text>
          <Text style={styles.sectionDescription}>
            These tools are specially chosen to help you feel better in the {selectedZone} zone
          </Text>
          
          {tools.map((tool, index) => (
            <ToolButton key={index} tool={tool} />
          ))}
        </View>

        <View style={styles.communicationSection}>
          <Text style={styles.sectionTitle}>💬 Need Help with Words?</Text>
          <Text style={styles.sectionDescription}>
            Sometimes it's hard to find words. Tap these for help:
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
                style={styles.communicationCard}
                onPress={() => Alert.alert(
                  `${comm.emoji} ${comm.title}`,
                  `You can say or show:\n\n"${comm.script}"\n\nIt\'s okay to communicate in whatever way feels right for you.`
                )}
                accessibilityLabel={`Communication help: ${comm.title}`}
                accessibilityRole="button"
              >
                <Text style={styles.commEmoji}>{comm.emoji}</Text>
                <Text style={styles.commText}>{comm.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.checkInSection}>
          <Text style={styles.sectionTitle}>How do you feel now?</Text>
          <Text style={styles.sectionDescription}>Let us know how the tools are working!</Text>
          <View style={styles.emotionFaces}>
            {[
              { emoji: '😄', label: 'Much better!' },
              { emoji: '🙂', label: 'A little better' },
              { emoji: '😐', label: 'About the same' },
              { emoji: '😔', label: 'Still struggling' }
            ].map((face, index) => (
              <TouchableOpacity
                key={index}
                style={styles.faceButton}
                onPress={() => {
                  if (face.label === 'Still struggling') {
                    Alert.alert(
                      'You\'re doing great! 💚', 
                      'It\'s okay that you\'re still struggling. Feelings take time to change. Would you like to try another tool?',
                      [
                        { text: 'Try more tools', style: 'default' },
                        { text: 'I\'m okay for now', style: 'cancel' }
                      ]
                    );
                  } else {
                    Alert.alert(
                      'Thank you! 🌟', 
                      `Thanks for letting us know: ${face.label}. You\'re doing a great job taking care of yourself!`
                    );
                  }
                }}
                accessibilityLabel={face.label}
                accessibilityRole="button"
              >
                <Text style={styles.faceEmoji}>{face.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  const AppHeader = ({ title, subtitle, showBack = false, showSettings = false, headerColor = THEME.primary.softTeal }) => (
    <View style={[styles.header, { backgroundColor: headerColor }]}>
      {showBack && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            setCurrentScreen('zones');
            setSelectedZone(null);
          }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
      
      {showSettings && (
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettings(true)}
          accessibilityLabel="Settings"
          accessibilityRole="button"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={THEME.primary.softTeal} />
      
      {currentScreen === 'zones' && (
        <>
          <AppHeader 
            title="Calm Compass 🧭" 
            subtitle="Navigate your emotions with confidence"
            showSettings={true}
          />
          <ZonesScreen />
        </>
      )}
      
      {currentScreen === 'help' && (
        <>
          <AppHeader 
            title={`${ZONE_EMOJIS[selectedZone]} ${selectedZone?.charAt(0).toUpperCase() + selectedZone?.slice(1)} Zone`}
            subtitle="Your compass is pointing to helpful tools!"
            showBack={true}
            headerColor={THEME.zones[selectedZone]} // Dynamic zone color
          />
          <HelpScreen />
        </>
      )}

      {/* Settings Modal */}
      <Modal visible={showSettings} animationType="slide">
        <SafeAreaView style={styles.container}>
          <AppHeader 
            title="Settings ⚙️" 
            subtitle="Customize your Calm Compass experience"
            showBack={false}
          />
          <View style={styles.settingsContent}>
            <Text style={styles.settingsText}>Calm Compass Settings 🧭</Text>
            <Text style={styles.settingsSubtext}>
              Customize your emotional navigation experience with sensory preferences, 
              custom tools, and accessibility options.
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowSettings(false)}
            >
              <Text style={styles.closeButtonText}>Close Settings</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  header: {
    backgroundColor: THEME.primary.softTeal,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: THEME.primary.softTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 18,
  },
  settingsButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40,
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
    fontSize: 20,
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
    opacity: 0.95,
  },
  zoneEmoji: {
    fontSize: 42,
    marginBottom: 8,
  },
  zoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  zoneDescription: {
    fontSize: 12,
    color: 'white',
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    color: '#27ae60',
    textAlign: 'center',
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: THEME.primary.softTeal,
    textAlign: 'center',
    fontWeight: '600',
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
  toolButton: {
    backgroundColor: THEME.primary.white,
    borderRadius: 15,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  toolIcon: {
    fontSize: 32,
    marginRight: 15,
    width: 45,
    textAlign: 'center',
  },
  toolText: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 13,
    color: THEME.text.secondary,
    lineHeight: 17,
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
  checkInSection: {
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
  emotionFaces: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  faceButton: {
    padding: 10,
    borderRadius: 50,
  },
  faceEmoji: {
    fontSize: 36,
  },
  settingsContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  settingsText: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsSubtext: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: THEME.primary.softTeal,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default App;