// app/games/lesson.tsx
// VERSION FINALE - Avec stats tentatives quiz

import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { Toast } from '../../components/ui/Toast';
import { useTheme } from '../../lib/contexts/ThemeContext';
import type { LessonSection } from '../../lib/data/clank-mock';
import { CLANK_GAME } from '../../lib/data/clank-mock';
import { hasQuiz } from '../../lib/data/clank-quizzes';
import { useCompleteLesson } from '../../lib/hooks/useGame';
import { haptics } from '../../lib/services/haptics';
import { quizHistoryService } from '../../lib/services/quiz-history';

export default function LessonScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { conceptId } = useLocalSearchParams<{ conceptId: string }>();
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXPToast, setShowXPToast] = useState(false);
  const { completeLesson, isCompleting } = useCompleteLesson();

  // Stats quiz - tentatives
  const [quizBestScore, setQuizBestScore] = useState<number | null>(null);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  const concept = CLANK_GAME.concepts.find((c) => c.id === conceptId);
  const quizAvailable = conceptId ? hasQuiz(conceptId) : false;

  // Charger les stats quiz au focus
  useFocusEffect(
    useCallback(() => {
      if (conceptId) {
        loadQuizStats();
      }
    }, [conceptId])
  );

  const loadQuizStats = async () => {
    if (!conceptId) return;
    
    try {
      const [bestScore, attempts, passed] = await Promise.all([
        quizHistoryService.getBestScore(conceptId),
        quizHistoryService.getAttemptCount(conceptId),
        quizHistoryService.hasPassedQuiz(conceptId),
      ]);
      
      setQuizBestScore(bestScore?.percentage ?? null);
      setQuizAttempts(attempts);
      setQuizPassed(passed);
    } catch (error) {
      // Silencieux
    }
  };

  if (!concept) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safeArea}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
          </Pressable>
          <Text style={{ color: colors.text, padding: 24 }}>Concept non trouvé</Text>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const handleComplete = async () => {
    haptics.medium();
    
    try {
      const result = await completeLesson(CLANK_GAME.id, conceptId);
      
      if (result) {
        setIsCompleted(true);
        setXpEarned(result.completion.xpEarned);
        
        if (result.completion.xpEarned > 0) {
          haptics.success();
          setShowXPToast(true);
        }
        
        setTimeout(() => {
          router.back();
        }, 1500);
      }
    } catch (error) {
      // Silencieux
    }
  };

  const handleStartQuiz = () => {
    haptics.light();
    router.push({
      pathname: '/games/quiz',
      params: { conceptId },
    });
  };

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const renderSection = (section: LessonSection, index: number) => {
    const getSectionStyle = () => {
      switch (section.type) {
        case 'tip':
          return { borderLeftColor: colors.primary, borderLeftWidth: 3 };
        case 'example':
          return { borderLeftColor: colors.success, borderLeftWidth: 3 };
        default:
          return null;
      }
    };

    return (
      <Animated.View
        key={index}
        entering={FadeInDown.duration(400).delay(100 * (index + 1))}
        style={styles.sectionWrapper}
      >
        <View
          style={[
            styles.sectionCard,
            { borderColor: colors.cardBorder },
            getSectionStyle(),
          ]}
        >
          <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
            <LinearGradient
              colors={
                theme === 'dark'
                  ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const)
                  : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as const)
              }
              style={styles.sectionContent}
            >
              {section.title && (
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  {section.title}
                </Text>
              )}
              <Text style={[styles.sectionText, { color: colors.textSecondary }]}>
                {section.content}
              </Text>
            </LinearGradient>
          </BlurView>
        </View>
      </Animated.View>
    );
  };

  const getCompleteButtonText = () => {
    if (isCompleted) return `✓ +${xpEarned} XP`;
    if (isCompleting) return 'Enregistrement...';
    return 'Marquer comme terminé';
  };

  // Construire le sous-texte du bouton quiz avec tentatives
  const getQuizSubtext = () => {
    if (quizAttempts === 0) {
      return 'Pas encore tenté';
    }
    
    const parts = [];
    if (quizBestScore !== null) {
      parts.push(`Meilleur : ${quizBestScore}%`);
    }
    parts.push(`${quizAttempts} tentative${quizAttempts > 1 ? 's' : ''}`);
    
    return parts.join(' · ');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
          </Pressable>

          <View style={styles.conceptHeader}>
            <View
              style={[
                styles.conceptIcon,
                { backgroundColor: colors.difficultyBg, borderColor: colors.difficultyBorder },
              ]}
            >
              <Text style={[styles.conceptIconText, { color: colors.primary }]}>{concept.order}</Text>
            </View>
            <View style={styles.conceptInfo}>
              <Text style={[styles.conceptName, { color: colors.text }]}>{concept.name}</Text>
              <Text style={[styles.conceptDescription, { color: colors.textSecondary }]}>
                {concept.description}
              </Text>
            </View>
          </View>

          <View style={styles.progressDots}>
            {concept.lesson.sections.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === 0 ? colors.primary : 'rgba(255, 255, 255, 0.2)' },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Introduction */}
            <Animated.View entering={FadeInDown.duration(400).delay(100)}>
              <Text style={[styles.introduction, { color: colors.text }]}>
                {concept.lesson.introduction}
              </Text>
            </Animated.View>

            {/* Sections */}
            {concept.lesson.sections.map((section, index) => renderSection(section, index))}

            {/* Summary */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(100 * (concept.lesson.sections.length + 2))}
              style={styles.summaryWrapper}
            >
              <View style={[styles.summaryCard, { borderColor: colors.cardBorder }]}>
                <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                  <LinearGradient
                    colors={
                      theme === 'dark'
                        ? (['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)'] as const)
                        : (['rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.03)'] as const)
                    }
                    style={styles.summaryContent}
                  >
                    <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>
                      📝 RÉSUMÉ
                    </Text>
                    <Text style={[styles.summaryText, { color: colors.text }]}>
                      {concept.lesson.summary}
                    </Text>
                  </LinearGradient>
                </BlurView>
              </View>
            </Animated.View>

            <View style={{ height: 200 }} />
          </ScrollView>

          {/* Gradient fade */}
          <LinearGradient
            colors={
              theme === 'dark'
                ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)']
                : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 1)']
            }
            style={styles.fadeGradient}
            pointerEvents="none"
          />
        </View>

        {/* Footer */}
        <Animated.View entering={FadeIn.duration(400).delay(800)} style={styles.footer}>
          {/* Quiz Button avec stats tentatives */}
          {quizAvailable && (
            <Pressable
              onPress={handleStartQuiz}
              style={({ pressed }) => [
                styles.quizButton,
                { 
                  backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                  borderColor: colors.cardBorder,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.quizButtonContent}>
                <View style={styles.quizButtonLeft}>
                  <Text style={styles.quizIcon}>🎮</Text>
                  <View style={styles.quizTextContainer}>
                    <View style={styles.quizTitleRow}>
                      <Text style={[styles.quizTitle, { color: colors.text }]}>
                        Tester mes connaissances
                      </Text>
                      {quizPassed && (
                        <Text style={styles.quizPassedBadge}>✓</Text>
                      )}
                    </View>
                    <Text style={[styles.quizSubtext, { color: colors.textTertiary }]}>
                      {getQuizSubtext()}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.quizArrow, { color: colors.textTertiary }]}>→</Text>
              </View>
            </Pressable>
          )}
          
          {/* Complete Button */}
          <Button 
            onPress={handleComplete} 
            style={isCompleting || isCompleted ? { opacity: 0.7 } : undefined}
          >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              {getCompleteButtonText()}
            </Text>
          </Button>
        </Animated.View>

        {/* Toast XP */}
        <Toast
          visible={showXPToast}
          title="Bravo !"
          message={`+${xpEarned} XP gagnés !`}
          type="success"
          onHide={() => setShowXPToast(false)}
        />
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
    paddingTop: 12,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  conceptIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptIconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  conceptInfo: {
    flex: 1,
  },
  conceptName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  conceptDescription: {
    fontSize: 14,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  introduction: {
    fontSize: 17,
    lineHeight: 26,
    marginBottom: 28,
    fontWeight: '300',
  },
  sectionWrapper: {
    marginBottom: 14,
  },
  sectionCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    overflow: 'hidden',
  },
  sectionContent: {
    padding: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 23,
  },
  summaryWrapper: {
    marginTop: 28,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 2,
  },
  summaryContent: {
    padding: 22,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '300',
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 10,
  },
  
  // Quiz Button with stats
  quizButton: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  quizButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  quizIcon: {
    fontSize: 26,
  },
  quizTextContainer: {
    flex: 1,
  },
  quizTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quizTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  quizPassedBadge: {
    fontSize: 13,
    color: '#10b981',
  },
  quizSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  quizArrow: {
    fontSize: 16,
  },
});