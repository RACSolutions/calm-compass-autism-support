// src/data/tools.js - Updated Blue Zone Tools with Enhanced Functionality
export const ZONE_TOOLS = {
  blue: [
    {
      id: 'blue_rest',
      title: 'Quiet Rest Time',
      icon: '🛋️',
      description: 'Find a cozy spot to rest and recharge your energy',
      category: 'rest',
      autismSpecific: true,
      hasTimer: true,
      timerOptions: [5, 10, 15, 20, 30, 45, 60], // minutes
      instructions: [
        'Find your favorite quiet spot',
        'Get comfortable with soft textures',
        'Dim the lights if possible',
        'Set a timer for how long you want to rest',
        'No pressure to do anything else'
      ],
      benefits: ['Reduces overwhelm', 'Restores energy', 'Calms nervous system'],
      defaultDuration: 15,
      timerSound: 'gentle_chime'
    },
    {
      id: 'blue_deep_pressure',
      title: 'Weighted Blanket Hug',
      icon: '🤗',
      description: 'Use deep pressure to feel calm and secure',
      category: 'sensory',
      autismSpecific: true,
      hasTimer: true,
      timerOptions: [5, 10, 15, 20, 30], // minutes
      instructions: [
        'Get your weighted blanket or heavy pillow',
        'Wrap it around yourself snugly',
        'Feel the gentle, even pressure',
        'Set a timer for your comfort session',
        'Breathe slowly and deeply',
        'Stay as long as it feels good'
      ],
      benefits: ['Calms nervous system', 'Reduces anxiety', 'Improves focus'],
      defaultDuration: 10,
      timerSound: 'soft_bell'
    },
    {
      id: 'blue_gentle_music',
      title: 'Gentle Music',
      icon: '🎵',
      description: 'Listen to soft, calming music',
      category: 'auditory',
      autismSpecific: false,
      hasAudioOptions: true,
      audioOptions: [
        {
          id: 'soft_piano',
          title: 'Soft Piano',
          icon: '🎹',
          description: 'Gentle piano melodies',
          duration: '10 minutes',
          loopable: true
        },
        {
          id: 'ambient_calm',
          title: 'Ambient Calm',
          icon: '🌙',
          description: 'Peaceful ambient music',
          duration: '15 minutes',
          loopable: true
        },
        {
          id: 'classical_gentle',
          title: 'Gentle Classical',
          icon: '🎼',
          description: 'Soft classical pieces',
          duration: '20 minutes',
          loopable: true
        },
        {
          id: 'lullaby',
          title: 'Modern Lullabies',
          icon: '🌟',
          description: 'Contemporary lullaby music',
          duration: '12 minutes',
          loopable: true
        }
      ],
      instructions: [
        'Choose your favorite calm music style',
        'Use comfortable headphones if needed',
        'Close your eyes and listen',
        'Let the music wash over you',
        'Focus only on the sounds'
      ],
      benefits: ['Soothes emotions', 'Blocks distracting noise', 'Promotes relaxation'],
      volume: 'adjustable'
    },
    {
      id: 'blue_relaxation_sounds',
      title: 'Relaxation Sounds',
      icon: '🌧️',
      description: 'Listen to calming nature and ambient sounds',
      category: 'auditory',
      autismSpecific: true,
      hasAudioOptions: true,
      audioOptions: [
        {
          id: 'gentle_rain',
          title: 'Gentle Rain',
          icon: '🌧️',
          description: 'Soft rainfall sounds',
          duration: 'continuous',
          loopable: true
        },
        {
          id: 'forest_sounds',
          title: 'Forest Sounds',
          icon: '🌲',
          description: 'Birds chirping and leaves rustling',
          duration: 'continuous',
          loopable: true
        },
        {
          id: 'ocean_waves',
          title: 'Ocean Waves',
          icon: '🌊',
          description: 'Gentle waves on the shore',
          duration: 'continuous',
          loopable: true
        },
        {
          id: 'flowing_water',
          title: 'Flowing Water',
          icon: '💧',
          description: 'Peaceful stream or creek',
          duration: 'continuous',
          loopable: true
        },
        {
          id: 'wind_chimes',
          title: 'Wind Chimes',
          icon: '🎐',
          description: 'Gentle chimes in the breeze',
          duration: 'continuous',
          loopable: true
        },
        {
          id: 'white_noise',
          title: 'White Noise',
          icon: '📻',
          description: 'Consistent background sound',
          duration: 'continuous',
          loopable: true
        }
      ],
      instructions: [
        'Choose sounds that feel most calming to you',
        'Adjust volume to a comfortable level',
        'Close your eyes or look at something peaceful',
        'Let the sounds create a calm bubble around you',
        'Use these sounds anytime you need peace'
      ],
      benefits: ['Masks distracting noises', 'Creates calming environment', 'Helps with focus'],
      volume: 'adjustable',
      mixable: true // Allow mixing multiple sounds
    },
    {
      id: 'blue_soft_stimming',
      title: 'Soft Stimming',
      icon: '🌸',
      description: 'Use gentle self-soothing movements based on your preferences',
      category: 'movement',
      autismSpecific: true,
      hasCustomOptions: true,
      stimOptions: [
        {
          id: 'gentle_rocking',
          title: 'Gentle Rocking',
          icon: '🪑',
          description: 'Rock back and forth slowly',
          instructions: 'Rock at your own rhythm, as gentle or firm as feels good'
        },
        {
          id: 'finger_tapping',
          title: 'Finger Tapping',
          icon: '👆',
          description: 'Tap fingers in patterns',
          instructions: 'Tap on your leg, desk, or soft surface in any pattern'
        },
        {
          id: 'hand_flapping',
          title: 'Hand Movements',
          icon: '👋',
          description: 'Gentle hand or arm movements',
          instructions: 'Move your hands in ways that feel natural and calming'
        },
        {
          id: 'fidget_toys',
          title: 'Fidget Items',
          icon: '🧸',
          description: 'Use your favorite fidget tools',
          instructions: 'Choose from stress balls, fidget cubes, textured items'
        },
        {
          id: 'soft_touching',
          title: 'Soft Textures',
          icon: '🧶',
          description: 'Touch soft fabrics or textures',
          instructions: 'Feel velvet, fur, smooth stones, or favorite textures'
        },
        {
          id: 'breathing_stim',
          title: 'Breathing Rhythm',
          icon: '🫁',
          description: 'Focus on breath patterns',
          instructions: 'Breathe in rhythm, count breaths, or make soft sounds'
        }
      ],
      instructions: [
        'Choose movements that feel most calming',
        'There\'s no right or wrong way to stim',
        'Do what feels natural to your body',
        'Take as much time as you need',
        'Your stimming is helpful and important'
      ],
      benefits: ['Self-regulates nervous system', 'Provides comfort', 'Reduces stress'],
      customizable: true,
      userPreferences: true // Links to user's saved stim preferences
    },
    {
      id: 'blue_comfort_item',
      title: 'Comfort Item',
      icon: '🧸',
      description: 'Hold your favorite comfort object',
      category: 'tactile',
      autismSpecific: true,
      instructions: [
        'Find your favorite comfort item',
        'Hold it close and feel its texture',
        'Notice how it makes you feel safer',
        'It\'s okay to need comfort items at any age'
      ],
      benefits: ['Provides security', 'Reduces anxiety', 'Offers familiar comfort'],
      duration: 'as needed'
    }
  ],

  green: [
    { 
      icon: '🎨', 
      title: 'Creative Time', 
      description: 'Draw, build, craft, or make something with your hands',
      category: 'creative',
      autismSpecific: false
    },
    { 
      icon: '📚', 
      title: 'Learning', 
      description: 'Read, explore topics you love, or solve puzzles',
      category: 'cognitive',
      autismSpecific: true
    },
    { 
      icon: '🤸', 
      title: 'Gentle Movement', 
      description: 'Stretch, walk, or do light exercise that feels good',
      category: 'physical',
      autismSpecific: false
    },
    { 
      icon: '👥', 
      title: 'Social Time', 
      description: 'Spend time with friends or family in a comfortable way',
      category: 'social',
      autismSpecific: true
    },
    { 
      icon: '🌟', 
      title: 'Help Others', 
      description: 'Do something kind for someone or care for a pet',
      category: 'social',
      autismSpecific: false
    },
    { 
      icon: '🧩', 
      title: 'Focus Activity', 
      description: 'Work on special interests, collections, or detailed tasks',
      category: 'cognitive',
      autismSpecific: true
    }
  ],

  yellow: [
    { 
      icon: '🫁', 
      title: 'Breathing Practice', 
      description: 'Take slow, deep breaths to regulate your nervous system',
      category: 'regulation',
      autismSpecific: false
    },
    { 
      icon: '🚶', 
      title: 'Movement Break', 
      description: 'Walk, pace, rock, or move your body in a safe way',
      category: 'physical',
      autismSpecific: true
    },
    { 
      icon: '🤫', 
      title: 'Quiet Space', 
      description: 'Find a calm, less stimulating area to regroup',
      category: 'environmental',
      autismSpecific: true
    },
    { 
      icon: '🎧', 
      title: 'Noise Control', 
      description: 'Use headphones, ear protection, or find quieter space',
      category: 'auditory',
      autismSpecific: true
    },
    { 
      icon: '🧘', 
      title: 'Grounding', 
      description: 'Count 5 things you see, 4 you can touch, 3 you hear',
      category: 'regulation',
      autismSpecific: false
    },
    { 
      icon: '🤹', 
      title: 'Fidget Time', 
      description: 'Use fidget toys, stim tools, or self-soothing movements',
      category: 'tactile',
      autismSpecific: true
    }
  ],

  red: [
    { 
      icon: '🛑', 
      title: 'STOP & Pause', 
      description: 'Stop current activity immediately and take a break',
      category: 'safety',
      autismSpecific: true
    },
    { 
      icon: '🫁', 
      title: 'Emergency Breathing', 
      description: 'Take 10 very slow, deep breaths to activate calm response',
      category: 'regulation',
      autismSpecific: false
    },
    { 
      icon: '🏃', 
      title: 'Safe Movement', 
      description: 'Physical activity in a safe space - run, jump, pace',
      category: 'physical',
      autismSpecific: true
    },
    { 
      icon: '❄️', 
      title: 'Cooling Down', 
      description: 'Cold water on face/hands, ice pack, or cool air',
      category: 'sensory',
      autismSpecific: true
    },
    { 
      icon: '🗣️', 
      title: 'Get Support', 
      description: 'Tell a trusted person how you feel or show them this app',
      category: 'communication',
      autismSpecific: true
    },
    { 
      icon: '🤗', 
      title: 'Deep Pressure', 
      description: 'Tight hug, weighted blanket, or compression vest',
      category: 'tactile',
      autismSpecific: true
    },
    { 
      icon: '🏠', 
      title: 'Safe Space', 
      description: 'Go to your designated calm-down area or safe space',
      category: 'environmental',
      autismSpecific: true
    }
  ]
};

// Get tools for a specific zone
export const getToolsForZone = (zone) => {
  return ZONE_TOOLS[zone] || [];
};

// Get all tools
export const getAllTools = () => {
  return Object.values(ZONE_TOOLS).flat();
};

// Get tools by category
export const getToolsByCategory = (category) => {
  return getAllTools().filter(tool => tool.category === category);
};

// Get autism-specific tools
export const getAutismSpecificTools = () => {
  return getAllTools().filter(tool => tool.autismSpecific);
};

// Get random tool for zone
export const getRandomToolForZone = (zone) => {
  const tools = getToolsForZone(zone);
  if (tools.length === 0) return null;
  return tools[Math.floor(Math.random() * tools.length)];
};

// Tool categories with descriptions
export const TOOL_CATEGORIES = {
  breathing: {
    name: 'Breathing',
    icon: '🫁',
    description: 'Techniques to calm your body and mind through breath'
  },
  movement: {
    name: 'Movement',
    icon: '🏃',
    description: 'Physical activities to regulate energy and emotions'
  },
  sensory: {
    name: 'Sensory',
    icon: '🌊',
    description: 'Tools that use your senses to help you feel better'
  },
  cognitive: {
    name: 'Thinking',
    icon: '🧠',
    description: 'Mental strategies to manage thoughts and feelings'
  },
  social: {
    name: 'Social',
    icon: '👫',
    description: 'Ways to connect with others for support and comfort'
  },
  environment: {
    name: 'Environment',
    icon: '🏠',
    description: 'Creating spaces that help you feel safe and calm'
  },
  mindfulness: {
    name: 'Mindfulness',
    icon: '🧘',
    description: 'Practices to stay present and aware'
  },
  rest: {
    name: 'Rest',
    icon: '😴',
    description: 'Activities for rest and recovery',
  },
  auditory: {
    name: 'Auditory',
    icon: '🎵',
    description: 'Sound-based calming strategies'
  }
};

// Timer configuration for tools
export const TIMER_CONFIG = {
  sounds: {
    gentle_chime: {
      file: 'gentle-chime.mp3',
      volume: 0.7,
      description: 'Soft chime sound'
    },
    soft_bell: {
      file: 'soft-bell.mp3', 
      volume: 0.6,
      description: 'Gentle bell tone'
    },
    nature_sound: {
      file: 'bird-chirp.mp3',
      volume: 0.5,
      description: 'Peaceful bird sound'
    }
  },
  defaultSettings: {
    showCountdown: true,
    vibrate: false, // Gentle for autism-friendly
    showProgress: true,
    allowExtend: true
  }
};

// Audio files configuration for music and sounds
export const AUDIO_CONFIG = {
  music: {
    soft_piano: 'audio/music/soft-piano-meditation.mp3',
    ambient_calm: 'audio/music/ambient-calm.mp3',
    classical_gentle: 'audio/music/classical-gentle.mp3',
    lullaby: 'audio/music/modern-lullabies.mp3'
  },
  nature_sounds: {
    gentle_rain: 'audio/nature/gentle-rain.mp3',
    forest_sounds: 'audio/nature/forest-birds.mp3',
    ocean_waves: 'audio/nature/ocean-waves.mp3',
    flowing_water: 'audio/nature/flowing-water.mp3',
    wind_chimes: 'audio/nature/wind-chimes.mp3',
    white_noise: 'audio/nature/white-noise.mp3'
  }
};

export default {
  ZONE_TOOLS,
  getToolsForZone,
  getAllTools,
  getToolsByCategory,
  getAutismSpecificTools,
  getRandomToolForZone,
  TOOL_CATEGORIES,
  TIMER_CONFIG,
  AUDIO_CONFIG
};