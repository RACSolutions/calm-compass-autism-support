// src/components/zones/ToolButton.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { THEME } from '../../styles/colors';

const ToolButton = ({ 
  tool, 
  onPress, 
  accessibilityMode = false,
  size = 'normal' // 'normal' | 'small' | 'large'
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

  return (
    <TouchableOpacity
      style={[
        styles.toolButton,
        { padding: sizeStyles.padding },
        accessibilityMode && styles.highContrastButton
      ]}
      onPress={() => onPress(tool)}
      accessibilityLabel={`${tool.title}: ${tool.description}`}
      accessibilityRole="button"
      accessibilityHint="Tap to use this coping tool"
      activeOpacity={0.7}
    >
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
      
      {tool.autismSpecific && (
        <View style={styles.autismBadge}>
          <Text style={styles.autismBadgeText}>🧭</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toolButton: {
    backgroundColor: THEME.primary.white,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6, // Tighter spacing for mobile
    shadowColor: THEME.primary.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  highContrastButton: {
    backgroundColor: THEME.accessibility.highContrast.background,
    borderWidth: 2,
    borderColor: THEME.accessibility.highContrast.primary,
  },
  toolIcon: {
    marginRight: 15,
    width: 50,
    textAlign: 'center',
  },
  toolText: {
    flex: 1,
  },
  toolTitle: {
    fontWeight: '700',
    color: THEME.text.primary,
    marginBottom: 4,
    lineHeight: 22,
  },
  toolDescription: {
    color: THEME.text.secondary,
    lineHeight: 18,
    marginBottom: 2,
  },
  toolCategory: {
    fontSize: 11,
    color: THEME.text.light,
    fontStyle: 'italic',
    textTransform: 'capitalize',
  },
  autismBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: THEME.semantic.calm,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autismBadgeText: {
    fontSize: 12,
    color: 'white',
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