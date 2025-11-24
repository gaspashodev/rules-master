// lib/types/quiz.ts

/**
 * Types pour le système de quiz
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  conceptId: string;
  questions: QuizQuestion[];
  passingScore: number; // Pourcentage minimum pour réussir (ex: 60)
  bonusXP: number; // XP bonus si 100%
}

export interface QuizResult {
  quizId: string;
  conceptId: string;
  userId: string;
  score: number; // Nombre de bonnes réponses
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  completedAt: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpent: number; // Secondes
}

/**
 * État du quiz pendant qu'on le passe
 */
export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  startedAt: Date;
  score: number;
}