// components/ui/Confetti.tsx
// Composant de confetti pour les célébrations 🎉

import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Couleurs des confettis
const CONFETTI_COLORS = [
  '#8b5cf6', // violet
  '#a78bfa', // violet clair
  '#10b981', // vert
  '#f59e0b', // orange
  '#ec4899', // rose
  '#3b82f6', // bleu
  '#fbbf24', // jaune
];

// Formes des confettis
const SHAPES = ['square', 'circle', 'rectangle'] as const;
type Shape = typeof SHAPES[number];

interface ConfettiPieceProps {
  index: number;
  color: string;
  shape: Shape;
  startX: number;
  delay: number;
}

function ConfettiPiece({ index, color, shape, startX, delay }: ConfettiPieceProps) {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Animation d'entrée
    scale.value = withDelay(
      delay,
      withTiming(1, { duration: 200, easing: Easing.out(Easing.back(2)) })
    );

    // Animation de chute
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration: 3000 + Math.random() * 2000,
        easing: Easing.in(Easing.quad),
      })
    );

    // Mouvement latéral oscillant
    const xOffset = (Math.random() - 0.5) * 200;
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(startX + xOffset, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(startX - xOffset * 0.5, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(startX + xOffset * 0.3, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      )
    );

    // Rotation
    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 3), {
        duration: 3000 + Math.random() * 2000,
        easing: Easing.linear,
      })
    );

    // Fade out à la fin
    opacity.value = withDelay(
      delay + 2500,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getShapeStyle = () => {
    switch (shape) {
      case 'circle':
        return { width: 10, height: 10, borderRadius: 5 };
      case 'rectangle':
        return { width: 6, height: 14, borderRadius: 2 };
      case 'square':
      default:
        return { width: 10, height: 10, borderRadius: 2 };
    }
  };

  return (
    <Animated.View
      style={[
        styles.confetti,
        { backgroundColor: color },
        getShapeStyle(),
        animatedStyle,
      ]}
    />
  );
}

interface ConfettiProps {
  isActive: boolean;
  count?: number;
}

export function Confetti({ isActive, count = 50 }: ConfettiProps) {
  if (!isActive) return null;

  const pieces = Array.from({ length: count }, (_, i) => ({
    index: i,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    startX: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 500,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.index}
          index={piece.index}
          color={piece.color}
          shape={piece.shape}
          startX={piece.startX}
          delay={piece.delay}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
});