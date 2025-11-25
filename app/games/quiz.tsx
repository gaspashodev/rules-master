// app/games/quiz.tsx
// VERSION SIMPLIFIÉE - Sans motivational messages, avec confetti et haptics

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizCard } from '../../components/quiz/QuizCard';
import { Button } from '../../components/ui/Button';
import { Confetti } from '../../components/ui/Confetti';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { CLANK_GAME } from '../../lib/data/clank-mock';
import { getQuizByConcept } from '../../lib/data/clank-quizzes';
import { useCompleteLesson } from '../../lib/hooks/useGame';
import { authService } from '../../lib/services/auth';
import { haptics } from '../../lib/services/haptics';
import { quizHistoryService } from '../../lib/services/quiz-history';
import type { QuizAnswer, QuizState } from '../../lib/types/quiz';
import type { QuizResult } from '../../lib/types/quiz-history';

// Fonction pour générer un UUID v4 valide
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function QuizScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { conceptId } = useLocalSearchParams<{ conceptId: string }>();
  const { completeLesson } = useCompleteLesson();

  const concept = CLANK_GAME.concepts.find(c => c.id === conceptId);
  const quiz = conceptId ? getQuizByConcept(conceptId) : undefined;

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: [],
    startedAt: new Date(),
    score: 0,
  });

  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Animations
  const iconScale = useSharedValue(0);
  const iconRotate = useSharedValue(0);
  const scoreScale = useSharedValue(0.8);

  if (!concept || !quiz) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>
            Quiz non trouvé
          </Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === quiz.questions.length - 1;

  const calculateResults = () => {
    const percentage = Math.round((quizState.score / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passingScore;
    const perfectScore = percentage === 100;
    const xpEarned = perfectScore ? quiz.bonusXP : 0;
    return { percentage, passed, perfectScore, xpEarned };
  };

  const handleAnswer = (optionId: string) => {
    const isCorrect = currentQuestion.options.find(o => o.id === optionId)?.isCorrect || false;
    
    // Haptic feedback
    if (isCorrect) {
      haptics.success();
    } else {
      haptics.error();
    }

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
      timeSpent: 0,
    };

    setQuizState(prev => ({
      ...prev,
      answers: [...prev.answers, answer],
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

    setShowResult(true);
  };

  const handleNext = () => {
    haptics.light();
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
      setShowResult(false);
    }
  };

  // Animations au résultat
  useEffect(() => {
    if (quizCompleted) {
      const { passed, perfectScore } = calculateResults();
      
      // Animation de l'icône
      iconScale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );

      if (perfectScore) {
        iconRotate.value = withSequence(
          withTiming(15, { duration: 100 }),
          withTiming(-15, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(0, { duration: 100 })
        );
      }

      // Animation du score
      scoreScale.value = withSequence(
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );

      // Haptics et confetti
      if (perfectScore) {
        haptics.celebrate();
        setShowConfetti(true);
      } else if (passed) {
        haptics.success();
      } else {
        haptics.encourage();
      }
    }
  }, [quizCompleted]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  const scoreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scoreScale.value }],
  }));

  const handleFinish = async () => {
    const { passed, perfectScore, xpEarned, percentage } = calculateResults();
    haptics.medium();

    try {
      setIsSaving(true);

      const user = await authService.getCurrentUser();
      if (user) {
        const quizResult: QuizResult = {
          id: generateUUID(),
          userId: user.id,
          gameId: CLANK_GAME.id,
          conceptId: conceptId,
          quizId: quiz.id,
          score: quizState.score,
          totalQuestions: quiz.questions.length,
          percentage,
          passed,
          perfectScore,
          xpEarned,
          timeSpent: Math.floor((new Date().getTime() - quizState.startedAt.getTime()) / 1000),
          completedAt: new Date().toISOString(),
          answers: quizState.answers.map(a => ({
            questionId: a.questionId,
            selectedOptionId: a.selectedOptionId,
            isCorrect: a.isCorrect,
            timeSpent: a.timeSpent,
          })),
        };

        await quizHistoryService.saveQuizResult(quizResult);
      }

      if (perfectScore && xpEarned > 0) {
        await completeLesson(CLANK_GAME.id, conceptId);
      }

      setIsSaving(false);
      
      setTimeout(() => {
        router.back();
      }, 500);
    } catch (error) {
      console.error('Error finishing quiz:', error);
      setIsSaving(false);
      router.back();
    }
  };

  const handleRetry = () => {
    haptics.medium();
    setQuizState({
      currentQuestionIndex: 0,
      answers: [],
      startedAt: new Date(),
      score: 0,
    });
    setShowResult(false);
    setQuizCompleted(false);
    setShowConfetti(false);
  };

  // ========================================
  // ÉCRAN DE RÉSULTATS
  // ========================================
  if (quizCompleted) {
    const { percentage, passed, perfectScore, xpEarned } = calculateResults();

    const getResultIcon = () => {
      if (perfectScore) return '🎉';
      if (passed) return '✅';
      return '💪';
    };

    const getResultTitle = () => {
      if (perfectScore) return 'Parfait !';
      if (passed) return 'Réussi !';
      return 'Presque !';
    };

    return (
      <GradientBackground>
        <Confetti isActive={showConfetti} count={60} />
        
        <SafeAreaView style={styles.container}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.resultsContainer}>
            {/* Icône animée */}
            <Animated.Text style={[styles.resultsIcon, iconAnimatedStyle]}>
              {getResultIcon()}
            </Animated.Text>

            {/* Titre */}
            <Animated.Text
              entering={FadeInDown.duration(600).delay(200)}
              style={[styles.resultsTitle, { color: colors.text }]}
            >
              {getResultTitle()}
            </Animated.Text>

            {/* Score */}
            <Animated.View 
              entering={FadeInDown.duration(600).delay(400)}
              style={scoreAnimatedStyle}
            >
              <GlassCard style={styles.scoreCard}>
                <Text style={[styles.scoreNumber, { color: colors.text }]}>
                  {quizState.score}/{quiz.questions.length}
                </Text>
                <Text style={[styles.scorePercentage, { color: colors.textSecondary }]}>
                  {percentage}% de bonnes réponses
                </Text>
                
                {/* Barre de progression */}
                <View style={[styles.progressBarContainer, { backgroundColor: colors.cardBorder }]}>
                  <Animated.View 
                    entering={FadeIn.duration(800).delay(600)}
                    style={[
                      styles.progressBarFill, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: perfectScore 
                          ? colors.success 
                          : passed 
                            ? colors.primary 
                            : '#f59e0b',
                      }
                    ]} 
                  />
                </View>
              </GlassCard>
            </Animated.View>

            {/* Badge XP Bonus */}
            {perfectScore && (
              <Animated.View entering={FadeInUp.duration(600).delay(600)}>
                <View
                  style={[
                    styles.bonusCardWrapper,
                    { 
                      backgroundColor: colors.success + '20', 
                      borderColor: colors.success + '40',
                    },
                  ]}
                >
                  <GlassCard style={styles.bonusCard}>
                    <Text style={styles.bonusIcon}>⭐</Text>
                    <Text style={[styles.bonusText, { color: colors.text }]}>
                      +{xpEarned} XP Bonus !
                    </Text>
                  </GlassCard>
                </View>
              </Animated.View>
            )}

            {/* Boutons */}
            <Animated.View entering={FadeInDown.duration(600).delay(800)} style={styles.actions}>
              {!passed && (
                <>
                  <Button 
                    variant="secondary" 
                    onPress={() => {
                      haptics.light();
                      router.back();
                    }}
                  >
                    <Text style={[{ fontSize: 14, fontWeight: '500' }, { color: colors.text }]}>
                      📚 Revoir la leçon
                    </Text>
                  </Button>
                  
                  <Button onPress={handleRetry}>
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                      🔄 Réessayer
                    </Text>
                  </Button>
                </>
              )}
              
              {passed && (
                <Button 
                  onPress={handleFinish}
                  style={isSaving ? { opacity: 0.7 } : undefined}
                >
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                    {isSaving ? 'Enregistrement...' : 'Continuer'}
                  </Text>
                </Button>
              )}
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  // ========================================
  // ÉCRAN DE QUIZ
  // ========================================
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              haptics.light();
              router.back();
            }}
          >
            <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
          </Pressable>

          {/* Score en temps réel */}
          <View style={styles.liveScore}>
            <Text style={[styles.liveScoreText, { color: colors.success }]}>
              {quizState.score}
            </Text>
            <Text style={[styles.liveScoreLabel, { color: colors.textTertiary }]}>
              /{quiz.questions.length}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                {
                  width: `${((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
                  backgroundColor: colors.primary,
                }
              ]} 
            />
          </View>
        </View>

        {/* Question */}
        <QuizCard
          question={currentQuestion}
          questionNumber={quizState.currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          onAnswer={handleAnswer}
          showResult={showResult}
          selectedOptionId={quizState.answers[quizState.currentQuestionIndex]?.selectedOptionId}
        />

        {/* Bouton suivant */}
        {showResult && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.nextButton}>
            <Button onPress={handleNext}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                {isLastQuestion ? 'Voir les résultats' : 'Question suivante →'}
              </Text>
            </Button>
          </Animated.View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  closeButton: {
    fontSize: 28,
    fontWeight: '300',
  },
  liveScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  liveScoreText: {
    fontSize: 20,
    fontWeight: '800',
  },
  liveScoreLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  nextButton: {
    padding: 24,
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  resultsIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 32,
  },
  scoreCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    minWidth: 200,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 8,
  },
  scorePercentage: {
    fontSize: 16,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  bonusCardWrapper: {
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  bonusCard: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  bonusIcon: {
    fontSize: 32,
  },
  bonusText: {
    fontSize: 20,
    fontWeight: '700',
  },
  actions: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
});