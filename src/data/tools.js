// src/data/tools.js - Comprehensive database of coping tools for each zone
export const ZONE_TOOLS = {
    blue: [
      {
        id: 'blue_rest',
        title: 'Quiet Rest Time',
        icon: '🛋️',
        description: 'Find a cozy spot to rest and recharge your energy',
        category: 'rest',
        autismSpecific: true,
        instructions: [
          'Find your favorite quiet spot',
          'Get comfortable with soft textures',
          'Dim the lights if possible',
          'Rest for as long as you need',
          'No pressure to do anything else'
        ],
        benefits: ['Reduces overwhelm', 'Restores energy', 'Calms nervous system'],
        duration: '5-30 minutes'
      },
      {
        id: 'blue_deep_pressure',
        title: 'Weighted Blanket Hug',
        icon: '🤗',
        description: 'Use deep pressure to feel calm and secure',
        category: 'sensory',
        autismSpecific: true,
        instructions: [
          'Get your weighted blanket or heavy pillow',
          'Wrap it around yourself snugly',
          'Feel the gentle, even pressure',
          'Breathe slowly and deeply',
          'Stay as long as it feels good'
        ],
        benefits: ['Calms nervous system', 'Reduces anxiety', 'Improves focus'],
        duration: '10-20 minutes'
      },
      {
        id: 'blue_soft_music',
        title: 'Gentle Music',
        icon: '🎵',
        description: 'Listen to soft, calming sounds or music',
        category: 'auditory',
        autismSpecific: false,
        instructions: [
          'Choose your favorite calm music',
          'Use comfortable headphones if needed',
          'Close your eyes and listen',
          'Let the music wash over you',
          'Focus only on the sounds'
        ],
        benefits: ['Soothes emotions', 'Blocks distracting noise', 'Promotes relaxation'],
        duration: '5-15 minutes'
      },
      {
        id: 'blue_gentle_stim',
        title: 'Soft Stimming',
        icon: '🌸',
        description: 'Use gentle self-soothing movements',
        category: 'movement',
        autismSpecific: true,
        instructions: [
          'Rock gently back and forth',
          'Stroke soft fabric or fidget toy',
          'Hum quietly to yourself',
          'Move your hands in gentle patterns',
          'Follow what feels good to your body'
        ],
        benefits: ['Self-regulation', 'Comfort', 'Sensory satisfaction'],
        duration: 'As needed'
      }
    ],
    
    green: [
      {
        id: 'green_mindfulness',
        title: 'Mindful Moments',
        icon: '🧘',
        description: 'Practice gentle awareness of the present moment',
        category: 'mindfulness',
        autismSpecific: false,
        instructions: [
          'Sit comfortably where you are',
          'Notice 5 things you can see',
          'Notice 4 things you can hear',
          'Notice 3 things you can touch',
          'Notice 2 things you can smell',
          'Notice 1 thing you can taste'
        ],
        benefits: ['Increases awareness', 'Promotes calm focus', 'Grounds in present'],
        duration: '3-5 minutes'
      },
      {
        id: 'green_gratitude',
        title: 'Gratitude Practice',
        icon: '🙏',
        description: 'Think of things that make you feel thankful',
        category: 'cognitive',
        autismSpecific: false,
        instructions: [
          'Think of 3 good things from today',
          'Picture each one in your mind',
          'Feel the happiness they bring',
          'Say "thank you" for each one',
          'Share with someone if you want to'
        ],
        benefits: ['Boosts mood', 'Builds positive thinking', 'Strengthens relationships'],
        duration: '2-5 minutes'
      },
      {
        id: 'green_gentle_exercise',
        title: 'Feel-Good Movement',
        icon: '🚶',
        description: 'Move your body in ways that feel good',
        category: 'movement',
        autismSpecific: false,
        instructions: [
          'Start with gentle stretches',
          'Walk around your space',
          'Dance to favorite music',
          'Do jumping jacks if you feel like it',
          'Stop when it feels right'
        ],
        benefits: ['Maintains positive energy', 'Improves mood', 'Builds strength'],
        duration: '5-15 minutes'
      },
      {
        id: 'green_social_connection',
        title: 'Connect with Others',
        icon: '👫',
        description: 'Reach out to people who make you feel good',
        category: 'social',
        autismSpecific: false,
        instructions: [
          'Think of someone who cares about you',
          'Send them a message or drawing',
          'Tell them something nice',
          'Share how you\'re feeling',
          'Plan something fun together'
        ],
        benefits: ['Strengthens relationships', 'Shares joy', 'Builds support network'],
        duration: '5-20 minutes'
      }
    ],
    
    yellow: [
      {
        id: 'yellow_belly_breathing',
        title: 'Belly Breathing',
        icon: '🫁',
        description: 'Use slow, deep breathing to calm your worried feelings',
        category: 'breathing',
        autismSpecific: false,
        instructions: [
          'Put one hand on your chest, one on your belly',
          'Breathe in slowly through your nose for 4 counts',
          'Feel your belly rise like a balloon',
          'Hold gently for 2 counts',
          'Breathe out slowly through your mouth for 6 counts',
          'Repeat until you feel calmer'
        ],
        benefits: ['Calms nervous system', 'Reduces anxiety', 'Improves focus'],
        duration: '2-10 minutes'
      },
      {
        id: 'yellow_fidget_tools',
        title: 'Fidget Break',
        icon: '🌀',
        description: 'Use fidget toys to help your wiggly energy',
        category: 'sensory',
        autismSpecific: true,
        instructions: [
          'Choose your favorite fidget toy',
          'Squeeze, twist, or spin it',
          'Focus on how it feels in your hands',
          'Let your fingers do what feels good',
          'Use it while thinking or listening'
        ],
        benefits: ['Helps concentration', 'Manages restless energy', 'Provides sensory input'],
        duration: 'As needed'
      },
      {
        id: 'yellow_worry_dump',
        title: 'Worry Dump',
        icon: '📝',
        description: 'Get worried thoughts out of your head onto paper',
        category: 'cognitive',
        autismSpecific: false,
        instructions: [
          'Get paper and pencil or device',
          'Write down everything you\'re worried about',
          'Don\'t worry about spelling or neatness',
          'Keep writing until your head feels clearer',
          'Crumple up the paper or delete if you want'
        ],
        benefits: ['Clears racing thoughts', 'Reduces mental clutter', 'Provides relief'],
        duration: '5-15 minutes'
      },
      {
        id: 'yellow_movement_break',
        title: 'Wiggle Break',
        icon: '💃',
        description: 'Move your body to release nervous energy',
        category: 'movement',
        autismSpecific: true,
        instructions: [
          'Find a safe space to move',
          'Shake your hands and arms',
          'March in place or walk around',
          'Do stretches that feel good',
          'Dance to music if you want',
          'Keep moving until you feel less wiggly'
        ],
        benefits: ['Releases excess energy', 'Improves regulation', 'Boosts mood'],
        duration: '3-10 minutes'
      }
    ],
    
    red: [
      {
        id: 'red_stop_technique',
        title: 'STOP Technique',
        icon: '🛑',
        description: 'Use STOP to pause and regain control',
        category: 'cognitive',
        autismSpecific: false,
        instructions: [
          'S - STOP what you\'re doing right now',
          'T - TAKE a slow, deep breath',
          'O - OBSERVE how your body feels',
          'P - PROCEED with a choice that helps you',
          'Remember: You have the power to choose'
        ],
        benefits: ['Prevents escalation', 'Builds self-control', 'Creates pause for thinking'],
        duration: '1-3 minutes'
      },
      {
        id: 'red_safe_space',
        title: 'Go to Safe Space',
        icon: '🏠',
        description: 'Find or create a calm, safe place for yourself',
        category: 'environment',
        autismSpecific: true,
        instructions: [
          'Go to your designated safe space',
          'Or create one with pillows/blankets',
          'Make it quiet and comfortable',
          'Stay there until you feel safer',
          'Use comfort items if helpful'
        ],
        benefits: ['Reduces overwhelm', 'Provides security', 'Allows reset time'],
        duration: '5-30 minutes'
      },
      {
        id: 'red_intense_movement',
        title: 'Big Movement',
        icon: '🏃',
        description: 'Use big body movements to release strong emotions',
        category: 'movement',
        autismSpecific: true,
        instructions: [
          'Find a safe space for big movements',
          'Run in place or do jumping jacks',
          'Push against a wall firmly',
          'Do push-ups or burpees',
          'Punch a pillow or punching bag',
          'Keep going until you feel the energy shift'
        ],
        benefits: ['Releases intense energy', 'Regulates nervous system', 'Provides physical outlet'],
        duration: '2-15 minutes'
      },
      {
        id: 'red_ask_for_help',
        title: 'Ask for Help',
        icon: '🗣️',
        description: 'Reach out to someone who can support you',
        category: 'social',
        autismSpecific: false,
        instructions: [
          'Think of a trusted person nearby',
          'Tell them "I need help" or show this app',
          'Point to what you need if words are hard',
          'Accept their support and comfort',
          'It\'s brave and smart to ask for help'
        ],
        benefits: ['Provides immediate support', 'Prevents isolation', 'Builds trust'],
        duration: 'As needed'
      },
      {
        id: 'red_sensory_reset',
        title: 'Sensory Reset',
        icon: '🌊',
        description: 'Use intense sensory input to help reset your system',
        category: 'sensory',
        autismSpecific: true,
        instructions: [
          'Hold ice cubes or cold pack safely',
          'Take a cold or warm shower',
          'Use a weighted blanket with firm pressure',
          'Listen to loud music with headphones',
          'Chew something crunchy or chewy',
          'Choose what feels most helpful right now'
        ],
        benefits: ['Rapid nervous system reset', 'Intense sensory input', 'Quick regulation'],
        duration: '2-10 minutes'
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
  
  export default {
    ZONE_TOOLS,
    getToolsForZone,
    getAllTools,
    getToolsByCategory,
    getAutismSpecificTools,
    getRandomToolForZone,
    TOOL_CATEGORIES
  };