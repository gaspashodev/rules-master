import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/contexts/ThemeContext';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Fond de base */}
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary, colors.background] as any}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Orbes animés */}
      <AnimatedOrb 
        colors={[colors.orb1Start, colors.orb1End]} 
        style={styles.orb1}
      />
      <AnimatedOrb 
        colors={[colors.orb2Start, colors.orb2End]} 
        style={styles.orb2}
        delay={2000}
      />
      
      {children}
    </View>
  );
}

interface AnimatedOrbProps {
  colors: string[];
  style: any;
  delay?: number;
}

function AnimatedOrb({ colors, style, delay = 0 }: AnimatedOrbProps) {
  const translateX = useSharedValue(-30);
  const translateY = useSharedValue(-30);

  React.useEffect(() => {
    // Mouvement horizontal : -30 ↔ +30
    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(30, { 
          duration: 8000, 
          easing: Easing.inOut(Easing.ease) 
        }),
        -1,
        true // reverse
      )
    );

    // Mouvement vertical : -30 ↔ +30
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(30, { 
          duration: 6000, 
          easing: Easing.inOut(Easing.ease) 
        }),
        -1,
        true
      )
    );
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>
      <LinearGradient
        colors={colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.orbGradient}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    opacity: 0.3,
  },
  orb2: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
  },
});