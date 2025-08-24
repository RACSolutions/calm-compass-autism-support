// src/data/tools.js - Fixed without console logs that cause re-renders
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
      timerOptions: [5, 10, 15, 20, 30, 45, 60],
      defaultDuration: 15,
      instructions: [
        'Find your favorite quiet spot',
        'Get comfortable with soft textures',
        'Dim the lights if possible',
        'Set a timer for how long you want to rest',
        'No pressure to do anything else'
      ],
      benefits: ['Reduces overwhelm', 'Restores energy', 'Calms nervous system'],
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
      timerOptions: [5, 10, 15, 20, 30],
      defaultDuration: 10,
      instructions: [
        'Get your weighted blanket or heavy pillow',
        'Wrap it around yourself snugly',
        'Feel the gentle, even pressure',
        'Set a timer for your comfort session',
        'Breathe slowly and deeply',
        'Stay as long as it feels good'
      ],
      benefits: ['Calms nervous system', 'Reduces anxiety', 'Improves focus'],
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
          description: 'Peaceful ambient sounds',
          duration: '15 minutes',
          loopable: true
        },
        {
          id: 'nature_sounds',
          title: 'Nature Sounds',
          icon: '🌿',
          description: 'Gentle rain and forest sounds',
          duration: '20 minutes',
          loopable: true
        }
      ]
    },
    {
      id: 'blue_comfort_item',
      title: 'Comfort Item',
      icon: '🧸',
      description: 'Get your favorite comfort item to feel safe and secure',
      category: 'comfort',
      autismSpecific: true,
      hasTimer: false,
      instructions: [
        'Find your special comfort object',
        'Hold it close to you',
        'Feel its texture and weight',
        'Notice how it makes you feel safer',
        'It\'s perfectly okay to need comfort items'
      ],
      benefits: ['Provides security', 'Reduces anxiety', 'Creates familiarity']
    },
    {
      id: 'blue_gentle_stim',
      title: 'Soft Stimming',
      icon: '🌸',
      description: 'Use gentle self-soothing movements',
      category: 'movement',
      autismSpecific: true,
      hasCustomOptions: true,
      stimmingOptions: [
        { id: 'hand_flapping', title: 'Gentle Hand Movements', icon: '👋' },
        { id: 'rocking', title: 'Slow Rocking', icon: '↔️' },
        { id: 'finger_tapping', title: 'Soft Finger Tapping', icon: '👆' },
        { id: 'texture_touching', title: 'Touch Soft Textures', icon: '🤲' }
      ]
    },
    {
      id: 'blue_breathing',
      title: 'Calm Breathing',
      icon: '🫁',
      description: 'Breathe slowly to help your body relax',
      category: 'breathing',
      autismSpecific: false,
      hasTimer: true,
      timerOptions: [2, 5, 10, 15],
      defaultDuration: 5,
      instructions: [
        'Sit or lie down comfortably',
        'Place one hand on your chest, one on your belly',
        'Breathe in slowly through your nose (4 counts)',
        'Hold your breath gently (4 counts)',
        'Breathe out slowly through your mouth (6 counts)',
        'Repeat this pattern'
      ],
      benefits: ['Calms nervous system', 'Reduces stress hormones', 'Improves focus'],
      timerSound: 'nature_sound'
    }
  ],
  
  green: [
    {
      id: 'green_creative',
      title: 'Creative Time',
      icon: '🎨',
      description: 'Draw, write, or create something you enjoy',
      category: 'creative',
      autismSpecific: false,
      hasTimer: true,
      timerOptions: [10, 20, 30, 45],
      defaultDuration: 20
    },
    {
      id: 'green_learning',
      title: 'Special Interest',
      icon: '📚',
      description: 'Explore a topic you love or learn something new',
      category: 'cognitive',
      autismSpecific: true,
      hasTimer: true,
      timerOptions: [10, 20, 30, 45],
      defaultDuration: 20
    }
  ],
  
  yellow: [
    {
      id: 'yellow_movement',
      title: 'Movement Break',
      icon: '🤸',
      description: 'Move your body to release wiggly energy',
      category: 'movement',
      autismSpecific: false,
      hasTimer: true,
      timerOptions: [5, 10, 15, 20],
      defaultDuration: 10
    },
    {
      id: 'yellow_sensory',
      title: 'Sensory Tool',
      icon: '🌈',
      description: 'Use a fidget or sensory tool to help focus',
      category: 'sensory',
      autismSpecific: true,
      hasTimer: false
    }
  ],
  
  red: [
    {
      id: 'red_safe_space',
      title: 'Safe Space',
      icon: '🏠',
      description: 'Go to your calm down space until feelings pass',
      category: 'environment',
      autismSpecific: true,
      hasTimer: true,
      timerOptions: [5, 10, 15, 20, 30],
      defaultDuration: 15
    },
    {
      id: 'red_intense_stim',
      title: 'Intense Stimming',
      icon: '💪',
      description: 'Use stronger movements to release big feelings safely',
      category: 'movement',
      autismSpecific: true,
      hasCustomOptions: true
    }
  ]
};

// FIXED: Helper function without console logs that cause re-renders
export const getToolsForZone = (zone) => {
  return ZONE_TOOLS[zone] || [];
};

// Get all tools across all zones
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

// Get a random tool for a zone
export const getRandomToolForZone = (zone) => {
  const tools = getToolsForZone(zone);
  if (tools.length === 0) return null;
  return tools[Math.floor(Math.random() * tools.length)];
};

// Tool categories for organization
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
  creative: {
    name: 'Creative',
    icon: '🎨',
    description: 'Artistic and creative expression for emotional release'
  },
  rest: {
    name: 'Rest',
    icon: '😴',
    description: 'Activities for rest and recovery'
  },
  auditory: {
    name: 'Auditory',
    icon: '🎵',
    description: 'Sound-based calming strategies'
  },
  comfort: {
    name: 'Comfort',
    icon: '🧸',
    description: 'Items and activities that provide security and familiarity'
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

export default {
  ZONE_TOOLS,
  getToolsForZone,
  getAllTools,
  getToolsByCategory,
  getAutismSpecificTools,
  getRandomToolForZone,
  TOOL_CATEGORIES,
  TIMER_CONFIG
};