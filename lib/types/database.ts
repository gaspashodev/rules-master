// Types pour les données stockées localement et dans Supabase

export interface UserProgress {
  userId: string;
  gameId: string;
  completedConcepts: string[]; // IDs des concepts complétés
  currentConcept: string | null; // ID du concept en cours
  totalXP: number;
  streak: number;
  lastActivityDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface ConceptCompletion {
  id: string;
  userId: string;
  gameId: string;
  conceptId: string;
  completedAt: string;
  xpEarned: number;
}

// Structure pour AsyncStorage (cache local)
export interface CachedProgress {
  progress: UserProgress;
  completions: ConceptCompletion[];
  lastSync: string; // ISO date string
}

// Constantes
export const XP_PER_CONCEPT = 50;
export const STORAGE_KEYS = {
  USER_PROGRESS: '@rulesmaster_progress',
  COMPLETIONS: '@rulesmaster_completions',
  LAST_SYNC: '@rulesmaster_last_sync',
} as const;