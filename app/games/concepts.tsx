import { useFocusEffect } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { useGame, useUserStats } from '../../lib/hooks/useGame';

export default function ConceptsScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const { data: game, refetch, isLoading } = useGame('clank-001');
  const { data: stats, refetch: refetchStats } = useUserStats();

  // Refetch quand l'écran revient au focus (après complétion d'une leçon)
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      refetchStats();
    }, [refetch, refetchStats])
  );

  if (isLoading || !game) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient
          colors={[colors.background, colors.backgroundSecondary, colors.background] as any}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView style={styles.safeArea}>
          <Text style={{ color: colors.text, textAlign: 'center', marginTop: 100 }}>
            Chargement...
          </Text>
        </SafeAreaView>
      </View>
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background */}
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary, colors.background] as any}
        style={StyleSheet.absoluteFill}
      />

      {/* Orbs */}
      <View style={[styles.orb, styles.orb1]}>
        <LinearGradient colors={[colors.orb1Start, colors.orb1End] as any} style={styles.orbGradient} />
      </View>
      <View style={[styles.orb, styles.orb2]}>
        <LinearGradient colors={[colors.orb2Start, colors.orb2End] as any} style={styles.orbGradient} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
          </Pressable>
          <Text style={[styles.gameTitle, { color: colors.text }]}>{game.icon} {game.name}</Text>
          <Text style={[styles.gameSubtitle, { color: colors.textSecondary }]}>Ton parcours d'apprentissage</Text>

          {/* Progress bar */}
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
                  <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Progression</Text>
                  <Text style={[styles.progressPercent, { color: colors.text }]}>{progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: colors.primary }]}
                  />
                </View>
              </LinearGradient>
            </BlurView>
          </View>
        </Animated.View>

        {/* Concepts List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {game.concepts.map((concept, index) => (
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
                  <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.conceptBlur}>
                    <LinearGradient
                      colors={
                        theme === 'dark'
                          ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                          : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
                      }
                      style={[
                        styles.conceptContent,
                        concept.locked && styles.conceptLocked,
                      ]}
                    >
                      <View style={styles.conceptLeft}>
                        <View
                          style={[
                            styles.conceptIcon,
                            { backgroundColor: concept.completed ? colors.success + '33' : concept.locked ? colors.locked + '33' : colors.difficultyBg },
                            concept.completed && styles.conceptIconCompleted,
                            concept.locked && styles.conceptIconLocked,
                          ]}
                        >
                          <Text style={[styles.conceptIconText, { color: colors.text }]}>
                            {concept.completed ? '✓' : concept.locked ? '🔒' : index + 1}
                          </Text>
                        </View>
                        <View style={styles.conceptInfo}>
                          <Text style={[styles.conceptName, { color: colors.text }]}>{concept.name}</Text>
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
          ))}
        </ScrollView>

        {/* Stats Footer */}
        <Animated.View
          entering={FadeIn.duration(400).delay(700)}
          style={styles.footer}
        >
          <View style={[styles.statsCard, { borderColor: colors.cardBorder }]}>
            <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.statsBlur}>
              <LinearGradient
                colors={
                  theme === 'dark'
                    ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                    : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
                }
                style={styles.statsContent}
              >
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stats?.totalXP || 0}</Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>XP Total</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stats?.streak || 0} 🔥</Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Série</Text>
                </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.3,
  },
  orb1: {
    width: 400,
    height: 400,
    top: -100,
    right: -100,
  },
  orb2: {
    width: 300,
    height: 300,
    bottom: -50,
    left: -50,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
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
    paddingBottom: 120,
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
  conceptName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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