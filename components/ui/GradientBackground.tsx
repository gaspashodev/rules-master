import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Fond noir de base */}
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#000000']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Orbes animés */}
      <AnimatedOrb 
        colors={['#3b82f6', '#8b5cf6']} 
        style={styles.orb1}
      />
      <AnimatedOrb 
        colors={['#ec4899', '#f43f5e']} 
        style={styles.orb2}
        delay={5000}
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
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = withRepeat(
      withSequence(
        withTiming(30, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-20, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    const translateY = withRepeat(
      withSequence(
        withTiming(-30, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
        withTiming(20, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    return {
      transform: [
        { translateX },
        { translateY },
      ],
    };
  });

  return (
    <Animated.View style={[style, animatedStyle]}>
      <LinearGradient
        colors={colors}
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