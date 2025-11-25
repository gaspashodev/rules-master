// components/ui/Toast.tsx
// Composant Toast pour les notifications temporaires

import { useTheme } from '@/lib/contexts/ThemeContext';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming
} from 'react-native-reanimated';

export type ToastType = 'success' | 'error' | 'info' | 'xp' | 'streak' | 'unlock';

interface ToastProps {
  visible: boolean;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onHide?: () => void;
}

export function Toast({
  visible,
  type = 'info',
  title,
  message,
  duration = 3000,
  onHide,
}: ToastProps) {
  const { colors, theme } = useTheme();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      // Animation d'entrée
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, { damping: 12 });

      // Animation de sortie après durée
      translateY.value = withDelay(
        duration,
        withTiming(-100, { duration: 300 }, (finished) => {
          if (finished && onHide) {
            runOnJS(onHide)();
          }
        })
      );
      opacity.value = withDelay(duration, withTiming(0, { duration: 300 }));
    } else {
      translateY.value = -100;
      opacity.value = 0;
      scale.value = 0.8;
    }
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'xp':
        return '⭐';
      case 'streak':
        return '🔥';
      case 'unlock':
        return '🔓';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getGradientColors = () => {
    switch (type) {
      case 'success':
        return theme === 'dark'
          ? ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)']
          : ['rgba(16, 185, 129, 0.15)', 'rgba(16, 185, 129, 0.05)'];
      case 'error':
        return theme === 'dark'
          ? ['rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)']
          : ['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)'];
      case 'xp':
        return theme === 'dark'
          ? ['rgba(251, 191, 36, 0.2)', 'rgba(251, 191, 36, 0.1)']
          : ['rgba(251, 191, 36, 0.15)', 'rgba(251, 191, 36, 0.05)'];
      case 'streak':
        return theme === 'dark'
          ? ['rgba(249, 115, 22, 0.2)', 'rgba(249, 115, 22, 0.1)']
          : ['rgba(249, 115, 22, 0.15)', 'rgba(249, 115, 22, 0.05)'];
      case 'unlock':
        return theme === 'dark'
          ? ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.1)']
          : ['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)'];
      default:
        return theme === 'dark'
          ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
          : ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.05)'];
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return colors.success + '40';
      case 'error':
        return '#ef4444' + '40';
      case 'xp':
        return '#fbbf24' + '40';
      case 'streak':
        return '#f97316' + '40';
      case 'unlock':
        return colors.primary + '40';
      default:
        return colors.cardBorder;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={[styles.toast, { borderColor: getBorderColor() }]}>
        <BlurView intensity={30} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
          <LinearGradient
            colors={getGradientColors() as any}
            style={styles.content}
          >
            <Text style={styles.icon}>{getIcon()}</Text>
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              {message && (
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  {message}
                </Text>
              )}
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>
  );
}

// ========================================
// HOOK POUR UTILISER LES TOASTS
// ========================================

interface ToastState {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
}

export function useToast() {
  const [toast, setToast] = React.useState<ToastState>({
    visible: false,
    type: 'info',
    title: '',
    message: undefined,
  });

  const show = (type: ToastType, title: string, message?: string) => {
    setToast({ visible: true, type, title, message });
  };

  const hide = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  const showSuccess = (title: string, message?: string) => show('success', title, message);
  const showError = (title: string, message?: string) => show('error', title, message);
  const showXP = (amount: number) => show('xp', `+${amount} XP`, 'Continue comme ça !');
  const showStreak = (days: number) => show('streak', `${days} jours de suite !`, 'Ta série continue !');
  const showUnlock = (conceptName: string) => show('unlock', 'Nouveau concept !', `${conceptName} débloqué`);

  return {
    toast,
    show,
    hide,
    showSuccess,
    showError,
    showXP,
    showStreak,
    showUnlock,
    ToastComponent: () => (
      <Toast
        visible={toast.visible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onHide={hide}
      />
    ),
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    zIndex: 9999,
  },
  toast: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  icon: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  message: {
    fontSize: 13,
    marginTop: 2,
  },
});