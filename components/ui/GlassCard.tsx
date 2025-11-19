import { useTheme } from '@/lib/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({ children, style, intensity = 20, onPress }: GlassCardProps) {
  const { theme, colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const Wrapper = onPress ? AnimatedPressable : View;
  const wrapperProps = onPress ? {
    onPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  } : {};

  const gradientColors = theme === 'dark'
    ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as any)
    : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as any);

  return (
    <Wrapper 
      style={[
        styles.container, 
        { borderColor: colors.cardBorder }, 
        style, 
        onPress && animatedStyle
      ]} 
      {...wrapperProps}
    >
      <BlurView intensity={intensity} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    overflow: 'hidden',
  },
  gradient: {
    padding: 24,
  },
});