// app/games/lesson.tsx
// VERSION AVEC SUPPORT IMAGES/VIDÉOS - Switch complet

import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { useToast } from '../../components/ui/Toast';
import { useTheme } from '../../lib/contexts/ThemeContext';
import type { LessonSection } from '../../lib/data/clank-mock';
import { CLANK_GAME } from '../../lib/data/clank-mock';
import { hasQuiz } from '../../lib/data/clank-quizzes';
import { useCompleteLesson } from '../../lib/hooks/useGame';
import { haptics } from '../../lib/services/haptics';
import { quizHistoryService } from '../../lib/services/quiz-history';

interface VideoPlayerProps {
  videoUrl?: string;
  altText?: string;
}

function VideoPlayer({ videoUrl, altText }: VideoPlayerProps) {
  const { colors } = useTheme();

  const getYouTubeThumbnail = (url?: string) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = getYouTubeThumbnail(videoUrl);

  const handlePlayPress = async () => {
    if (videoUrl) {
      await Linking.openURL(videoUrl);
    }
  };

  if (!videoUrl) {
    return (
      <View style={[styles.videoPlaceholder, { borderColor: colors.cardBorder }]}>
        <Text style={styles.videoIcon}>🎬</Text>
        <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
          Vidéo à ajouter
        </Text>
      </View>
    );
  }

return (
  <View style={styles.videoContainer}>
    {thumbnailUrl ? (
      <Pressable onPress={handlePlayPress} style={styles.thumbnailContainer}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Image
              source={require('../../assets/images/icones/youtube.png')}
              style={styles.youtubeIcon}
              resizeMode="contain"
            />
          </View>
        </View>
        {altText && (
          <View style={[styles.videoLabel, { backgroundColor: colors.background + 'E6' }]}>
            <Text style={[styles.videoLabelText, { color: colors.text }]}>
              {altText}
            </Text>
          </View>
        )}
      </Pressable>
    ) : (
      <Pressable onPress={handlePlayPress} style={styles.thumbnailContainer}>
        <View style={[styles.videoPlaceholder, { borderColor: colors.cardBorder }]}>
          <Text style={styles.videoIcon}>🎬</Text>
          <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
            Ouvrir la vidéo
          </Text>
        </View>
      </Pressable>
    )}
  </View>
);
}

export default function LessonScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { conceptId } = useLocalSearchParams<{ conceptId: string }>();
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const { completeLesson, isCompleting } = useCompleteLesson();
  const { toast, showXP, ToastComponent } = useToast();

  // Quiz stats
  const [quizStats, setQuizStats] = useState<{
    attempts: number;
    bestScore: number;
    passed: boolean;
  } | null>(null);

  const concept = CLANK_GAME.concepts.find((c) => c.id === conceptId);
  const quizAvailable = conceptId ? hasQuiz(conceptId) : false;

  // Charger les stats du quiz (avec rafraîchissement au focus)
  useFocusEffect(
    useCallback(() => {
      const loadQuizStats = async () => {
        if (!conceptId || !quizAvailable) return;

        try {
          const attempts = await quizHistoryService.getAttemptCount(conceptId);
          const bestResult = await quizHistoryService.getBestScore(conceptId);
          const passed = await quizHistoryService.hasPassedQuiz(conceptId);

          setQuizStats({
            attempts,
            bestScore: bestResult?.percentage || 0,
            passed,
          });
        } catch (error) {
          console.error('Error loading quiz stats:', error);
        }
      };

      loadQuizStats();
    }, [conceptId, quizAvailable])
  );

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
      haptics.medium();
      const result = await completeLesson(CLANK_GAME.id, conceptId);

      if (result) {
        setIsCompleted(true);
        setXpEarned(result.completion.xpEarned);
        
        // Célébration !
        haptics.success();
        showXP(result.completion.xpEarned);

        setTimeout(() => {
          router.back();
        }, 1500);
      }
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const handleStartQuiz = () => {
    haptics.light();
    router.push({
      pathname: '/games/quiz',
      params: { conceptId },
    });
  };

  // ========================================
  // RENDER SECTION - SWITCH COMPLET
  // ========================================
  const renderSection = (section: LessonSection, index: number) => {
    const animationDelay = 100 * (index + 1);

    switch (section.type) {
      // ========================================
      // TYPE: IMAGE
      // ========================================
case 'image':
  return (
    <View key={index} style={{ marginBottom: 24 }}>
      {section.title && (
        <Text style={[styles.sectionTitle, { color: colors.text, paddingHorizontal: 24 }]}>
          {section.title}
        </Text>
      )}
      {section.content && (
        <Text style={[styles.sectionText, { color: colors.textSecondary, paddingHorizontal: 24, marginBottom: 16 }]}>
          {section.content}
        </Text>
      )}
      
      {/* Image débordante - Sort du padding du ScrollView */}
      <Animated.View 
        entering={FadeInRight.duration(600).delay(animationDelay + 200)}
        style={{
          width: '100%',
          height: 250,
          marginLeft: 24,
          marginRight: 0,
          marginVertical: 8,
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          overflow: 'hidden',
        }}
      >
        {section.imageUrl ? (
          <Image
            source={
              typeof section.imageUrl === 'string'
                ? { uri: section.imageUrl }
                : section.imageUrl
            }
            style={styles.imageFull}
            resizeMode="cover"
            accessibilityLabel={section.altText}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.placeholderText, { color: colors.textTertiary }]}>
              🖼️ Image à ajouter
            </Text>
          </View>
        )}
      </Animated.View>
      
      {/* Légende */}
      {section.altText && section.imageUrl && (
        <Text style={[styles.imageCaption, { color: colors.textTertiary, paddingHorizontal: 24, marginTop: 12 }]}>
          {section.altText}
        </Text>
      )}
    </View>
  );

      // ========================================
      // TYPE: VIDEO
      // ========================================
case 'video':
  return (
    <Animated.View
      key={index}
      entering={FadeInDown.duration(400).delay(animationDelay)}
      style={styles.sectionWrapper}
    >
      <View style={[styles.sectionCard, { borderColor: colors.cardBorder }]}>
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
            {section.content && (
              <Text style={[styles.sectionText, { color: colors.textSecondary, marginBottom: 16 }]}>
                {section.content}
              </Text>
            )}
            
            <VideoPlayer 
              videoUrl={section.videoUrl} 
              altText={section.altText}
            />
          </LinearGradient>
        </BlurView>
      </View>
    </Animated.View>
  );

      // ========================================
      // TYPE: TIP
      // ========================================
      case 'tip':
        return (
          <Animated.View
            key={index}
            entering={FadeInDown.duration(400).delay(animationDelay)}
            style={styles.sectionWrapper}
          >
            <View
              style={[
                styles.sectionCard,
                { borderColor: colors.cardBorder },
                { borderLeftColor: colors.primary, borderLeftWidth: 3 },
              ]}
            >
              <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                <LinearGradient
                  colors={
                    theme === 'dark'
                      ? (['rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0.02)'] as const)
                      : (['rgba(139, 92, 246, 0.05)', 'rgba(139, 92, 246, 0.01)'] as const)
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

      // ========================================
      // TYPE: EXAMPLE
      // ========================================
      case 'example':
        return (
          <Animated.View
            key={index}
            entering={FadeInDown.duration(400).delay(animationDelay)}
            style={styles.sectionWrapper}
          >
            <View
              style={[
                styles.sectionCard,
                { borderColor: colors.cardBorder },
                { borderLeftColor: colors.success, borderLeftWidth: 3 },
              ]}
            >
              <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                <LinearGradient
                  colors={
                    theme === 'dark'
                      ? (['rgba(16, 185, 129, 0.08)', 'rgba(16, 185, 129, 0.02)'] as const)
                      : (['rgba(16, 185, 129, 0.05)', 'rgba(16, 185, 129, 0.01)'] as const)
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

      // ========================================
      // TYPE: TEXT (default)
      // ========================================
      case 'text':
      default:
        return (
          <Animated.View
            key={index}
            entering={FadeInDown.duration(400).delay(animationDelay)}
            style={styles.sectionWrapperSimple}
          >
            {section.title && (
              <Text style={[styles.sectionTitleSimple, { color: colors.text }]}>
                {section.title}
              </Text>
            )}
            <Text style={[styles.sectionTextSimple, { color: colors.textSecondary }]}>
              {section.content}
            </Text>
          </Animated.View>
        );
    }
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

  const getQuizButtonText = () => {
    if (!quizStats || quizStats.attempts === 0) {
      return '🎮 Tester mes connaissances';
    }
    return `🔄 Retenter le quiz (Meilleur: ${quizStats.bestScore}%)`;
  };

  // Vérifier si score parfait au quiz
  const hasPerfectScore = quizStats?.bestScore === 100;

  return (
    <GradientBackground>
      {/* Toast pour les notifications */}
      <ToastComponent />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable onPress={() => {
            haptics.light();
            router.back();
          }} style={styles.backButton}>
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

            {/* Quiz Stats (si quiz disponible et déjà tenté) */}
            {quizAvailable && quizStats && quizStats.attempts > 0 && (
              <Animated.View
                entering={FadeInDown.duration(400).delay(100 * (concept.lesson.sections.length + 3))}
                style={styles.quizStatsWrapper}
              >
                <View style={[styles.quizStatsCard, { borderColor: colors.cardBorder }]}>
                  <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                    <LinearGradient
                      colors={
                        theme === 'dark'
                          ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const)
                          : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as const)
                      }
                      style={styles.quizStatsContent}
                    >
                      <Text style={[styles.quizStatsLabel, { color: colors.textTertiary }]}>
                        📊 TES STATS DE QUIZ
                      </Text>
                      <View style={styles.quizStatsRow}>
                        <View style={styles.quizStat}>
                          <Text style={[styles.quizStatValue, { color: colors.text }]}>
                            {quizStats.attempts}
                          </Text>
                          <Text style={[styles.quizStatLabel, { color: colors.textTertiary }]}>
                            {quizStats.attempts === 1 ? 'Tentative' : 'Tentatives'}
                          </Text>
                        </View>
                        <View style={styles.quizStat}>
                          <Text style={[styles.quizStatValue, { color: colors.text }]}>
                            {quizStats.bestScore}%
                          </Text>
                          <Text style={[styles.quizStatLabel, { color: colors.textTertiary }]}>
                            Meilleur
                          </Text>
                        </View>
                        <View style={styles.quizStat}>
                          <Text style={[styles.quizStatValue, { color: quizStats.passed ? colors.success : '#ef4444' }]}>
                            {quizStats.passed ? '✓' : '✗'}
                          </Text>
                          <Text style={[styles.quizStatLabel, { color: colors.textTertiary }]}>
                            {quizStats.passed ? 'Réussi' : 'Non réussi'}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </BlurView>
                </View>
              </Animated.View>
            )}

            <View style={{ height: 140 }} />
          </ScrollView>
        </View>

        {/* Footer avec boutons */}
        <Animated.View
          entering={FadeIn.duration(400).delay(800)}
          style={styles.footer}
        >
          {/* Bouton Quiz - Seulement si pas de score parfait */}
          {quizAvailable && !hasPerfectScore && (
            <Button
              variant="secondary"
              onPress={handleStartQuiz}
              style={{ marginBottom: 12 }}
            >
              <Text style={[{ fontSize: 14, fontWeight: '500' }, { color: colors.text }]}>
                {getQuizButtonText()}
              </Text>
            </Button>
          )}

          {/* Badge Quiz Maîtrisé - Si score parfait */}
          {quizAvailable && hasPerfectScore && (
            <View
              style={[
                styles.perfectScoreBadge,
                {
                  backgroundColor: colors.success + '20',
                  borderColor: colors.success + '40',
                },
              ]}
            >
              <Text style={[styles.perfectScoreText, { color: colors.success }]}>
                ✅ Quiz maîtrisé (100%)
              </Text>
            </View>
          )}

          {/* Bouton Compléter */}
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

  // Image styles
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  placeholderText: {
    fontSize: 24,
    marginBottom: 8,
  },
  placeholderAlt: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  imageCaption: {
    fontSize: 12,
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Video styles
  videoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  videoText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  videoUrl: {
    fontSize: 12,
    marginBottom: 8,
  },
  videoNote: {
    fontSize: 11,
    fontStyle: 'italic',
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

  // Quiz Stats styles
  quizStatsWrapper: {
    marginTop: 16,
    marginBottom: 16,
  },
  quizStatsCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  quizStatsContent: {
    padding: 20,
  },
  quizStatsLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  quizStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quizStat: {
    alignItems: 'center',
  },
  quizStatValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  quizStatLabel: {
    fontSize: 12,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  perfectScoreBadge: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 12,
  },
  perfectScoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
imageSection: {
  gap: 12,
},
videoButton: {
  borderRadius: 16,
  borderWidth: 2,
  overflow: 'hidden',
},
videoButtonContent: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 20,
  gap: 16,
},
playIconContainer: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: '#ff0000',
  justifyContent: 'center',
  alignItems: 'center',
},
playIcon: {
  fontSize: 24,
},
videoButtonText: {
  flex: 1,
},
videoButtonTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 4,
},
videoButtonSubtitle: {
  fontSize: 13,
},
sectionWrapperImage: {
  marginBottom: 24,
},
imageContainerFull: {
  width: '100%',
  height: 250,
  marginRight: -24,
  marginVertical: 8,
  overflow: 'hidden',
},
imageFull: {
  width: '100%',
  height: '100%',
},
videoContainer: {
  width: '100%',
  height: 220,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#000',
},
thumbnailContainer: {
  width: '100%',
  height: '100%',
  position: 'relative',
},
videoThumbnail: {
  width: '100%',
  height: '100%',
},
playOverlay: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
},
playButton: {

},
videoLabel: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: 10,
},
videoLabelText: {
  fontSize: 12,
  fontWeight: '500',
},
youtubeIcon: {
  width: 80,
  height: 80,
  opacity: 0.5,
  tintColor: '#ffffff',
},
video: {
  width: '100%',
  height: '100%',
},
videoPlaceholder: {
  height: 200,
  borderRadius: 12,
  borderWidth: 2,
  borderStyle: 'dashed',
  justifyContent: 'center',
  alignItems: 'center',
},
sectionWrapperSimple: {
  marginBottom: 24,
  paddingHorizontal: 24,
},
sectionTitleSimple: {
  fontSize: 20,
  fontWeight: '700',
  marginBottom: 12,
},
sectionTextSimple: {
  fontSize: 15,
  lineHeight: 24,
},
});