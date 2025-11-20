import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
    CachedProgress,
    ConceptCompletion,
    UserProgress,
} from '../types/database';
import { STORAGE_KEYS, XP_PER_CONCEPT } from '../types/database';

// Pour l'instant, on utilise un userId mock
// Plus tard, ce sera remplacé par l'auth Supabase
const MOCK_USER_ID = 'user-001';

/**
 * Service de storage hybride :
 * - AsyncStorage comme cache rapide
 * - Supabase comme source de vérité (à implémenter)
 */
class StorageService {
  /**
   * Récupère la progression utilisateur
   * 1. Lit le cache (AsyncStorage)
   * 2. Retourne les données cachées immédiatement
   * 3. TODO: Fetch depuis Supabase en arrière-plan
   */
  async getUserProgress(gameId: string): Promise<UserProgress> {
    try {
      // 1. Lire le cache
      const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      
      if (cachedData) {
        const cached: CachedProgress = JSON.parse(cachedData);
        
        // Vérifier si le cache correspond au bon jeu
        if (cached.progress.gameId === gameId) {
          console.log('📦 Progress loaded from cache');
          
          // TODO: Sync avec Supabase en arrière-plan
          // this.syncWithSupabase(gameId);
          
          return cached.progress;
        }
      }

      // 2. Pas de cache ou mauvais jeu → créer nouvelle progression
      console.log('🆕 Creating new progress');
      const newProgress: UserProgress = {
        userId: MOCK_USER_ID,
        gameId,
        completedConcepts: [],
        currentConcept: null,
        totalXP: 0,
        streak: 0,
        lastActivityDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Sauvegarder dans le cache
      await this.saveProgressToCache(newProgress);

      return newProgress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  /**
   * Marque un concept comme complété
   */
  async completeLesson(
    gameId: string,
    conceptId: string
  ): Promise<{ progress: UserProgress; completion: ConceptCompletion }> {
    try {
      // 1. Récupérer la progression actuelle
      const progress = await this.getUserProgress(gameId);

      // 2. Vérifier si déjà complété
      if (progress.completedConcepts.includes(conceptId)) {
        console.log('⚠️ Concept already completed');
        return {
          progress,
          completion: {
            id: `completion-${conceptId}`,
            userId: MOCK_USER_ID,
            gameId,
            conceptId,
            completedAt: new Date().toISOString(),
            xpEarned: 0,
          },
        };
      }

      // 3. Calculer le streak
      const now = new Date();
      const lastActivity = new Date(progress.lastActivityDate);
      const daysDiff = Math.floor(
        (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
      );

      let newStreak = progress.streak;
      if (daysDiff === 0) {
        // Même jour, streak inchangé
        newStreak = progress.streak || 1;
      } else if (daysDiff === 1) {
        // Jour suivant, streak++
        newStreak = progress.streak + 1;
      } else {
        // Plus d'un jour, reset du streak
        newStreak = 1;
      }

      // 4. Mettre à jour la progression
      const updatedProgress: UserProgress = {
        ...progress,
        completedConcepts: [...progress.completedConcepts, conceptId],
        currentConcept: conceptId,
        totalXP: progress.totalXP + XP_PER_CONCEPT,
        streak: newStreak,
        lastActivityDate: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      // 5. Créer l'enregistrement de complétion
      const completion: ConceptCompletion = {
        id: `completion-${conceptId}-${Date.now()}`,
        userId: MOCK_USER_ID,
        gameId,
        conceptId,
        completedAt: now.toISOString(),
        xpEarned: XP_PER_CONCEPT,
      };

      // 6. Sauvegarder dans le cache
      await this.saveProgressToCache(updatedProgress);
      await this.saveCompletionToCache(completion);

      // TODO: 7. Sauvegarder dans Supabase
      // await this.saveToSupabase(updatedProgress, completion);

      console.log('✅ Lesson completed:', {
        conceptId,
        xp: updatedProgress.totalXP,
        streak: updatedProgress.streak,
      });

      return { progress: updatedProgress, completion };
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  }

  /**
   * Récupère les complétions utilisateur
   */
  async getCompletions(gameId: string): Promise<ConceptCompletion[]> {
    try {
      const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETIONS);
      
      if (cachedData) {
        const completions: ConceptCompletion[] = JSON.parse(cachedData);
        return completions.filter((c) => c.gameId === gameId);
      }

      return [];
    } catch (error) {
      console.error('Error getting completions:', error);
      return [];
    }
  }

  /**
   * Sauvegarde la progression dans le cache local
   */
  private async saveProgressToCache(progress: UserProgress): Promise<void> {
    const cached: CachedProgress = {
      progress,
      completions: await this.getCompletions(progress.gameId),
      lastSync: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROGRESS,
      JSON.stringify(cached)
    );
  }

  /**
   * Sauvegarde une complétion dans le cache local
   */
  private async saveCompletionToCache(
    completion: ConceptCompletion
  ): Promise<void> {
    const existing = await this.getCompletions(completion.gameId);
    const updated = [...existing, completion];

    await AsyncStorage.setItem(
      STORAGE_KEYS.COMPLETIONS,
      JSON.stringify(updated)
    );
  }

  /**
   * Reset toutes les données (utile pour dev/debug)
   */
  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_PROGRESS,
      STORAGE_KEYS.COMPLETIONS,
      STORAGE_KEYS.LAST_SYNC,
    ]);
    console.log('🗑️ All data cleared');
  }

  // TODO: Implémenter la sync Supabase
  // private async syncWithSupabase(gameId: string): Promise<void> {
  //   // Fetch depuis Supabase
  //   // Merge avec le cache local
  //   // Gérer les conflits
  // }
}

// Export singleton
export const storageService = new StorageService();