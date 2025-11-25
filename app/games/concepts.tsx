// app/games/concepts.tsx
// VERSION FINALE - Stats de quiz au lieu de série + XP des quiz inclus

import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { getQuizByConcept, hasQuiz } from '../../lib/data/clank-quizzes';
import { useGame } from '../../lib/hooks/useGame';
import { quizHistoryService } from '../../lib/services/quiz-history';

export default function ConceptsScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { data: game, refetch, isLoading } = useGame('clank-001');

  // Stats globales incluant les quiz
  const [globalStats, setGlobalStats] = useState({
    totalXP: 0,
    quizAverage: 0,
    completedCount: 0,
  });

  // Scores de quiz par concept
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  // ✅ CORRECTION : Passer game en paramètre pour éviter la boucle infinie
  const loadAllStats = useCallback(async (gameData: typeof game) => {
    if (!gameData) return;

    try {
      // 1. Calculer l'XP total (leçons + quiz)
      const lessonXP = gameData.concepts.filter(c => c.completed).length * 50; // 50 XP par leçon
      let quizXP = 0;
      
      // 2. Charger tous les scores de quiz
      const scores: Record<string, number> = {};
      let totalQuestions = 0;
      let totalCorrectAnswers = 0;
      
      for (const concept of gameData.concepts) {
        if (!hasQuiz(concept.id)) continue;
        
        const bestResult = await quizHistoryService.getBestScore(concept.id);
        
        if (bestResult) {
          scores[concept.id] = bestResult.percentage;
          
          // Ajouter l'XP bonus si score parfait
          if (bestResult.perfectScore && bestResult.xpEarned > 0) {
            quizXP += bestResult.xpEarned;
          }
          
          // ✅ NOUVEAU : Calculer les bonnes réponses
          totalQuestions += bestResult.totalQuestions;
          totalCorrectAnswers += bestResult.score;
        } else {
          // Quiz pas encore tenté : compter les questions à 0
          const quiz = getQuizByConcept(concept.id);
          if (quiz) {
            totalQuestions += quiz.questions.length;
            // totalCorrectAnswers += 0 (implicite)
          }
        }
      }

      setQuizScores(scores);

      // 3. ✅ NOUVEAU : Calculer le pourcentage de complétion globale (arrondi inférieur)
      const quizCompletion = totalQuestions > 0
        ? Math.floor((totalCorrectAnswers / totalQuestions) * 100)
        : 0;

      // 4. Mettre à jour les stats globales
      setGlobalStats({
        totalXP: lessonXP + quizXP,
        quizAverage: quizCompletion, // Renommé mais garde la même clé
        completedCount: gameData.concepts.filter(c => c.completed).length,
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []); // ✅ Pas de dépendances = fonction stable

  // Charger les stats quand game change
  React.useEffect(() => {
    if (game) {
      loadAllStats(game);
    }
  }, [game, loadAllStats]);

  // Refetch quand l'écran revient au focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading || !game) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>
            Chargement...
          </Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const completedCount = game.concepts.filter((c) => c.completed).length;
  const progress = Math.round((completedCount / game.concepts.length) * 100);

  const handleConceptPress = (conceptId: string, locked: boolean) => {
    if (locked) return;
    router.push({
      pathname: '/games/lesson',
      params: { conceptId },
    });
  };

  // Helper pour obtenir l'icône du badge de quiz
  const getQuizBadgeIcon = (score: number) => {
    if (score === 100) return '⭐'; // Score parfait
    if (score >= 60) return '✓';   // Réussi
    return '✗';                     // Non réussi
  };

  // Helper pour obtenir la couleur du badge de quiz
  const getQuizBadgeColor = (score: number) => {
    if (score === 100) return colors.success;  // Vert
    if (score >= 60) return '#f59e0b';         // Orange
    return '#ef4444';                          // Rouge
  };

  // Compter les quiz complétés
  const [quizCompletedCount, setQuizCompletedCount] = React.useState(0);

  React.useEffect(() => {
    const countCompletedQuizzes = async () => {
      let count = 0;
      for (const concept of game.concepts) {
        const passed = await quizHistoryService.hasPassedQuiz(concept.id);
        if (passed) count++;
      }
      setQuizCompletedCount(count);
    };
    countCompletedQuizzes();
  }, [game]);

  // Progression globale : leçons + quiz
  const totalItems = game.concepts.length * 2; // 6 leçons + 6 quiz = 12
  const completedItems = completedCount + quizCompletedCount;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
    {/* Header */}
    <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
      </Pressable>

      {/* Image de couverture + Titre */}
      <View style={styles.headerTop}>
        <Animated.Image
          source={
            typeof game.coverImageUrl === 'string'
              ? { uri: game.coverImageUrl }
              : game.coverImageUrl
          }
          style={styles.coverImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)'] as any}
          style={styles.coverOverlay}
        />
        <View style={styles.titleContainer}>
          <Text style={[styles.gameTitle, { color: '#ffffff' }]}>{game.name}</Text>
          <Text style={[styles.gameSubtitle, { color: 'rgba(255, 255, 255, 0.8)' }]}>
            {game.description}
          </Text>
        </View>
      </View>

      {/* Encart infos essentielles */}
      <View style={[styles.infoCard, { borderColor: colors.cardBorder }]}>
        <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.infoBlur}>
          <LinearGradient
            colors={
              theme === 'dark'
                ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
            }
            style={styles.infoContent}
          >
            {/* Ligne 1 : Joueurs, Durée, Âge */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>👥</Text>
                <Text style={[styles.infoText, { color: colors.text }]}>{game.playerCount}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⏱️</Text>
                <Text style={[styles.infoText, { color: colors.text }]}>{game.playTime}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🎂</Text>
                <Text style={[styles.infoText, { color: colors.text }]}>{game.age}+</Text>
              </View>
            </View>

            <View style={[styles.infoDivider, { backgroundColor: colors.cardBorder }]} />

            {/* Ligne 2 : BGG, Règles, Vidéos */}
            <View style={styles.infoRow}>
              {/* BGG Rating */}
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>⭐</Text>
                <Text style={[styles.infoText, { color: colors.text }]}>
                  {game.bggRating}/10
                </Text>
              </View>

              {/* Règles PDF */}
              <Pressable 
                onPress={() => Linking.openURL(game.rulesUrl)}
                style={styles.infoItem}
              >
                <Text style={styles.infoIcon}>📄</Text>
                <Text style={[styles.infoLink, { color: colors.primary }]}>Règles</Text>
              </Pressable>

              {/* Vidéos */}
              <Pressable 
                onPress={() => game.videoUrls[0] && Linking.openURL(game.videoUrls[0])}
                style={styles.infoItem}
              >
                <Text style={styles.infoIcon}>🎬</Text>
                <Text style={[styles.infoLink, { color: colors.primary }]}>Vidéos</Text>
              </Pressable>
            </View>
          </LinearGradient>
        </BlurView>
      </View>

      {/* Barre de progression - Leçons + Quiz */}
      <View style={[styles.progressCard, { borderColor: colors.cardBorder }]}>
        <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.progressBlur}>
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
                Progression globale
              </Text>
              <Text style={[styles.progressPercent, { color: colors.text }]}>{progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: colors.primary }]}
              />
            </View>
            <Text style={[styles.progressDetail, { color: colors.textTertiary }]}>
              {completedCount} leçons + {quizCompletedCount} quiz / 12 total
            </Text>
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>

        {/* Concepts List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {game.concepts.map((concept, index) => {
            const conceptHasQuiz = hasQuiz(concept.id);
            const quizScore = quizScores[concept.id];

            return (
              <Animated.View
                key={concept.id}
                entering={FadeInDown.duration(400).delay(100 * (index + 1))}
                style={styles.conceptWrapper}
              >
                <Pressable
                  onPress={() => handleConceptPress(concept.id, concept.locked)}
                  disabled={concept.locked}
                >
                  <View style={[styles.conceptCard, { borderColor: colors.cardBorder }]}>
                    <BlurView
                      intensity={20}
                      tint={theme === 'dark' ? 'dark' : 'light'}
                      style={styles.conceptBlur}
                    >
                      <LinearGradient
                        colors={
                          theme === 'dark'
                            ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const)
                            : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as const)
                        }
                        style={[styles.conceptContent, concept.locked && styles.conceptLocked]}
                      >
                        <View style={styles.conceptLeft}>
                          <View
                            style={[
                              styles.conceptIcon,
                              {
                                backgroundColor: concept.completed
                                  ? colors.success + '33'
                                  : concept.locked
                                  ? colors.locked + '33'
                                  : colors.difficultyBg,
                              },
                              concept.completed && styles.conceptIconCompleted,
                              concept.locked && styles.conceptIconLocked,
                            ]}
                          >
                            <Text style={[styles.conceptIconText, { color: colors.text }]}>
                              {concept.completed ? '✓' : concept.locked ? '🔒' : index + 1}
                            </Text>
                          </View>
                          <View style={styles.conceptInfo}>
                            <View style={styles.conceptNameRow}>
                              <Text style={[styles.conceptName, { color: colors.text }]}>
                                {concept.name}
                              </Text>
                              {/* Badge de quiz si disponible et tenté */}
                              {conceptHasQuiz && quizScore !== undefined && (
                                <View
                                  style={[
                                    styles.quizBadge,
                                    {
                                      backgroundColor: getQuizBadgeColor(quizScore) + '20',
                                      borderColor: getQuizBadgeColor(quizScore) + '40',
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.quizBadgeText,
                                      { color: getQuizBadgeColor(quizScore) },
                                    ]}
                                  >
                                    {getQuizBadgeIcon(quizScore)} {quizScore}%
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Text style={[styles.conceptDescription, { color: colors.textSecondary }]}>
                              {concept.description}
                            </Text>
                            <View style={styles.conceptMeta}>
                              <Text style={[styles.conceptMetaText, { color: colors.textTertiary }]}>
                                ⏱️ {concept.estimatedTime} min
                              </Text>
                              <Text style={[styles.conceptMetaText, { color: colors.textTertiary }]}>
                                {'⭐'.repeat(concept.difficulty)}
                                {'☆'.repeat(3 - concept.difficulty)}
                              </Text>
                              {conceptHasQuiz && (
                                <Text style={[styles.conceptMetaText, { color: colors.textTertiary }]}>
                                  🎮 Quiz
                                </Text>
                              )}
                            </View>
                          </View>
                        </View>
                        {!concept.locked && (
                          <Text style={[styles.conceptArrow, { color: colors.textTertiary }]}>→</Text>
                        )}
                      </LinearGradient>
                    </BlurView>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Ombre subtile pour séparer les stats du contenu */}
        <View
          style={[
            styles.footerShadow,
            {
              shadowColor: colors.background,
            },
          ]}
        />

        {/* Stats Footer */}
        <Animated.View entering={FadeIn.duration(400).delay(700)} style={styles.footer}>
          <View style={[styles.statsCard, { borderColor: colors.cardBorder }]}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.statsBlur}>
              <LinearGradient
                colors={
                  theme === 'dark'
                    ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const)
                    : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as const)
                }
                style={styles.statsContent}
              >
                {/* XP Total (leçons + quiz) */}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {quizCompletedCount}/6
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Quiz réussis</Text>
                </View>

                {/* ✅ Pourcentage de complétion global de tous les quiz */}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {globalStats.quizAverage > 0 ? `${globalStats.quizAverage}%` : '-'}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Complétion</Text>
                </View>

                {/* Concepts complétés */}
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {completedCount}/{game.concepts.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Complétés</Text>
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 16,
  },
  infoBlur: {
    overflow: 'hidden',
  },
  infoContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  infoItem: {
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoLink: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  infoDivider: {
    height: 1,
    marginVertical: 12,
  },
  progressDetail: {
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  progressBlur: {
    overflow: 'hidden',
  },
  progressContent: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  conceptWrapper: {
    marginBottom: 12,
  },
  conceptCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  conceptBlur: {
    overflow: 'hidden',
  },
  conceptContent: {
    padding: 16,
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
    gap: 16,
  },
  conceptIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptIconCompleted: {},
  conceptIconLocked: {},
  conceptIconText: {
    fontSize: 22,
    fontWeight: '700',
  },
  conceptInfo: {
    flex: 1,
  },
  conceptNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  conceptName: {
    fontSize: 16,
    fontWeight: '700',
  },
  quizBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  quizBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  conceptDescription: {
    fontSize: 12,
    marginBottom: 6,
  },
  conceptMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  conceptMetaText: {
    fontSize: 11,
  },
  conceptArrow: {
    fontSize: 24,
  },
  footerShadow: {
    marginBottom: -20,
    height: 40,
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
    elevation: 5,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statsCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  statsBlur: {
    overflow: 'hidden',
  },
  statsContent: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
  },
});