import { useEffect, useState } from 'react';
import { CLANK_GAME } from '../data/clank-mock';
import { storageService } from '../services/storage';
import type { UserProgress } from '../types/database';

/**
 * Hook pour récupérer les données du jeu avec progression utilisateur
 */
export function useGame(gameId: string) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProgress();
  }, [gameId]);

  const loadProgress = async () => {
    try {
      setIsLoading(true);
      const userProgress = await storageService.getUserProgress(gameId);
      setProgress(userProgress);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enrichir les concepts avec l'état de complétion
  const enrichedGame = progress
    ? {
        ...CLANK_GAME,
        concepts: CLANK_GAME.concepts.map((concept, index) => {
          const isCompleted = progress.completedConcepts.includes(concept.id);
          const previousCompleted =
            index === 0 || progress.completedConcepts.includes(CLANK_GAME.concepts[index - 1].id);
          
          return {
            ...concept,
            completed: isCompleted,
            locked: !previousCompleted && !isCompleted,
          };
        }),
      }
    : null;

  return {
    data: enrichedGame,
    progress,
    isLoading,
    error,
    refetch: loadProgress,
  };
}

/**
 * Hook pour récupérer les stats utilisateur
 */
export function useUserStats() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const userProgress = await storageService.getUserProgress('clank-001');
      setProgress(userProgress);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: progress
      ? {
          totalXP: progress.totalXP,
          streak: progress.streak,
          completedConcepts: progress.completedConcepts.length,
        }
      : null,
    isLoading,
    refetch: loadStats,
  };
}

/**
 * Hook pour compléter une leçon
 */
export function useCompleteLesson() {
  const [isCompleting, setIsCompleting] = useState(false);

  const completeLesson = async (gameId: string, conceptId: string) => {
    try {
      setIsCompleting(true);
      const result = await storageService.completeLesson(gameId, conceptId);
      return result;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    } finally {
      setIsCompleting(false);
    }
  };

  return {
    completeLesson,
    isCompleting,
  };
}