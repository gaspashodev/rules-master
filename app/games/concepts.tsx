// app/games/concepts.tsx
// VERSION FINALE - Illustration, padding corrigé, stats quiz

import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameInfoCard } from '../../components/game/GameInfoCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useGame, useUserStats } from '../../lib/hooks/useGame';
import { haptics } from '../../lib/services/haptics';
import { quizHistoryService } from '../../lib/services/quiz-history';

export default function ConceptsScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { data: game, refetch, isLoading } = useGame('clank-001');
  const { data: stats, refetch: refetchStats } = useUserStats();
  
  // Stats des quiz
  const [quizPassedCount, setQuizPassedCount] = useState(0);
  const [totalQuizCount, setTotalQuizCount] = useState(0);

  // Charger les stats au focus
  useFocusEffect(
    useCallback(() => {
      refetch();
      refetchStats();
    }, [refetch, refetchStats])
  );

  // Charger les stats quiz quand le game est disponible
  React.useEffect(() => {
    if (game) {
      loadQuizStats();
    }
  }, [game]);

  const loadQuizStats = async () => {
    if (!game) return;
    
    try {
      let passed = 0;
      const total = game.concepts.length;
      
      for (const concept of game.concepts) {
        const hasPassed = await quizHistoryService.hasPassedQuiz(concept.id);
        if (hasPassed) passed++;
      }
      
      setQuizPassedCount(passed);
      setTotalQuizCount(total);
    } catch (error) {
      // Silencieux
    }
  };

  if (isLoading || !game) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <LoadingState colors={colors} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const completedCount = game.concepts.filter((c) => c.completed).length;
  const progress = Math.round((completedCount / game.concepts.length) * 100);
  const quizProgress = totalQuizCount > 0 
    ? Math.round((quizPassedCount / totalQuizCount) * 100) 
    : 0;

  const handleConceptPress = (conceptId: string, locked: boolean) => {
    if (locked) {
      haptics.warning();
      return;
    }
    haptics.medium();
    router.push({
      pathname: '/games/lesson',
      params: { conceptId },
    });
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Header avec illustration */}
        <Animated.View entering={FadeIn.duration(400)}>
          {/* Bouton retour */}
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
          </Pressable>
          
          {/* Hero image du jeu */}
          <View style={styles.heroContainer}>
            <View style={[styles.heroImageWrapper, { borderColor: colors.cardBorder }]}>
              <Image
                source={{ uri: game.coverImageUrl }}
                style={styles.heroImage}
                contentFit="cover"
                transition={400}
              />
              {/* Gradient overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.heroGradient}
              />
              {/* Titre superposé */}
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{game.name}</Text>
                <Text style={styles.heroSubtitle}>{game.description}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Content scrollable */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Game Info Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <GameInfoCard game={game} />
          </Animated.View>

          {/* Progress Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)}>
            <View style={[styles.progressCard, { borderColor: colors.cardBorder }]}>
              <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                <LinearGradient
                  colors={
                    theme === 'dark'
                      ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                      : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
                  }
                  style={styles.progressContent}
                >
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                      📚 Progression
                    </Text>
                    <Text style={[styles.progressPercent, { color: colors.text }]}>{progress}%</Text>
                  </View>
                  <View style={[styles.progressBarBg, { backgroundColor: colors.cardBorder }]}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        { width: `${progress}%`, backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                  <Text style={[styles.progressSubtext, { color: colors.textTertiary }]}>
                    {completedCount} / {game.concepts.length} concepts terminés
                  </Text>
                </LinearGradient>
              </BlurView>
            </View>
          </Animated.View>

          {/* Section title */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>
              PARCOURS D'APPRENTISSAGE
            </Text>
          </Animated.View>

          {/* Concepts List */}
          {game.concepts.map((concept, index) => (
            <ConceptCard
              key={concept.id}
              concept={concept}
              index={index}
              colors={colors}
              theme={theme}
              onPress={() => handleConceptPress(concept.id, concept.locked)}
            />
          ))}

          {/* IMPORTANT: Spacer pour éviter la superposition avec le footer */}
          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Stats Footer - fixe en bas */}
        <Animated.View entering={FadeIn.duration(400).delay(600)} style={styles.footer}>
          <View style={[styles.statsCard, { borderColor: colors.cardBorder }]}>
            <BlurView intensity={40} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
              <LinearGradient
                colors={
                  theme === 'dark'
                    ? ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.6)']
                    : ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']
                }
                style={styles.statsContent}
              >
                {/* XP Total */}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>
                    {stats?.totalXP || 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>XP</Text>
                </View>
                
                <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                
                {/* Quiz réussis (remplace série) */}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.success }]}>
                    {quizProgress}%
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Quiz</Text>
                </View>
                
                <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
                
                {/* Concepts finis */}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {completedCount}/{game.concepts.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Finis</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}

// ========================================
// CONCEPT CARD
// ========================================

interface ConceptCardProps {
  concept: any;
  index: number;
  colors: any;
  theme: string;
  onPress: () => void;
}

function ConceptCard({ concept, index, colors, theme, onPress }: ConceptCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!concept.locked) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(250 + 40 * index)}
      style={[styles.conceptWrapper, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={concept.locked}
      >
        <View style={[styles.conceptCard, { borderColor: colors.cardBorder }]}>
          <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                  : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
              }
              style={[styles.conceptContent, concept.locked && styles.conceptLocked]}
            >
              <View style={styles.conceptLeft}>
                {/* Icon */}
                <View
                  style={[
                    styles.conceptIcon,
                    {
                      backgroundColor: concept.completed
                        ? colors.success + '25'
                        : concept.locked
                        ? colors.locked + '25'
                        : colors.difficultyBg,
                      borderColor: concept.completed
                        ? colors.success + '50'
                        : concept.locked
                        ? colors.locked + '50'
                        : colors.difficultyBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.conceptIconText,
                      {
                        color: concept.completed
                          ? colors.success
                          : concept.locked
                          ? colors.locked
                          : colors.primary,
                      },
                    ]}
                  >
                    {concept.completed ? '✓' : concept.locked ? '🔒' : index + 1}
                  </Text>
                </View>

                {/* Info */}
                <View style={styles.conceptInfo}>
                  <Text
                    style={[
                      styles.conceptName,
                      { color: concept.locked ? colors.textTertiary : colors.text },
                    ]}
                  >
                    {concept.name}
                  </Text>
                  <Text style={[styles.conceptDescription, { color: colors.textSecondary }]}>
                    {concept.description}
                  </Text>
                  <View style={styles.conceptMeta}>
                    <Text style={[styles.conceptMetaText, { color: colors.textTertiary }]}>
                      {concept.estimatedTime} min
                    </Text>
                    <Text style={[styles.conceptMetaText, { color: colors.textTertiary }]}>
                      •
                    </Text>
                    <Text style={[styles.conceptMetaText, { color: colors.textTertiary }]}>
                      {'★'.repeat(concept.difficulty)}{'☆'.repeat(3 - concept.difficulty)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Arrow */}
              {!concept.locked && (
                <Text style={[styles.conceptArrow, { color: colors.textTertiary }]}>→</Text>
              )}
            </LinearGradient>
          </BlurView>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ========================================
// LOADING STATE
// ========================================

function LoadingState({ colors }: { colors: any }) {
  return (
    <View style={styles.loadingContainer}>
      <Animated.View entering={FadeIn.duration(600)} style={styles.loadingContent}>
        <Text style={styles.loadingIcon}>🐉</Text>
        <Text style={[styles.loadingTitle, { color: colors.text }]}>Chargement...</Text>
        <Text style={[styles.loadingSubtitle, { color: colors.textTertiary }]}>
          Préparation du donjon
        </Text>
      </Animated.View>
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 14,
  },

  // Hero image
  heroContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  heroImageWrapper: {
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  scrollContent: {
    paddingHorizontal: 24,
  },

  blur: {
    overflow: 'hidden',
  },

  // Progress Card
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 20,
  },
  progressContent: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Section Header
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },

  // Concept Card
  conceptWrapper: {
    marginBottom: 10,
  },
  conceptCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  conceptContent: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  conceptLocked: {
    opacity: 0.5,
  },
  conceptLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 14,
  },
  conceptIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptIconText: {
    fontSize: 16,
    fontWeight: '700',
  },
  conceptInfo: {
    flex: 1,
  },
  conceptName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  conceptDescription: {
    fontSize: 12,
    marginBottom: 6,
  },
  conceptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conceptMetaText: {
    fontSize: 11,
  },
  conceptArrow: {
    fontSize: 18,
  },

  // Footer Stats
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  statsContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  loadingSubtitle: {
    fontSize: 14,
  },
});