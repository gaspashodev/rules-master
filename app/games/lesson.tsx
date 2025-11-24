// app/games/lesson.tsx
// VERSION AVEC GRADIENT FADE - Pour masquer la superposition du bouton

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useTheme } from '../../lib/contexts/ThemeContext';
import type { LessonSection } from '../../lib/data/clank-mock';
import { CLANK_GAME } from '../../lib/data/clank-mock';
import { hasQuiz } from '../../lib/data/clank-quizzes';
import { useCompleteLesson } from '../../lib/hooks/useGame';

export default function LessonScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { conceptId } = useLocalSearchParams<{ conceptId: string }>();
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const { completeLesson, isCompleting } = useCompleteLesson();

  const concept = CLANK_GAME.concepts.find((c) => c.id === conceptId);
  const quizAvailable = conceptId ? hasQuiz(conceptId) : false;

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
    try {
      const result = await completeLesson(CLANK_GAME.id, conceptId);
      
      if (result) {
        setIsCompleted(true);
        setXpEarned(result.completion.xpEarned);
        
        setTimeout(() => {
          router.back();
        }, 1000);
      }
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const handleStartQuiz = () => {
    router.push({
      pathname: '/games/quiz',
      params: { conceptId },
    });
  };

  const renderSection = (section: LessonSection, index: number) => {
    const getSectionBorder = () => {
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
            getSectionBorder(),
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
    if (isCompleted) {
      return `✓ +${xpEarned} XP`;
    }
    if (isCompleting) {
      return 'Enregistrement...';
    }
    return 'Marquer comme terminé';
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
          </Pressable>

          <View style={styles.conceptHeader}>
            <View
              style={[
                styles.conceptIcon,
                { backgroundColor: colors.difficultyBg, borderColor: colors.difficultyBorder },
              ]}
            >
              <Text style={styles.conceptIconText}>{concept.order}</Text>
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
                  {
                    backgroundColor:
                      i === 0 ? colors.primary : 'rgba(255, 255, 255, 0.2)',
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Lesson Content */}
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

            <View style={{ height: 140 }} />
          </ScrollView>

          {/* NOUVEAU : Gradient Fade en bas */}
          <LinearGradient
            colors={
              theme === 'dark'
                ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.95)']
                : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.95)']
            }
            style={styles.fadeGradient}
            pointerEvents="none"
          />
        </View>

        {/* Footer avec boutons */}
        <Animated.View
          entering={FadeIn.duration(400).delay(800)}
          style={styles.footer}
        >
          {quizAvailable && (
            <Button 
              variant="secondary"
              onPress={handleStartQuiz}
              style={{ marginBottom: 12 }}
            >
              <Text style={[{ fontSize: 14, fontWeight: '500' }, { color: colors.text }]}>
                🎮 Tester mes connaissances
              </Text>
            </Button>
          )}
          
          <Button 
            onPress={handleComplete} 
            style={isCompleting || isCompleted ? { opacity: 0.7 } : undefined}
          >
            <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
              {getCompleteButtonText()}
            </Text>
          </Button>
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
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  conceptIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptIconText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  conceptInfo: {
    flex: 1,
  },
  conceptName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  conceptDescription: {
    fontSize: 14,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  introduction: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
    fontWeight: '300',
  },
  sectionWrapper: {
    marginBottom: 16,
  },
  sectionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    overflow: 'hidden',
  },
  sectionContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  summaryWrapper: {
    marginTop: 32,
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
  },
  summaryContent: {
    padding: 24,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '300',
  },
  fadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180, // Hauteur du gradient
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
});