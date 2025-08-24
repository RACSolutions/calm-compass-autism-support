// src/components/BlueZoneComponents/index.js - Fixed TimerComponent
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../styles/colors';

// Fixed TimerComponent
export const TimerComponent = ({ 
  tool, 
  onComplete, 
  onCancel, 
  initialTime = null 
}) => {
  const [selectedTime, setSelectedTime] = useState(initialTime || tool.defaultDuration || 15);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const intervalRef = useRef(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            handleTimerComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    
    // Clear the interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    Alert.alert(
      `${tool.icon} Timer Complete!`,
      `Great job taking time for ${tool.title.toLowerCase()}! How are you feeling now?`,
      [
        { text: 'Much Better! 😊', onPress: () => onComplete('better') },
        { text: 'About the Same 😐', onPress: () => onComplete('same') },
        { text: 'Need More Time ⏰', onPress: () => extendTimer() }
      ]
    );
  };

  const startTimer = () => {
    console.log('Starting timer for', selectedTime, 'minutes');
    setTimeRemaining(selectedTime * 60); // Convert minutes to seconds
    setIsActive(true);
    setShowSetup(false);
  };

  const pauseTimer = () => {
    setIsActive(!isActive);
  };

  const extendTimer = () => {
    setTimeRemaining(prev => prev + (5 * 60)); // Add 5 more minutes
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeRemaining(null);
    setShowSetup(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get timer options from tool or use defaults
  const timerOptions = tool.timerOptions || [5, 10, 15, 20, 30];

  return (
    <View style={styles.container}>
      {/* Header with close button */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{tool.icon} {tool.title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
          <Ionicons name="close" size={24} color={THEME.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {showSetup ? (
          <>
            <View style={styles.header}>
              <Text style={styles.subtitle}>How long would you like to rest?</Text>
            </View>

            <View style={styles.timeOptions}>
              {timerOptions.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.selectedTimeButton
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={[
                    styles.timeButtonText,
                    selectedTime === time && styles.selectedTimeButtonText
                  ]}>
                    {time} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>While you rest:</Text>
              {tool.instructions ? tool.instructions.map((instruction, index) => (
                <Text key={index} style={styles.instruction}>
                  • {instruction}
                </Text>
              )) : (
                <Text style={styles.instruction}>
                  • Find your favorite quiet spot{'\n'}
                  • Get comfortable with soft textures{'\n'}
                  • Dim the lights if possible{'\n'}
                  • Set a timer for how long you want to rest{'\n'}
                  • No pressure to do anything else
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.startButton} onPress={startTimer}>
                <Text style={styles.startButtonText}>Start {selectedTime} Min Timer</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.timerDisplay}>
              <View style={styles.timeCircle}>
                <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
                <Text style={styles.timeLabel}>
                  {isActive ? 'remaining' : 'paused'}
                </Text>
              </View>
              
              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${((selectedTime * 60 - timeRemaining) / (selectedTime * 60)) * 100}%` 
                    }
                  ]}
                />
              </View>
            </View>

            <Text style={styles.encouragement}>
              {isActive ? 
                "Take this time for yourself. You deserve this rest. 💙" :
                "Timer is paused. Ready to continue?"
              }
            </Text>

            <View style={styles.timerControls}>
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={pauseTimer}
              >
                <Text style={styles.controlButtonText}>
                  {isActive ? 'Pause' : 'Resume'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlButton, styles.resetButton]} 
                onPress={resetTimer}
              >
                <Text style={[styles.controlButtonText, styles.resetButtonText]}>
                  Reset
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// Placeholder components for audio and stimming
export const AudioPlayerComponent = ({ tool, onComplete, onCancel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{tool.icon} {tool.title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
          <Ionicons name="close" size={24} color={THEME.text.secondary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Audio player coming soon!</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => onComplete('completed')}>
          <Text style={styles.startButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export const StimmingOptionsComponent = ({ tool, onComplete, onCancel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>{tool.icon} {tool.title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
          <Ionicons name="close" size={24} color={THEME.text.secondary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>Stimming options coming soon!</Text>
        <TouchableOpacity style={styles.startButton} onPress={() => onComplete('completed')}>
          <Text style={styles.startButtonText}>Mark as Complete</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: THEME.zones.blue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    right: 20,
    top: 50,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Setup styles
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  timeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 70,
    alignItems: 'center',
  },
  selectedTimeButton: {
    borderColor: THEME.zones.blue,
    backgroundColor: 'rgba(123, 179, 240, 0.1)',
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  selectedTimeButtonText: {
    color: THEME.zones.blue,
  },
  instructions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: THEME.text.secondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: THEME.zones.blue,
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  
  // Timer display styles
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timeCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: THEME.zones.blue,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timeText: {
    fontSize: 32,
    fontWeight: '700',
    color: THEME.zones.blue,
  },
  timeLabel: {
    fontSize: 12,
    color: THEME.text.secondary,
    marginTop: 4,
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME.zones.blue,
  },
  encouragement: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontStyle: 'italic',
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  resetButton: {
    borderColor: '#ff6b6b',
  },
  resetButtonText: {
    color: '#ff6b6b',
  },
});