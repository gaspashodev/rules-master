// lib/services/quiz-history.ts
// Service pour gérer l'historique des quiz

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import type { CachedQuizHistory, DbQuizResult, QuizResult } from '../types/quiz-history';
import { authService } from './auth';

const QUIZ_HISTORY_KEY = '@rulesmaster_quiz_history';

/**
 * Service pour gérer l'historique des quiz
 */
class QuizHistoryService {
  /**
   * Sauvegarder un résultat de quiz
   */
  async saveQuizResult(result: QuizResult): Promise<void> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // 1. Sauvegarder dans le cache local
      await this.saveToCache(result);

      // 2. Sauvegarder dans Supabase
      const dbResult: DbQuizResult = {
        id: result.id,
        user_id: result.userId,
        game_id: result.gameId,
        concept_id: result.conceptId,
        quiz_id: result.quizId,
        score: result.score,
        total_questions: result.totalQuestions,
        percentage: result.percentage,
        passed: result.passed,
        perfect_score: result.perfectScore,
        xp_earned: result.xpEarned,
        time_spent: result.timeSpent,
        completed_at: result.completedAt,
        answers: result.answers,
      };

      const { error } = await supabase
        .from('quiz_results')
        .insert([dbResult]);

      if (error) {
        console.error('Error saving quiz result to Supabase:', error);
        // On continue quand même, le cache local a la donnée
      } else {
        console.log('✅ Quiz result saved to Supabase');
      }
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'historique des quiz pour un concept
   */
  async getQuizHistory(conceptId: string): Promise<QuizResult[]> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        return [];
      }

      // 1. Lire le cache d'abord
      const cached = await this.loadFromCache();
      const cachedResults = cached.filter(r => r.conceptId === conceptId);

      // 2. Sync avec Supabase en arrière-plan
      this.syncWithSupabase(conceptId, user.id).catch(console.error);

      return cachedResults;
    } catch (error) {
      console.error('Error getting quiz history:', error);
      return [];
    }
  }

  /**
   * Récupérer le meilleur score pour un concept
   */
  async getBestScore(conceptId: string): Promise<QuizResult | null> {
    try {
      const history = await this.getQuizHistory(conceptId);
      if (history.length === 0) {
        return null;
      }

      // Trier par score décroissant
      const sorted = history.sort((a, b) => b.percentage - a.percentage);
      return sorted[0];
    } catch (error) {
      console.error('Error getting best score:', error);
      return null;
    }
  }

  /**
   * Récupérer le dernier quiz tenté pour un concept
   */
  async getLastAttempt(conceptId: string): Promise<QuizResult | null> {
    try {
      const history = await this.getQuizHistory(conceptId);
      if (history.length === 0) {
        return null;
      }

      // Trier par date décroissante
      const sorted = history.sort((a, b) => 
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
      return sorted[0];
    } catch (error) {
      console.error('Error getting last attempt:', error);
      return null;
    }
  }

  /**
   * Compter le nombre de tentatives pour un concept
   */
  async getAttemptCount(conceptId: string): Promise<number> {
    try {
      const history = await this.getQuizHistory(conceptId);
      return history.length;
    } catch (error) {
      console.error('Error getting attempt count:', error);
      return 0;
    }
  }

  /**
   * Vérifier si l'utilisateur a réussi le quiz au moins une fois
   */
  async hasPassedQuiz(conceptId: string): Promise<boolean> {
    try {
      const history = await this.getQuizHistory(conceptId);
      return history.some(r => r.passed);
    } catch (error) {
      console.error('Error checking quiz pass:', error);
      return false;
    }
  }

  /**
   * Sauvegarder dans le cache local
   */
  private async saveToCache(result: QuizResult): Promise<void> {
    try {
      const existing = await this.loadFromCache();
      const updated = [...existing, result];

      const cached: CachedQuizHistory = {
        results: updated,
        lastSync: new Date().toISOString(),
      };

      await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(cached));
      console.log('💾 Quiz result saved to cache');
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  /**
   * Charger depuis le cache local
   */
  private async loadFromCache(): Promise<QuizResult[]> {
    try {
      const data = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
      if (!data) {
        return [];
      }

      const cached: CachedQuizHistory = JSON.parse(data);
      return cached.results || [];
    } catch (error) {
      console.error('Error loading from cache:', error);
      return [];
    }
  }

  /**
   * Synchroniser avec Supabase
   */
  private async syncWithSupabase(conceptId: string, userId: string): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .eq('concept_id', conceptId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Sync error:', error);
        return;
      }

      if (data && data.length > 0) {
        // Convertir et mettre à jour le cache
        const results: QuizResult[] = data.map(this.dbToResult);
        
        // Merger avec le cache existant
        const existing = await this.loadFromCache();
        const merged = this.mergeResults(existing, results);

        const cached: CachedQuizHistory = {
          results: merged,
          lastSync: new Date().toISOString(),
        };

        await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(cached));
        console.log('🔄 Synced quiz history from Supabase');
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  /**
   * Merger les résultats (éviter les doublons)
   */
  private mergeResults(local: QuizResult[], remote: QuizResult[]): QuizResult[] {
    const map = new Map<string, QuizResult>();

    // Ajouter les locaux
    local.forEach(r => map.set(r.id, r));

    // Ajouter les remote (écrase les locaux si même ID)
    remote.forEach(r => map.set(r.id, r));

    return Array.from(map.values());
  }

  /**
   * Convertir DB → QuizResult
   */
  private dbToResult(db: DbQuizResult): QuizResult {
    return {
      id: db.id,
      userId: db.user_id,
      gameId: db.game_id,
      conceptId: db.concept_id,
      quizId: db.quiz_id,
      score: db.score,
      totalQuestions: db.total_questions,
      percentage: db.percentage,
      passed: db.passed,
      perfectScore: db.perfect_score,
      xpEarned: db.xp_earned,
      timeSpent: db.time_spent,
      completedAt: db.completed_at,
      answers: db.answers,
    };
  }

  /**
   * Nettoyer l'historique (debug)
   */
  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(QUIZ_HISTORY_KEY);
    console.log('🗑️ Quiz history cleared');
  }
}

// Export singleton
export const quizHistoryService = new QuizHistoryService();