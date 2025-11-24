// lib/types/quiz-history.ts
// Types pour l'historique des quiz

export interface QuizResult {
  id: string;
  userId: string;
  gameId: string;
  conceptId: string;
  quizId: string;
  score: number; // Nombre de bonnes réponses
  totalQuestions: number;
  percentage: number; // Score en pourcentage
  passed: boolean; // Si le score >= passingScore
  perfectScore: boolean; // Si 100%
  xpEarned: number;
  timeSpent: number; // En secondes
  completedAt: string; // ISO date string
  answers: QuizAnswerRecord[]; // Historique détaillé des réponses
}

export interface QuizAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number;
}

// Pour AsyncStorage
export interface CachedQuizHistory {
  results: QuizResult[];
  lastSync: string;
}

// Pour Supabase
export interface DbQuizResult {
  id: string;
  user_id: string;
  game_id: string;
  concept_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  percentage: number;
  passed: boolean;
  perfect_score: boolean;
  xp_earned: number;
  time_spent: number;
  completed_at: string;
  answers: any; // JSONB in Postgres
}