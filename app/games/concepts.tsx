import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame, useUserStats } from '../../lib/hooks/useGame';

export default function ConceptsScreen() {
  const router = useRouter();
  const { data: game } = useGame('clank-001');
  const { data: stats } = useUserStats();

  if (!game) return null;

  const completedCount = game.concepts.filter((c) => c.completed).length;
  const progress = Math.round((completedCount / game.concepts.length) * 100);

  const handleConceptPress = (conceptId: string, locked: boolean) => {
    if (locked) return;
    // TODO: Navigate to lesson screen
    console.log('Navigate to concept:', conceptId);
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={['#000000', '#0a0a0a', '#000000']}
        style={StyleSheet.absoluteFill}
      />

      {/* Orbs */}
      <View style={[styles.orb, styles.orb1]}>
        <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.orbGradient} />
      </View>
      <View style={[styles.orb, styles.orb2]}>
        <LinearGradient colors={['#ec4899', '#f43f5e']} style={styles.orbGradient} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Retour</Text>
          </Pressable>
          <Text style={styles.gameTitle}>{game.icon} {game.name}</Text>
          <Text style={styles.gameSubtitle}>Ton parcours d'apprentissage</Text>

          {/* Progress bar */}
          <View style={styles.progressCard}>
            <BlurView intensity={20} tint="dark" style={styles.progressBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
                style={styles.progressContent}
              >
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progression</Text>
                  <Text style={styles.progressPercent}>{progress}%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <Animated.View
                    style={[styles.progressBarFill, { width: `${progress}%` }]}
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
                <View style={styles.conceptCard}>
                  <BlurView intensity={20} tint="dark" style={styles.conceptBlur}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
                      style={[
                        styles.conceptContent,
                        concept.locked && styles.conceptLocked,
                      ]}
                    >
                      <View style={styles.conceptLeft}>
                        <View
                          style={[
                            styles.conceptIcon,
                            concept.completed && styles.conceptIconCompleted,
                            concept.locked && styles.conceptIconLocked,
                          ]}
                        >
                          <Text style={styles.conceptIconText}>
                            {concept.completed ? '✓' : concept.locked ? '🔒' : index + 1}
                          </Text>
                        </View>
                        <View style={styles.conceptInfo}>
                          <Text style={styles.conceptName}>{concept.name}</Text>
                          <Text style={styles.conceptDescription}>
                            {concept.description}
                          </Text>
                          <View style={styles.conceptMeta}>
                            <Text style={styles.conceptMetaText}>
                              ⏱️ {concept.estimatedTime} min
                            </Text>
                            <Text style={styles.conceptMetaText}>
                              {'⭐'.repeat(concept.difficulty)}
                              {'☆'.repeat(3 - concept.difficulty)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {!concept.locked && (
                        <Text style={styles.conceptArrow}>→</Text>
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
          <View style={styles.statsCard}>
            <BlurView intensity={20} tint="dark" style={styles.statsBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
                style={styles.statsContent}
              >
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{stats?.totalXP || 0}</Text>
                  <Text style={styles.statLabel}>XP Total</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{stats?.streak || 0} 🔥</Text>
                  <Text style={styles.statLabel}>Série</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {completedCount}/{game.concepts.length}
                  </Text>
                  <Text style={styles.statLabel}>Complétés</Text>
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
    backgroundColor: '#000000',
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
    color: '#9ca3af',
    fontSize: 14,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 20,
  },
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#9ca3af',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
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
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conceptIconCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  conceptIconLocked: {
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
  },
  conceptIconText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
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
    color: '#9ca3af',
    marginBottom: 6,
  },
  conceptMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  conceptMetaText: {
    fontSize: 11,
    color: '#6b7280',
  },
  conceptArrow: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.3)',
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
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
});