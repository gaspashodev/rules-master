import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from './auth';
import type { DbConceptCompletion, DbUserProgress } from '../supabase';
import { supabase } from '../supabase';
import type {
  CachedProgress,
  ConceptCompletion,
  UserProgress,
} from '../types/database';
import { STORAGE_KEYS, XP_PER_CONCEPT } from '../types/database';

/**
 * Service de storage hybride :
 * - AsyncStorage comme cache rapide
 * - Supabase comme source de vérité
 */
class StorageService {
  /**
   * Récupère la progression utilisateur
   * 1. Lit le cache (AsyncStorage)
   * 2. Retourne les données cachées immédiatement
   * 3. Fetch depuis Supabase en arrière-plan et met à jour le cache
   */
  async getUserProgress(gameId: string): Promise<UserProgress> {
    try {
      // Récupérer l'utilisateur actuel
      const user = await authService.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 1. Lire le cache d'abord pour une réponse rapide
      const cachedData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      
      if (cachedData) {
        const cached: CachedProgress = JSON.parse(cachedData);
        
        // Vérifier si le cache correspond au bon jeu et utilisateur
        if (cached.progress.gameId === gameId && cached.progress.userId === user.id) {
          console.log('📦 Progress loaded from cache');
          
          // Sync avec Supabase en arrière-plan (fire and forget)
          this.syncWithSupabase(gameId, user.id).catch(console.error);
          
          return cached.progress;
        }
      }

      // 2. Pas de cache ou mauvais jeu/utilisateur → fetch depuis Supabase
      console.log('🌐 Fetching progress from Supabase');
      const progress = await this.fetchProgressFromSupabase(gameId, user.id);

      // Sauvegarder dans le cache
      await this.saveProgressToCache(progress);

      return progress;
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
      // Récupérer l'utilisateur actuel
      const user = await authService.getCurrentUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 1. Récupérer la progression actuelle
      const progress = await this.getUserProgress(gameId);

      // 2. Vérifier si déjà complété
      if (progress.completedConcepts.includes(conceptId)) {
        console.log('⚠️ Concept already completed');
        return {
          progress,
          completion: {
            id: `completion-${conceptId}`,
            userId: user.id,
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
        userId: user.id,
        gameId,
        conceptId,
        completedAt: now.toISOString(),
        xpEarned: XP_PER_CONCEPT,
      };

      // 6. Sauvegarder dans Supabase
      await this.saveToSupabase(updatedProgress, completion);

      // 7. Sauvegarder dans le cache
      await this.saveProgressToCache(updatedProgress);
      await this.saveCompletionToCache(completion);

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
   * Fetch la progression depuis Supabase
   */
  private async fetchProgressFromSupabase(
    gameId: string,
    userId: string
  ): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, c'est OK
      throw error;
    }

    if (!data) {
      // Créer une nouvelle progression
      const newProgress: UserProgress = {
        userId,
        gameId,
        completedConcepts: [],
        currentConcept: null,
        totalXP: 0,
        streak: 0,
        lastActivityDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // L'insérer dans Supabase
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert([this.progressToDb(newProgress)]);

      if (insertError) {
        throw insertError;
      }

      return newProgress;
    }

    // Convertir depuis le format DB
    return this.dbToProgress(data);
  }

  /**
   * Sync avec Supabase en arrière-plan
   */
  private async syncWithSupabase(gameId: string, userId: string): Promise<void> {
    try {
      const freshProgress = await this.fetchProgressFromSupabase(gameId, userId);
      await this.saveProgressToCache(freshProgress);
      console.log('🔄 Synced with Supabase');
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  /**
   * Sauvegarde dans Supabase
   */
  private async saveToSupabase(
    progress: UserProgress,
    completion: ConceptCompletion
  ): Promise<void> {
    // 1. Upsert la progression
    const { error: progressError } = await supabase
      .from('user_progress')
      .upsert([this.progressToDb(progress)], {
        onConflict: 'user_id,game_id',
      });

    if (progressError) {
      throw progressError;
    }

    // 2. Insérer la complétion
    const { error: completionError } = await supabase
      .from('concept_completions')
      .insert([this.completionToDb(completion)]);

    if (completionError) {
      throw completionError;
    }

    console.log('💾 Saved to Supabase');
  }

  /**
   * Convertit UserProgress vers le format DB
   */
  private progressToDb(progress: UserProgress): DbUserProgress {
    return {
      id: progress.userId + '-' + progress.gameId, // Composite key
      user_id: progress.userId,
      game_id: progress.gameId,
      completed_concepts: progress.completedConcepts,
      current_concept: progress.currentConcept,
      total_xp: progress.totalXP,
      streak: progress.streak,
      last_activity_date: progress.lastActivityDate,
      created_at: progress.createdAt,
      updated_at: progress.updatedAt,
    };
  }

  /**
   * Convertit depuis le format DB vers UserProgress
   */
  private dbToProgress(db: DbUserProgress): UserProgress {
    return {
      userId: db.user_id,
      gameId: db.game_id,
      completedConcepts: db.completed_concepts,
      currentConcept: db.current_concept,
      totalXP: db.total_xp,
      streak: db.streak,
      lastActivityDate: db.last_activity_date,
      createdAt: db.created_at,
      updatedAt: db.updated_at,
    };
  }

  /**
   * Convertit ConceptCompletion vers le format DB
   */
  private completionToDb(completion: ConceptCompletion): DbConceptCompletion {
    return {
      id: completion.id,
      user_id: completion.userId,
      game_id: completion.gameId,
      concept_id: completion.conceptId,
      completed_at: completion.completedAt,
      xp_earned: completion.xpEarned,
    };
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
}

// Export singleton
export const storageService = new StorageService();
