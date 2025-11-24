// lib/data/clank-quizzes.ts

import type { Quiz, QuizQuestion } from '../types/quiz';

/**
 * Quiz pour le concept "Les Bases"
 */
const LES_BASES_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-bases',
    question: "Quel est l'objectif principal du jeu ?",
    options: [
      { id: 'a', text: 'Tuer le dragon', isCorrect: false },
      { id: 'b', text: 'Voler un artefact et sortir vivant', isCorrect: true },
      { id: 'c', text: 'Accumuler le plus de cartes possible', isCorrect: false },
      { id: 'd', text: 'Vaincre tous les monstres', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "L'objectif est de voler un artefact et de sortir vivant du donjon. Sans artefact, tu ne peux pas gagner !",
    difficulty: 'easy',
  },
  {
    id: 'q2-bases',
    question: "Que se passe-t-il si tu sors du donjon sans artefact ?",
    options: [
      { id: 'a', text: 'Tu gagnes quand même si tu as assez de points', isCorrect: false },
      { id: 'b', text: 'Tu peux retourner chercher un artefact', isCorrect: false },
      { id: 'c', text: 'Tu ne peux pas gagner, même si tu es vivant', isCorrect: true },
      { id: 'd', text: 'Tu perds la moitié de tes points', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Sans artefact, tu ne peux PAS gagner, même si tu sors vivant. L'artefact est obligatoire pour la victoire !",
    difficulty: 'easy',
  },
  {
    id: 'q3-bases',
    question: "À ton tour, tu joues combien de cartes de ta main ?",
    options: [
      { id: 'a', text: '3 cartes', isCorrect: false },
      { id: 'b', text: '5 cartes', isCorrect: true },
      { id: 'c', text: '7 cartes', isCorrect: false },
      { id: 'd', text: "Autant que tu veux", isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Chaque tour, tu joues TOUTES les 5 cartes de ta main, tu ne peux pas en garder.",
    difficulty: 'medium',
  },
  {
    id: 'q4-bases',
    question: "Comment gagnes-tu des points ?",
    options: [
      { id: 'a', text: 'Seulement avec les artefacts', isCorrect: false },
      { id: 'b', text: 'Artefacts, trésors, cartes et monstres vaincus', isCorrect: true },
      { id: 'c', text: 'En sortant en premier du donjon', isCorrect: false },
      { id: 'd', text: 'En minimisant ton Clank', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Tu gagnes des points via plusieurs sources : artefacts, trésors ramassés, valeur des cartes achetées, et monstres vaincus.",
    difficulty: 'medium',
  },
  {
    id: 'q5-bases',
    question: "Que se passe-t-il quand le premier joueur sort avec un artefact ?",
    options: [
      { id: 'a', text: 'La partie se termine immédiatement', isCorrect: false },
      { id: 'b', text: 'Les autres ont 4 tours pour sortir', isCorrect: true },
      { id: 'c', text: 'Rien, le jeu continue normalement', isCorrect: false },
      { id: 'd', text: 'Les autres joueurs perdent automatiquement', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Quand le premier joueur sort avec un artefact, un compte à rebours de 4 tours commence pour les autres joueurs !",
    difficulty: 'hard',
  },
];

/**
 * Quiz complet pour "Les Bases"
 */
export const LES_BASES_QUIZ: Quiz = {
  id: 'quiz-concept-1',
  conceptId: 'concept-1',
  questions: LES_BASES_QUESTIONS,
  passingScore: 60, // 60% minimum pour réussir (3/5)
  bonusXP: 25, // XP bonus si 100%
};

/**
 * Tous les quiz du jeu Clank
 */
export const CLANK_QUIZZES: Quiz[] = [
  LES_BASES_QUIZ,
  // TODO: Ajouter les quiz pour les autres concepts quand les leçons seront complètes
];

/**
 * Récupérer un quiz par conceptId
 */
export function getQuizByConcept(conceptId: string): Quiz | undefined {
  return CLANK_QUIZZES.find(quiz => quiz.conceptId === conceptId);
}

/**
 * Vérifier si un concept a un quiz
 */
export function hasQuiz(conceptId: string): boolean {
  return CLANK_QUIZZES.some(quiz => quiz.conceptId === conceptId);
}