// app/index.tsx

import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { GradientBackground } from '../components/ui/GradientBackground';
import { useAuth } from '../lib/contexts/AuthContext';
import { useTheme } from '../lib/contexts/ThemeContext';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Chargement...
          </Text>
        </View>
      </GradientBackground>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  const handleStartLearning = () => {
    router.push('/games/concepts');
  };

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
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
            <Text style={[styles.title, { color: colors.text }]}>
              Rules{'\n'}Master
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Apprends n'importe quel jeu{'\n'}en quelques minutes
            </Text>
          </Animated.View>

          {/* Featured Game Card */}
          <Animated.View 
            entering={FadeInDown.duration(600).delay(200)}
            style={styles.section}
          >
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>JEU EN VEDETTE</Text>
            
            <GlassCard style={styles.gameCard} onPress={handleStartLearning}>
              <View style={styles.gameHeader}>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameIcon}>🐉</Text>
                  <View>
                    <Text style={[styles.gameName, { color: colors.text }]}>Clank!</Text>
                    <Text style={[styles.gameSubtitle, { color: colors.textSecondary }]}>
                      Les Aventuriers du Deck-building
                    </Text>
                  </View>
                </View>
                <View style={[styles.difficultyBadge, { 
                  backgroundColor: colors.difficultyBg,
                  borderColor: colors.difficultyBorder 
                }]}>
                  <Text style={[styles.difficultyText, { color: colors.difficultyText }]}>
                    Intermédiaire
                  </Text>
                </View>
              </View>

              <View style={styles.gameMetaContainer}>
                <View style={styles.gameMeta}>
                  <Text style={styles.gameMetaIcon}>👥</Text>
                  <Text style={[styles.gameMetaText, { color: colors.textSecondary }]}>
                    2-4 joueurs
                  </Text>
                </View>
                <View style={styles.gameMeta}>
                  <Text style={styles.gameMetaIcon}>⏱️</Text>
                  <Text style={[styles.gameMetaText, { color: colors.textSecondary }]}>
                    45-60 min
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

              <View style={styles.gameFooter}>
                <Text style={[styles.gameFooterText, { color: colors.textTertiary }]}>
                  <Text style={[styles.gameFooterHighlight, { color: colors.text }]}>
                    6 concepts
                  </Text>
                  {' · ~20 min d\'apprentissage'}
                </Text>
                <Text style={[styles.arrow, { color: colors.textTertiary }]}>→</Text>
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

          {/* Footer */}
          <Animated.View 
            entering={FadeIn.duration(600).delay(400)}
            style={styles.footer}
          >
            <Text style={[styles.footerText, { color: colors.textTertiary }]}>
              <Text style={[styles.footerHighlight, { color: colors.textSecondary }]}>
                1,247
              </Text>
              {' jeux disponibles'}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
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
    letterSpacing: -2,
    lineHeight: 60,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
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
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  gameCard: {
    padding: 24,
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
    marginBottom: 4,
  },
  gameSubtitle: {
    fontSize: 14,
    fontWeight: '300',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
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
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameFooterText: {
    fontSize: 12,
  },
  gameFooterHighlight: {
    fontWeight: '600',
  },
  arrow: {
    fontSize: 20,
    opacity: 0.3,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
  },
  footerHighlight: {
    fontWeight: '500',
  },
});