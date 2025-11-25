// components/ui/Button.tsx
// VERSION AMÉLIORÉE - Avec micro-interactions smooth

import { useTheme } from '@/lib/contexts/ThemeContext';
import { haptics } from '@/lib/services/haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  hapticFeedback?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ 
  onPress, 
  children, 
  variant = 'primary', 
  size = 'medium',
  style, 
  disabled = false,
  loading = false,
  hapticFeedback = true,
}: ButtonProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { 
      damping: 15, 
      stiffness: 300,
    });
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { 
      damping: 15, 
      stiffness: 300,
    });
    opacity.value = withTiming(1, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    if (hapticFeedback) {
      haptics.light();
    }
    onPress();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingVertical: 22,
          paddingHorizontal: 36,
          borderRadius: 18,
        };
      default:
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          borderRadius: 16,
        };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 14;
      case 'large':
        return 18;
      default:
        return 16;
    }
  };

  const sizeStyles = getSizeStyles();
  const fontSize = getFontSize();

  // PRIMARY BUTTON
  if (variant === 'primary') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[animatedStyle, style, (disabled || loading) && { opacity: 0.5 }]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight] as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primaryButton, sizeStyles]}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : typeof children === 'string' ? (
            <Text style={[styles.primaryText, { fontSize }]}>{children}</Text>
          ) : (
            children
          )}
        </LinearGradient>
      </AnimatedPressable>
    );
  }

  // SECONDARY BUTTON
  if (variant === 'secondary') {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.secondaryButton, 
          sizeStyles,
          { 
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
          animatedStyle, 
          style,
          (disabled || loading) && { opacity: 0.5 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : typeof children === 'string' ? (
          <Text style={[styles.secondaryText, { color: colors.text, fontSize }]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </AnimatedPressable>
    );
  }

  // GHOST BUTTON
  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.ghostButton, 
        sizeStyles,
        animatedStyle, 
        style,
        (disabled || loading) && { opacity: 0.5 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textSecondary} size="small" />
      ) : typeof children === 'string' ? (
        <Text style={[styles.ghostText, { color: colors.textSecondary, fontSize }]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
  },
  secondaryText: {
    fontWeight: '500',
  },
  ghostButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ghostText: {
    fontWeight: '500',
  },
});