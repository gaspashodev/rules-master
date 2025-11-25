// components/ui/LoadingSpinner.tsx
// Spinner de chargement élégant avec animations

import { useTheme } from '@/lib/contexts/ThemeContext';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
    Easing,
    FadeIn,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  style?: ViewStyle;
}

export function LoadingSpinner({ 
  size = 'medium', 
  message,
  style,
}: LoadingSpinnerProps) {
  const { colors } = useTheme();
  
  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { dotSize: 8, gap: 6, container: 40 };
      case 'large':
        return { dotSize: 14, gap: 10, container: 70 };
      default:
        return { dotSize: 10, gap: 8, container: 50 };
    }
  };

  const config = getSizeConfig();

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={[styles.container, style]}
    >
      <View style={[styles.dotsContainer, { height: config.container }]}>
        <LoadingDot 
          size={config.dotSize} 
          color={colors.primary} 
          delay={0} 
        />
        <View style={{ width: config.gap }} />
        <LoadingDot 
          size={config.dotSize} 
          color={colors.primary} 
          delay={150} 
        />
        <View style={{ width: config.gap }} />
        <LoadingDot 
          size={config.dotSize} 
          color={colors.primary} 
          delay={300} 
        />
      </View>
      
      {message && (
        <Animated.Text 
          entering={FadeIn.duration(400).delay(200)}
          style={[styles.message, { color: colors.textSecondary }]}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
}

interface LoadingDotProps {
  size: number;
  color: string;
  delay: number;
}

function LoadingDot({ size, color, delay }: LoadingDotProps) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) }),
          withTiming(0.6, { duration: 400, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.4, { duration: 400 })
        ),
        -1,
        false
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

// ========================================
// LOADING STATE COMPONENT
// ========================================

interface LoadingStateProps {
  icon?: string;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function LoadingState({ 
  icon = '⏳', 
  title = 'Chargement...', 
  subtitle,
  style,
}: LoadingStateProps) {
  const { colors } = useTheme();
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);

  useEffect(() => {
    // Petite animation de pulse sur l'icône
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
    ],
  }));

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={[styles.loadingStateContainer, style]}
    >
      <Animated.Text style={[styles.loadingIcon, iconAnimatedStyle]}>
        {icon}
      </Animated.Text>
      
      <Text style={[styles.loadingTitle, { color: colors.text }]}>
        {title}
      </Text>
      
      {subtitle && (
        <Text style={[styles.loadingSubtitle, { color: colors.textTertiary }]}>
          {subtitle}
        </Text>
      )}
      
      <LoadingSpinner size="small" style={{ marginTop: 24 }} />
    </Animated.View>
  );
}

// ========================================
// SKELETON LOADER
// ========================================

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const { colors, theme } = useTheme();
  const shimmerPosition = useSharedValue(-1);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + shimmerPosition.value * 0.3,
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.08)',
        },
        shimmerStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {},
  message: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Loading State
  loadingStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});