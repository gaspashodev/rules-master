export interface Concept {
  id: string;
  name: string;
  description: string;
  order: number;
  difficulty: number; // 1-3 étoiles
  estimatedTime: number; // minutes
  completed: boolean;
  locked: boolean;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  playerCount: string;
  playTime: string;
  concepts: Concept[];
}

export const CLANK_GAME: Game = {
  id: 'clank-001',
  name: 'Clank!',
  icon: '🐉',
  description: 'Les Aventuriers du Deck-building',
  difficulty: 'intermediate',
  playerCount: '2-4 joueurs',
  playTime: '45-60 min',
  concepts: [
    {
      id: 'concept-1',
      name: 'Les Bases',
      description: 'Objectif et déroulement',
      order: 1,
      difficulty: 1,
      estimatedTime: 3,
      completed: false,
      locked: false,
    },
    {
      id: 'concept-2',
      name: 'Deck-building',
      description: 'Gérer ton deck de cartes',
      order: 2,
      difficulty: 2,
      estimatedTime: 5,
      completed: false,
      locked: true,
    },
    {
      id: 'concept-3',
      name: 'Exploration',
      description: 'Se déplacer dans le donjon',
      order: 3,
      difficulty: 2,
      estimatedTime: 4,
      completed: false,
      locked: true,
    },
    {
      id: 'concept-4',
      name: 'Combat',
      description: 'Combattre les monstres',
      order: 4,
      difficulty: 2,
      estimatedTime: 4,
      completed: false,
      locked: true,
    },
    {
      id: 'concept-5',
      name: 'Le Dragon',
      description: 'Mécanique du Clank!',
      order: 5,
      difficulty: 3,
      estimatedTime: 6,
      completed: false,
      locked: true,
    },
    {
      id: 'concept-6',
      name: 'La Fuite',
      description: "S'échapper vivant",
      order: 6,
      difficulty: 3,
      estimatedTime: 5,
      completed: false,
      locked: true,
    },
  ],
};

// Mock data pour les stats utilisateur
export const USER_STATS = {
  totalXP: 0,
  streak: 0,
  completedConcepts: 0,
};