// lib/services/haptics.ts
// Service centralisé pour le haptic feedback

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Service de haptic feedback pour une expérience tactile engageante
 */
class HapticsService {
  private enabled: boolean = true;

  /**
   * Activer/désactiver le haptic feedback
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Feedback léger - pour les interactions subtiles
   * Ex: navigation, sélection d'option
   */
  light() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  /**
   * Feedback moyen - pour les actions importantes
   * Ex: compléter une leçon, répondre à une question
   */
  medium() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  /**
   * Feedback fort - pour les accomplissements majeurs
   * Ex: terminer un quiz, débloquer un concept
   */
  heavy() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  /**
   * Feedback de succès - pour les bonnes réponses et réussites
   */
  success() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /**
   * Feedback d'erreur - pour les mauvaises réponses
   */
  error() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }

  /**
   * Feedback d'avertissement - pour les actions à confirmer
   */
  warning() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }

  /**
   * Feedback de sélection - pour les tabs, switches
   */
  selection() {
    if (!this.enabled || Platform.OS === 'web') return;
    Haptics.selectionAsync();
  }

  /**
   * Célébration ! - Pattern de vibration pour les gros accomplissements
   * Ex: score parfait, streak milestone
   */
  async celebrate() {
    if (!this.enabled || Platform.OS === 'web') return;
    
    // Séquence de vibrations festive
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await this.delay(100);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await this.delay(100);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await this.delay(100);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  /**
   * Encouragement - Pattern pour motiver après un échec
   */
  async encourage() {
    if (!this.enabled || Platform.OS === 'web') return;
    
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await this.delay(150);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  /**
   * Compte à rebours - Pour les transitions
   */
  async countdown(count: number = 3) {
    if (!this.enabled || Platform.OS === 'web') return;
    
    for (let i = 0; i < count; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await this.delay(500);
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton
export const haptics = new HapticsService();