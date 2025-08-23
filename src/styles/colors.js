// src/styles/colors.js - Calm Compass Color Palette

// Primary App Colors - Calming and autism-friendly
export const PRIMARY_COLORS = {
    softTeal: '#4DB6AC',        // Main header/brand color - calming teal
    white: '#FFFFFF',
    background: '#f5f7fa',      // Main background
    cardBackground: '#FFFFFF',
    shadow: '#000000',
  };
  
  // Zone Colors - Softer, more gentle versions for autism sensitivities
  export const ZONE_COLORS = {
    blue: '#7BB3F0',           // Gentle sky blue (reduced intensity)
    green: '#7BC97B',          // Soft sage green (less bright)
    yellow: '#F7C52D',         // Warm sunshine yellow (less orange)
    red: '#F28B82',            // Gentle coral red (less harsh)
  };
  
  // Zone Emojis
  export const ZONE_EMOJIS = {
    blue: '😴',
    green: '😊',
    yellow: '😤', 
    red: '😡',
  };
  
  // Text Colors
  export const TEXT_COLORS = {
    primary: '#2c3e50',        // Dark blue-grey for main text
    secondary: '#7f8c8d',      // Medium grey for descriptions
    light: '#bdc3c7',          // Light grey for subtle text
    success: '#27ae60',        // Green for positive messages
    warning: '#f39c12',        // Orange for warnings
    error: '#e74c3c',          // Red for errors
    white: '#FFFFFF',
  };
  
  // Accessibility Colors
  export const ACCESSIBILITY_COLORS = {
    // High contrast versions for accessibility mode
    highContrast: {
      background: '#000000',
      text: '#FFFFFF',
      primary: '#00FFFF',      // Bright cyan
      secondary: '#FFFF00',    // Bright yellow
    },
    
    // Focus indicators
    focus: '#0066CC',          // Blue focus ring
    selected: '#4DB6AC',       // Teal for selected items
  };
  
  // Semantic Colors (for consistent meaning across app)
  export const SEMANTIC_COLORS = {
    calm: '#4DB6AC',           // Teal - main calming color
    comfort: '#7BC97B',        // Soft green - comfort and safety
    energy: '#F7C52D',         // Soft yellow - gentle energy
    attention: '#F28B82',      // Soft red - needs attention but not alarming
    
    // Progress and feedback
    progress: '#81C784',       // Success green
    encouraging: '#FFB74D',    // Warm orange for encouragement
    supportive: '#9C27B0',     // Purple for support features
  };
  
  // Export combined theme object
  export const THEME = {
    primary: PRIMARY_COLORS,
    zones: ZONE_COLORS,
    text: TEXT_COLORS,
    semantic: SEMANTIC_COLORS,
    accessibility: ACCESSIBILITY_COLORS,
    
    // Convenience getters
    getZoneColor: (zone) => ZONE_COLORS[zone] || ZONE_COLORS.blue,
    getZoneEmoji: (zone) => ZONE_EMOJIS[zone] || ZONE_EMOJIS.blue,
  };
  
  export default THEME;