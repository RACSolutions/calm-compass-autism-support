// src/components/zones/ToolButton.js - Fixed without bottom-right icons
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { THEME } from '../../styles/colors';

const ToolButton = ({ 
  tool, 
  onPress, 
  accessibilityMode = false,
  size = 'normal', // 'normal' | 'small' | 'large'
  isCompleted = false,
  showStatus = true
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: 15,
          iconSize: 28,
          titleSize: 16,
          descSize: 12
        };
      case 'large':
        return {
          padding: 25,
          iconSize: 44,
          titleSize: 20,
          descSize: 16
        };
      default:
        return {
          padding: 20,
          iconSize: 36,
          titleSize: 18,
          descSize: 14
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getStatusIcon = () => {
    if (tool.hasTimer) return '⏰';
    if (tool.hasAudioOptions) return '🎵';
    if (tool.hasCustomOptions) return '⚙️';
    return null;
  };

  const statusIcon = getStatusIcon();

  return (
    <TouchableOpacity
      style={[
        styles.toolButton,
        { 
          padding: sizeStyles.padding,
          paddingRight: statusIcon && showStatus ? sizeStyles.padding + 35 : sizeStyles.padding
        },
        accessibilityMode && styles.highContrastButton,
        isCompleted && styles.completedButton
      ]}
      onPress={() => onPress(tool)}
      accessibilityLabel={`${tool.title}: ${tool.description}`}
      accessibilityRole="button"
      accessibilityHint="Tap to use this coping tool"
      activeOpacity={0.7}
    >
      {/* Main content container */}
      <View style={styles.contentContainer}>
        <Text style={[styles.toolIcon, { fontSize: sizeStyles.iconSize }]}>
          {tool.icon}
        </Text>
        
        <View style={styles.toolText}>
          <Text style={[
            styles.toolTitle, 
            { fontSize: sizeStyles.titleSize },
            accessibilityMode && styles.highContrastTitle
          ]}>
            {tool.title}
          </Text>
          <Text style={[
            styles.toolDescription, 
            { fontSize: sizeStyles.descSize },
            accessibilityMode && styles.highContrastDescription
          ]}>
            {tool.description}
          </Text>
          {tool.category && (
            <Text style={[styles.toolCategory, accessibilityMode && styles.highContrastCategory]}>
              {tool.category}
            </Text>
          )}
        </View>
      </View>
      
      {/* Only status indicator in top-right - NO bottom-right icons */}
      {statusIcon && showStatus && (
        <View style={styles.statusIndicator}>
          <Text style={styles.statusIcon}>{statusIcon}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toolButton: {
    backgroundColor: THEME.primary.white,
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    position: 'relative',
    minHeight: 80,
  },
  highContrastButton: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  completedButton: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 4,
    borderLeftColor: THEME.semantic.calm,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolIcon: {
    marginRight: 16,
    width: 50,
    textAlign: 'center',
    alignSelf: 'center',
  },
  toolText: {
    flex: 1,
    justifyContent: 'center',
  },
  toolTitle: {
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 4,
    lineHeight: 22,
  },
  toolDescription: {
    color: THEME.text.secondary,
    lineHeight: 20,
    marginBottom: 2,
  },
  toolCategory: {
    fontSize: 11,
    color: THEME.text.light,
    fontStyle: 'italic',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  
  // Only status indicator in top-right
  statusIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    backgroundColor: 'rgba(123, 179, 240, 0.1)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 16,
  },
  
  // High contrast styles
  highContrastTitle: {
    color: THEME.accessibility.highContrast.text,
  },
  highContrastDescription: {
    color: THEME.accessibility.highContrast.secondary,
  },
  highContrastCategory: {
    color: THEME.accessibility.highContrast.secondary,
  },
});

export default ToolButton;