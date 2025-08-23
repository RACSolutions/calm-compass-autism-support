// src/data/zoneTools.js - Autism-Specific Coping Tools
export const ZONE_TOOLS = {
  blue: [
    { 
      icon: '💤', 
      title: 'Rest Time', 
      description: 'Find a quiet, safe space to recharge and restore energy',
      category: 'rest',
      autismSpecific: true
    },
    { 
      icon: '🤗', 
      title: 'Comfort Touch', 
      description: 'Ask for a gentle hug or hold your comfort item',
      category: 'comfort',
      autismSpecific: true
    },
    { 
      icon: '🎵', 
      title: 'Soothing Sounds', 
      description: 'Listen to calming music, white noise, or nature sounds',
      category: 'auditory',
      autismSpecific: true
    },
    { 
      icon: '🧸', 
      title: 'Comfort Object', 
      description: 'Hold your favorite stuffed animal, blanket, or fidget item',
      category: 'tactile',
      autismSpecific: true
    },
    { 
      icon: '💧', 
      title: 'Hydration Check', 
      description: 'Drink some water and check if you need food or rest',
      category: 'physical',
      autismSpecific: false
    },
    { 
      icon: '📖', 
      title: 'Special Interest', 
      description: 'Engage with something you love and find comforting',
      category: 'cognitive',
      autismSpecific: true
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

export default ZONE_TOOLS;