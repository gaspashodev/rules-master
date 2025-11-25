// components/ui/Badge.tsx
// Badges animés pour XP, streak, accomplissements

import { useTheme } from '@/lib/contexts/ThemeContext';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

type BadgeVariant = 'xp' | 'streak' | 'completed' | 'locked' | 'new' | 'bonus' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: string;
  animated?: boolean;
  pulse?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

export function Badge({ 
  variant = 'default', 
  children, 
  icon,
  animated = true,
  pulse = false,
  style,
  size = 'medium',
}: BadgeProps) {
  const { colors } = useTheme();
  const scale = useSharedValue(animated ? 0.8 : 1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    }
    
    if (pulse) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [animated, pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * pulseScale.value },
    ],
  }));

  const getVariantStyles = () => {
    switch (variant) {
      case 'xp':
        return {
          backgroundColor: colors.primary + '20',
          borderColor: colors.primary + '40',
          textColor: colors.primary,
          iconDefault: '⭐',
        };
      case 'streak':
        return {
          backgroundColor: '#f97316' + '20',
          borderColor: '#f97316' + '40',
          textColor: '#f97316',
          iconDefault: '🔥',
        };
      case 'completed':
        return {
          backgroundColor: colors.success + '20',
          borderColor: colors.success + '40',
          textColor: colors.success,
          iconDefault: '✓',
        };
      case 'locked':
        return {
          backgroundColor: colors.locked + '20',
          borderColor: colors.locked + '40',
          textColor: colors.locked,
          iconDefault: '🔒',
        };
      case 'new':
        return {
          backgroundColor: '#3b82f6' + '20',
          borderColor: '#3b82f6' + '40',
          textColor: '#3b82f6',
          iconDefault: '✨',
        };
      case 'bonus':
        return {
          backgroundColor: '#fbbf24' + '20',
          borderColor: '#fbbf24' + '40',
          textColor: '#fbbf24',
          iconDefault: '🎁',
        };
      default:
        return {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
          textColor: colors.text,
          iconDefault: '',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 4,
          paddingHorizontal: 8,
          fontSize: 11,
          iconSize: 12,
          borderRadius: 8,
        };
      case 'large':
        return {
          paddingVertical: 10,
          paddingHorizontal: 16,
          fontSize: 16,
          iconSize: 20,
          borderRadius: 16,
        };
      default:
        return {
          paddingVertical: 6,
          paddingHorizontal: 12,
          fontSize: 13,
          iconSize: 14,
          borderRadius: 12,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const displayIcon = icon || variantStyles.iconDefault;

  return (
    <Animated.View
      style={[
        styles.badge,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderColor: variantStyles.borderColor,
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          borderRadius: sizeStyles.borderRadius,
        },
        animatedStyle,
        style,
      ]}
    >
      {displayIcon && (
        <Text style={{ fontSize: sizeStyles.iconSize, marginRight: 4 }}>
          {displayIcon}
        </Text>
      )}
      {typeof children === 'string' ? (
        <Text 
          style={[
            styles.text, 
            { color: variantStyles.textColor, fontSize: sizeStyles.fontSize }
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Animated.View>
  );
}

// ========================================
// XP BADGE ANIMÉ
// ========================================

interface XPBadgeProps {
  value: number;
  showPlus?: boolean;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function XPBadge({ 
  value, 
  showPlus = false, 
  animated = true,
  size = 'medium',
  style,
}: XPBadgeProps) {
  const scale = useSharedValue(animated ? 0 : 1);
  const rotate = useSharedValue(animated ? -10 : 0);

  useEffect(() => {
    if (animated) {
      scale.value = withDelay(100, withSpring(1, { damping: 10, stiffness: 150 }));
      rotate.value = withDelay(100, withSpring(0, { damping: 12 }));
    }
  }, [animated, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Badge variant="xp" size={size} animated={false} style={style}>
        {showPlus ? `+${value}` : `${value}`} XP
      </Badge>
    </Animated.View>
  );
}

// ========================================
// STREAK BADGE ANIMÉ
// ========================================

interface StreakBadgeProps {
  value: number;
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function StreakBadge({ 
  value, 
  animated = true,
  size = 'medium',
  style,
}: StreakBadgeProps) {
  const scale = useSharedValue(animated ? 0 : 1);
  const fireScale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      scale.value = withSpring(1, { damping: 10, stiffness: 150 });
    }

    // Animation de flamme
    fireScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
  }, [animated, value]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }));

  return (
    <Animated.View style={containerStyle}>
      <Badge 
        variant="streak" 
        size={size} 
        animated={false} 
        icon=""
        style={style}
      >
        <View style={styles.streakContent}>
          <Animated.Text style={[styles.fireIcon, fireStyle]}>🔥</Animated.Text>
          <Text style={styles.streakText}>{value}</Text>
        </View>
      </Badge>
    </Animated.View>
  );
}

// ========================================
// NOTIFICATION BADGE (petit point rouge)
// ========================================

interface NotificationBadgeProps {
  count?: number;
  visible?: boolean;
  style?: ViewStyle;
}

export function NotificationBadge({ 
  count, 
  visible = true,
  style,
}: NotificationBadgeProps) {
  const scale = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0, { damping: 12, stiffness: 200 });
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  if (!visible && scale.value === 0) return null;

  return (
    <Animated.View style={[styles.notificationBadge, animatedStyle, style]}>
      {count !== undefined && count > 0 && (
        <Text style={styles.notificationText}>
          {count > 99 ? '99+' : count}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  fireIcon: {
    fontSize: 14,
  },
  streakText: {
    color: '#f97316',
    fontWeight: '700',
    fontSize: 13,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});