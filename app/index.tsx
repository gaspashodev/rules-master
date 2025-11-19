import { GradientBackground } from '@/components/ui/GradientBackground';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

export default function HomeScreen() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/games/concepts');
  };

  const handleOpenCoach = () => {
    console.log('Open coach pressed');
    // TODO: Naviguer vers l'écran du coach IA
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        {/* Settings Button */}
        <Animated.View 
          entering={FadeIn.duration(600).delay(50)}
          style={styles.settingsButton}
        >
          <Pressable onPress={handleOpenSettings} style={styles.settingsIcon}>
            <Text style={styles.settingsEmoji}>⚙️</Text>
          </Pressable>
        </Animated.View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* Header */}
          <Animated.View 
            entering={FadeIn.duration(600).delay(100)}
            style={styles.header}
          >
            <Text style={styles.title}>
              Rules{'\n'}Master
            </Text>
            <Text style={styles.subtitle}>
              Apprends n'importe quel jeu{'\n'}en quelques minutes
            </Text>
          </Animated.View>

          {/* Featured Game Card */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.section}
          >
            <Text style={styles.sectionLabel}>JEU EN VEDETTE</Text>
            
            <GlassCard style={styles.gameCard}>
              <View style={styles.gameHeader}>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameIcon}>🐉</Text>
                  <View>
                    <Text style={styles.gameName}>Clank!</Text>
                    <Text style={styles.gameSubtitle}>
                      Les Aventuriers du Deck-building
                    </Text>
                  </View>
                </View>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>Intermédiaire</Text>
                </View>
              </View>

              <View style={styles.gameMetaContainer}>
                <View style={styles.gameMeta}>
                  <Text style={styles.gameMetaIcon}>👥</Text>
                  <Text style={styles.gameMetaText}>2-4 joueurs</Text>
                </View>
                <View style={styles.gameMeta}>
                  <Text style={styles.gameMetaIcon}>⏱️</Text>
                  <Text style={styles.gameMetaText}>45-60 min</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.gameFooter}>
                <Text style={styles.gameFooterText}>
                  <Text style={styles.gameFooterHighlight}>6 concepts</Text>
                  {' · ~20 min d\'apprentissage'}
                </Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* CTA Button */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(300)}
            style={styles.section}
          >
            <Button onPress={handleStartLearning}>
              Commencer l'apprentissage
            </Button>
          </Animated.View>

          {/* Secondary Action */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(400)}
            style={styles.section}
          >
            <Button variant="secondary" onPress={handleOpenCoach}>
              <Text style={styles.coachIcon}>🤖</Text>
              <Text style={styles.coachText}>Coach IA</Text>
              <Text style={styles.coachSubtext}>
                · Pose tes questions pendant ta partie
              </Text>
            </Button>
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            entering={FadeIn.duration(600).delay(500)}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              <Text style={styles.footerHighlight}>1,247</Text> jeux disponibles
            </Text>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsEmoji: {
    fontSize: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 60,
  },
  title: {
    fontSize: 56,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -2,
    lineHeight: 60,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#9ca3af',
    fontWeight: '300',
    letterSpacing: 0.5,
    lineHeight: 26,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  gameCard: {
    padding: 0,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  gameIcon: {
    fontSize: 48,
  },
  gameName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '300',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  difficultyText: {
    fontSize: 12,
    color: '#c4b5fd',
    fontWeight: '500',
  },
  gameMetaContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
  },
  gameMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  gameMetaIcon: {
    fontSize: 14,
  },
  gameMetaText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameFooterText: {
    fontSize: 12,
    color: '#6b7280',
  },
  gameFooterHighlight: {
    color: '#ffffff',
    fontWeight: '600',
  },
  arrow: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  coachIcon: {
    fontSize: 24,
  },
  coachText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  coachSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#4b5563',
  },
  footerHighlight: {
    color: '#9ca3af',
    fontWeight: '500',
  },
});