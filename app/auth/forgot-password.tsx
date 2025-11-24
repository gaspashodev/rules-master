import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../lib/contexts/ThemeContext';
import { authService } from '../../lib/services/auth';
import { getAuthErrorMessage } from '../../lib/utils/auth-errors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!email) {
      setError('Email requis');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalide');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { error: resetError } = await authService.resetPassword(email);

      if (resetError) {
        setError(getAuthErrorMessage(resetError));
        return;
      }

      // Success
      setSuccess(true);
    } catch (err) {
      setError('Une erreur est survenue. Réessaie dans un instant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Animated.View entering={FadeIn.duration(400)}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={[styles.backText, { color: colors.textSecondary }]}>← Retour</Text>
            </Pressable>
          </Animated.View>

          {/* Header */}
          <Animated.View entering={FadeIn.duration(600).delay(100)} style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Mot de passe oublié ?
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Pas de souci ! Entre ton email et nous{'\n'}
              t'enverrons un lien de réinitialisation
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.form}>
            {!success ? (
              <>
                {/* Email Input */}
                <View style={[styles.inputCard, { borderColor: colors.cardBorder }]}>
                  <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.inputBlur}>
                    <LinearGradient
                      colors={
                        theme === 'dark'
                          ? (['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)'] as const)
                          : (['rgba(0, 0, 0, 0.03)', 'rgba(0, 0, 0, 0.01)'] as const)
                      }
                      style={styles.inputContent}
                    >
                      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
                      <TextInput
                        style={[styles.input, { color: colors.text }]}
                        placeholder="ton-email@exemple.com"
                        placeholderTextColor={colors.textTertiary}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        editable={!loading}
                      />
                    </LinearGradient>
                  </BlurView>
                </View>

                {/* Error Message */}
                {error && (
                  <Animated.View entering={FadeIn.duration(300)} style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: '#ef4444' }]}>⚠️ {error}</Text>
                  </Animated.View>
                )}

                {/* Reset Button */}
                <Button onPress={handleResetPassword} style={{ opacity: loading ? 0.7 : 1 }}>
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    'Envoyer le lien'
                  )}
                </Button>
              </>
            ) : (
              /* Success Message */
              <View style={[styles.successCard, { borderColor: colors.success + '40' }]}>
                <BlurView intensity={20} tint={theme === 'dark' ? 'dark' : 'light'} style={styles.successBlur}>
                  <LinearGradient
                    colors={
                      theme === 'dark'
                        ? (['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'] as const)
                        : (['rgba(16, 185, 129, 0.08)', 'rgba(16, 185, 129, 0.03)'] as const)
                    }
                    style={styles.successContent}
                  >
                    <Text style={styles.successIcon}>✉️</Text>
                    <Text style={[styles.successTitle, { color: colors.text }]}>
                      Email envoyé !
                    </Text>
                    <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
                      Vérifie ta boîte mail {email} et clique sur le lien pour réinitialiser ton mot de passe.
                    </Text>
                    <Text style={[styles.successNote, { color: colors.textTertiary }]}>
                      Pense à vérifier tes spams 📬
                    </Text>
                  </LinearGradient>
                </BlurView>
              </View>
            )}

            {/* Back to Login Link */}
            <Pressable onPress={() => router.push('/auth/login')} style={styles.linkContainer}>
              <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                Retour à la{' '}
                <Text style={[styles.linkHighlight, { color: colors.primary }]}>
                  connexion
                </Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 32,
  },
  backText: {
    fontSize: 14,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  inputCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  inputBlur: {
    overflow: 'hidden',
  },
  inputContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    fontSize: 16,
    paddingVertical: 4,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  successCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
  },
  successBlur: {
    overflow: 'hidden',
  },
  successContent: {
    padding: 32,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  successNote: {
    fontSize: 13,
    textAlign: 'center',
  },
  linkContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    textAlign: 'center',
  },
  linkHighlight: {
    fontWeight: '600',
  },
});