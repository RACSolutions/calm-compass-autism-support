// src/components/BlueZoneComponents/index.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { THEME } from '../../styles/colors';

// TimerComponent.js
export const TimerComponent = ({ 
  tool, 
  onComplete, 
  onCancel, 
  initialTime = null 
}) => {
  const [selectedTime, setSelectedTime] = useState(initialTime || tool.defaultDuration);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const intervalRef = useRef(null);
  const soundRef = useRef(null);

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
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeRemaining]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    
    // Play completion sound - simplified for now
    try {
      // Would load actual audio file here
      console.log('Playing timer completion sound');
    } catch (error) {
      console.log('Could not play timer sound');
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
    setTimeRemaining(null);
    setShowSetup(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showSetup) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{tool.icon} {tool.title}</Text>
          <Text style={styles.subtitle}>How long would you like to rest?</Text>
        </View>

        <View style={styles.timeOptions}>
          {tool.timerOptions.map(time => (
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
          {tool.instructions.map((instruction, index) => (
            <Text key={index} style={styles.instruction}>
              • {instruction}
            </Text>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startTimer}>
            <Text style={styles.startButtonText}>Start {selectedTime} Min Timer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timerDisplay}>
        <Text style={styles.timerTitle}>{tool.title}</Text>
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
            {isActive ? '⏸️ Pause' : '▶️ Resume'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={extendTimer}
        >
          <Text style={styles.controlButtonText}>⏰ +5 Min</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.resetButton]} 
          onPress={resetTimer}
        >
          <Text style={[styles.controlButtonText, styles.resetButtonText]}>
            🔄 Reset
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// AudioPlayerComponent.js
export const AudioPlayerComponent = ({ 
  tool, 
  onComplete, 
  onCancel 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [volume, setVolume] = useState(0.7);
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playAudio = async (option) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      // Simplified audio loading for now - would use actual files
      console.log(`Playing audio: ${option.title}`);
      
      setSelectedOption(option);
      setIsPlaying(true);
      setShowOptions(false);

    } catch (error) {
      Alert.alert('Audio Error', 'Could not load audio file');
      console.log(error);
    }
  };

  const pauseAudio = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      console.log('Audio paused');
    } else {
      setIsPlaying(true);
      console.log('Audio resumed');
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
    }
    setIsPlaying(false);
    setShowOptions(true);
    setSelectedOption(null);
  };

  const changeVolume = async (newVolume) => {
    setVolume(newVolume);
    if (sound) {
      await sound.setVolumeAsync(newVolume);
    }
  };

  if (showOptions) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{tool.icon} {tool.title}</Text>
          <Text style={styles.subtitle}>Choose what sounds most calming to you:</Text>
        </View>

        <View style={styles.audioOptions}>
          {tool.audioOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.audioOption}
              onPress={() => playAudio(option)}
            >
              <Text style={styles.audioIcon}>{option.icon}</Text>
              <View style={styles.audioInfo}>
                <Text style={styles.audioTitle}>{option.title}</Text>
                <Text style={styles.audioDescription}>{option.description}</Text>
              </View>
              <Text style={styles.playButton}>▶️</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.nowPlaying}>
        <Text style={styles.nowPlayingTitle}>Now Playing</Text>
        <View style={styles.currentTrack}>
          <Text style={styles.trackIcon}>{selectedOption.icon}</Text>
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{selectedOption.title}</Text>
            <Text style={styles.trackDescription}>{selectedOption.description}</Text>
          </View>
        </View>
      </View>

      <View style={styles.playerControls}>
        <TouchableOpacity 
          style={styles.playPauseButton} 
          onPress={pauseAudio}
        >
          <Text style={styles.playPauseIcon}>
            {isPlaying ? '⏸️' : '▶️'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.stopButton} 
          onPress={stopAudio}
        >
          <Text style={styles.stopIcon}>⏹️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.volumeContainer}>
        <Text style={styles.volumeLabel}>Volume</Text>
        <View style={styles.volumeSlider}>
          {[0.3, 0.5, 0.7, 1.0].map(vol => (
            <TouchableOpacity
              key={vol}
              style={[
                styles.volumeButton,
                volume === vol && styles.activeVolumeButton
              ]}
              onPress={() => changeVolume(vol)}
            >
              <Text style={[
                styles.volumeText,
                volume === vol && styles.activeVolumeText
              ]}>
                {Math.round(vol * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={styles.encouragement}>
        {isPlaying ? 
          "Let these sounds create a peaceful space around you 🌸" :
          "Take a moment to breathe and listen 🫁"
        }
      </Text>
    </View>
  );
};

// StimmingOptionsComponent.js
export const StimmingOptionsComponent = ({ 
  tool, 
  onComplete, 
  onCancel,
  userPreferences = []
}) => {
  const [selectedStims, setSelectedStims] = useState([]);
  const [isActive, setIsActive] = useState(false);

  const toggleStim = (stimOption) => {
    setSelectedStims(prev => 
      prev.find(s => s.id === stimOption.id)
        ? prev.filter(s => s.id !== stimOption.id)
        : [...prev, stimOption]
    );
  };

  const startStimming = () => {
    if (selectedStims.length === 0) {
      Alert.alert(
        'Choose Your Stims',
        'Please select at least one stimming option that feels good to you.'
      );
      return;
    }
    setIsActive(true);
  };

  if (!isActive) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{tool.icon} {tool.title}</Text>
          <Text style={styles.subtitle}>
            Choose the stimming that feels most calming right now:
          </Text>
        </View>

        <View style={styles.stimOptions}>
          {tool.stimOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.stimOption,
                selectedStims.find(s => s.id === option.id) && styles.selectedStimOption
              ]}
              onPress={() => toggleStim(option)}
            >
              <Text style={styles.stimIcon}>{option.icon}</Text>
              <View style={styles.stimInfo}>
                <Text style={styles.stimTitle}>{option.title}</Text>
                <Text style={styles.stimDescription}>{option.description}</Text>
                <Text style={styles.stimInstructions}>{option.instructions}</Text>
              </View>
              <Text style={styles.checkmark}>
                {selectedStims.find(s => s.id === option.id) ? '✅' : '⭕'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.startButton} onPress={startStimming}>
            <Text style={styles.startButtonText}>
              Start Stimming ({selectedStims.length} selected)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.activeStimming}>
        <Text style={styles.activeTitle}>Your Stimming Time 🌸</Text>
        <Text style={styles.activeSubtitle}>
          Take as much time as you need. Your stimming is important and helpful.
        </Text>

        <View style={styles.selectedStims}>
          {selectedStims.map(stim => (
            <View key={stim.id} style={styles.activeStim}>
              <Text style={styles.activeStimIcon}>{stim.icon}</Text>
              <Text style={styles.activeStimTitle}>{stim.title}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.stimReminder}>
          Remember: There's no right or wrong way to stim. 
          Do what feels natural and comforting to your body.
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.completeButton} 
        onPress={() => onComplete('completed')}
      >
        <Text style={styles.completeButtonText}>I Feel Better Now ✨</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.primary.background,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Timer styles
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 30,
  },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedTimeButton: {
    backgroundColor: THEME.zones.blue,
    borderColor: THEME.zones.blue,
  },
  timeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  selectedTimeButtonText: {
    color: 'white',
  },
  instructions: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
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
    marginBottom: 8,
    lineHeight: 20,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 20,
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
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  resetButton: {
    borderColor: '#ff6b6b',
  },
  resetButtonText: {
    color: '#ff6b6b',
  },
  encouragement: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Audio styles
  audioOptions: {
    marginBottom: 30,
  },
  audioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  audioIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 14,
    color: THEME.text.secondary,
  },
  playButton: {
    fontSize: 24,
    color: THEME.semantic.calm,
  },
  nowPlaying: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.secondary,
    marginBottom: 16,
  },
  currentTrack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  trackDescription: {
    fontSize: 14,
    color: THEME.text.secondary,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.zones.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseIcon: {
    fontSize: 24,
    color: 'white',
  },
  stopButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stopIcon: {
    fontSize: 20,
  },
  volumeContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  volumeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  volumeSlider: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  volumeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeVolumeButton: {
    backgroundColor: THEME.zones.blue,
    borderColor: THEME.zones.blue,
  },
  volumeText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  activeVolumeText: {
    color: 'white',
  },
  
  // Stimming styles
  stimOptions: {
    marginBottom: 30,
  },
  stimOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStimOption: {
    borderColor: THEME.zones.blue,
    backgroundColor: '#f0f8ff',
  },
  stimIcon: {
    fontSize: 28,
    marginRight: 12,
    alignSelf: 'center',
  },
  stimInfo: {
    flex: 1,
  },
  stimTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  stimDescription: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginBottom: 4,
  },
  stimInstructions: {
    fontSize: 12,
    color: THEME.text.light,
    fontStyle: 'italic',
  },
  checkmark: {
    fontSize: 20,
    alignSelf: 'center',
  },
  activeStimming: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  activeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  activeSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  selectedStims: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  activeStim: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    minWidth: 80,
  },
  activeStimIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  activeStimTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
    textAlign: 'center',
  },
  stimReminder: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  
  // Button styles
  buttonContainer: {
    gap: 12,
  },
  startButton: {
    backgroundColor: THEME.zones.blue,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.secondary,
  },
  completeButton: {
    backgroundColor: THEME.semantic.progress,
    borderRadius: 25,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});