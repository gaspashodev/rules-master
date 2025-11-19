import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../lib/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background */}
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary, colors.background]}
        style={StyleSheet.absoluteFill}
      />

      {/* Orbs */}
      <View style={[styles.orb, styles.orb1]}>
        <LinearGradient colors={[colors.orb1Start, colors.orb1End]} style={styles.orbGradient} />
      </View>
      <View style={[styles.orb, styles.orb2]}>
        <LinearGradient colors={[colors.orb2Start, colors.orb2End]} style={styles.orbGradient} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Paramètres</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Personnalise ton expérience
          </Text>
        </Animated.View>

        {/* Settings List */}
        <View style={styles.content}>
          <Animated.View 
            entering={FadeInDown.duration(400).delay(100)}
            style={styles.section}
          >
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
              APPARENCE
            </Text>

            {/* Theme Toggle Card */}
            <View style={[styles.card, { borderColor: colors.cardBorder }]}>
              <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                <LinearGradient
                  colors={
                    theme === 'dark' 
                      ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                      : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
                  }
                  style={styles.cardContent}
                >
                  <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                      <Text style={styles.settingIcon}>
                        {theme === 'dark' ? '🌙' : '☀️'}
                      </Text>
                      <View>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>
                          Mode {theme === 'dark' ? 'Sombre' : 'Clair'}
                        </Text>
                        <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                          Adapter l'interface à ton environnement
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={theme === 'dark'}
                      onValueChange={toggleTheme}
                      trackColor={{ 
                        false: colors.textTertiary, 
                        true: colors.primary 
                      }}
                      thumbColor="#ffffff"
                    />
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          </Animated.View>

          {/* Info Section */}
          <Animated.View 
            entering={FadeInDown.duration(400).delay(200)}
            style={styles.section}
          >
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
              À PROPOS
            </Text>

            <View style={[styles.card, { borderColor: colors.cardBorder }]}>
              <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.blur}>
                <LinearGradient
                  colors={
                    theme === 'dark' 
                      ? ['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']
                      : ['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)']
                  }
                  style={styles.cardContent}
                >
                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
                  </View>
                </LinearGradient>
              </BlurView>
            </View>
          </Animated.View>
        </View>
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
    paddingBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
  },
  content: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  blur: {
    overflow: 'hidden',
  },
  cardContent: {
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  settingIcon: {
    fontSize: 32,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});