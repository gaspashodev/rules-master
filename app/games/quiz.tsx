// app/games/quiz.tsx
// VERSION CORRIGÉE :
// - Score calculé sur le TOTAL de questions (pas sur le nombre répondu)
// - Sauvegarde des tentatives abandonnées
// - Un seul bouton "Terminer"

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizCard } from '../../components/quiz/QuizCard';
import { Button } from '../../components/ui/Button';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { CLANK_GAME } from '../../lib/data/clank-mock';
import { getQuizByConcept } from '../../lib/data/clank-quizzes';
import { useCompleteLesson } from '../../lib/hooks/useGame';
import { authService } from '../../lib/services/auth';
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

  const handleAnswer = (optionId: string) => {
    const isCorrect = currentQuestion.options.find(o => o.id === optionId)?.isCorrect || false;

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

  const calculateResults = () => {
    // ✅ CORRECTION : Score toujours sur le TOTAL de questions du quiz
    const totalQuestions = quiz.questions.length;
    const questionsAnswered = quizState.answers.length;
    const percentage = Math.round((quizState.score / totalQuestions) * 100);
    const passed = percentage >= quiz.passingScore;
    const perfectScore = percentage === 100 && questionsAnswered === totalQuestions;
    const xpEarned = perfectScore ? quiz.bonusXP : 0;

    return { 
      percentage, 
      passed, 
      perfectScore, 
      xpEarned, 
      totalQuestions,
      questionsAnswered 
    };
  };

  /**
   * Sauvegarde la tentative (complète ou abandonnée)
   */
  const saveQuizAttempt = async () => {
    const { passed, perfectScore, xpEarned, percentage, totalQuestions, questionsAnswered } = calculateResults();

    try {
      const user = await authService.getCurrentUser();
      if (user) {
        const quizResult: QuizResult = {
          id: generateUUID(),
          userId: user.id,
          gameId: CLANK_GAME.id,
          conceptId: conceptId,
          quizId: quiz.id,
          score: quizState.score,
          totalQuestions: totalQuestions, // ✅ Toujours le total du quiz
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
        console.log('✅ Quiz saved:', {
          score: `${quizState.score}/${totalQuestions}`,
          answered: questionsAnswered,
          percentage: `${percentage}%`,
        });

        // Si score parfait, donner le bonus XP
        if (perfectScore && xpEarned > 0) {
          await completeLesson(CLANK_GAME.id, conceptId);
        }
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  /**
   * Fermeture normale avec sauvegarde
   */
  const handleFinish = async () => {
    setIsSaving(true);
    await saveQuizAttempt();
    setIsSaving(false);
    router.back();
  };

  /**
   * Abandon prématuré (clic sur la croix)
   */
  const handleQuit = () => {
    if (quizState.answers.length === 0) {
      router.back();
      return;
    }

    const { questionsAnswered, totalQuestions } = calculateResults();
    
    Alert.alert(
      'Abandonner le quiz ?',
      `Tu as répondu à ${questionsAnswered}/${totalQuestions} questions. Cette tentative sera enregistrée.`,
      [
        {
          text: 'Continuer le quiz',
          style: 'cancel',
        },
        {
          text: 'Abandonner',
          style: 'destructive',
          onPress: async () => {
            await saveQuizAttempt();
            router.back();
          },
        },
      ]
    );
  };

  if (quizCompleted) {
    const { percentage, passed, perfectScore, xpEarned, totalQuestions } = calculateResults();

    return (
      <GradientBackground>
        <SafeAreaView style={styles.container}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.resultsContainer}>
            <Animated.Text
              entering={FadeInDown.duration(600).delay(200)}
              style={styles.resultsIcon}
            >
              {perfectScore ? '🎉' : passed ? '✅' : '😅'}
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.duration(600).delay(300)}
              style={[styles.resultsTitle, { color: colors.text }]}
            >
              {perfectScore ? 'Parfait !' : passed ? 'Réussi !' : 'Presque !'}
            </Animated.Text>

            <Animated.View entering={FadeInDown.duration(600).delay(400)}>
              <GlassCard style={styles.scoreCard}>
                <Text style={[styles.scoreNumber, { color: colors.text }]}>
                  {quizState.score}/{totalQuestions}
                </Text>
                <Text style={[styles.scorePercentage, { color: colors.textSecondary }]}>
                  {percentage}% de réponses correctes
                </Text>
              </GlassCard>
            </Animated.View>

            {perfectScore && (
              <Animated.View entering={FadeInDown.duration(600).delay(500)}>
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
                    <Text style={[styles.bonusSubtext, { color: colors.textSecondary }]}>
                      Score parfait
                    </Text>
                  </GlassCard>
                </View>
              </Animated.View>
            )}

            <Animated.Text
              entering={FadeInDown.duration(600).delay(600)}
              style={[styles.resultsMessage, { color: colors.textSecondary }]}
            >
              {perfectScore
                ? 'Tu maîtrises parfaitement ce concept ! 🚀'
                : passed
                ? 'Bon travail ! Tu peux passer au concept suivant.'
                : "Pas mal ! Relis la leçon et réessaie le quiz pour améliorer ton score."}
            </Animated.Text>

            <Animated.View entering={FadeInDown.duration(600).delay(700)} style={styles.actions}>
              <Button 
                onPress={handleFinish}
                style={isSaving ? { opacity: 0.7 } : undefined}
              >
                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                  {isSaving ? 'Enregistrement...' : 'Terminer'}
                </Text>
              </Button>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleQuit}>
            <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
          </Pressable>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              backgroundColor: colors.primary,
            }]} />
          </View>
        </View>

        <QuizCard
          question={currentQuestion}
          questionNumber={quizState.currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          onAnswer={handleAnswer}
          showResult={showResult}
          selectedOptionId={quizState.answers[quizState.currentQuestionIndex]?.selectedOptionId}
        />

        {showResult && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.nextButton}>
            <Button onPress={handleNext}>
              <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                {isLastQuestion ? 'Voir les résultats' : 'Question suivante'}
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
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 8,
  },
  scorePercentage: {
    fontSize: 16,
  },
  bonusCardWrapper: {
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  bonusCard: {
    padding: 24,
    alignItems: 'center',
  },
  bonusIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  bonusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  bonusSubtext: {
    fontSize: 14,
  },
  resultsMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
});