export interface LessonSection {
  type: 'text' | 'image' | 'tip' | 'example';
  title?: string;
  content: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  order: number;
  difficulty: number; // 1-3 étoiles
  estimatedTime: number; // minutes
  completed: boolean;
  locked: boolean;
  lesson: {
    introduction: string;
    sections: LessonSection[];
    summary: string;
  };
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
      lesson: {
        introduction: "Bienvenue dans Clank! Tu incarnes un voleur qui s'aventure dans un donjon rempli de trésors... et gardé par un dragon 🐉",
        sections: [
          {
            type: 'text',
            title: "L'objectif du jeu",
            content: "Ton but est simple : descendre dans le donjon, voler un artefact précieux, et ressortir vivant avec le maximum de points. Mais attention, plus tu fais de bruit (Clank!), plus tu risques de réveiller le dragon !"
          },
          {
            type: 'tip',
            content: "💡 Le gagnant est celui qui a le plus de points À CONDITION d'être sorti vivant du donjon. Si tu meurs à l'intérieur, tu ne peux pas gagner !"
          },
          {
            type: 'text',
            title: 'Comment gagner des points ?',
            content: "Tu marques des points grâce à :\n• L'artefact que tu voles (obligatoire pour gagner)\n• Les trésors ramassés\n• Les objets achetés\n• Les bonus de tes cartes"
          },
          {
            type: 'example',
            title: 'Exemple de partie',
            content: "Alice descend rapidement, prend un artefact basique (5 points) et remonte vite → elle termine avec 28 points.\n\nBob prend son temps, accumule des trésors et prend un artefact majeur (10 points) → il termine avec 42 points et gagne !"
          },
          {
            type: 'text',
            title: 'Le déroulement',
            content: "Chaque joueur joue à tour de rôle. À ton tour, tu :\n1. Joues 5 cartes de ta main\n2. Achètes de nouvelles cartes\n3. Te déplaces sur le plateau\n4. Défausses ta main et pioches 5 nouvelles cartes"
          }
        ],
        summary: "Clank! est un jeu où tu dois voler un artefact et sortir vivant pour gagner. Le risque et la récompense sont au cœur du gameplay : plus tu restes longtemps, plus tu gagnes de points... mais plus tu risques de mourir !"
      }
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
      lesson: {
        introduction: "Le deck-building est le cœur de Clank! Tu vas constamment améliorer ton paquet de cartes pour devenir plus efficace.",
        sections: [
          {
            type: 'text',
            title: 'Ton deck de départ',
            content: "Tu commences avec 10 cartes basiques :\n• 6 cartes Cambriolage (1 Compétence chacune)\n• 2 cartes Passe-partout (1 Mouvement chacune)\n• 2 cartes Trébucher (ne font rien et font du Clank!)"
          }
        ],
        summary: "Le deck-building te permet d'améliorer progressivement tes capacités en achetant de meilleures cartes."
      }
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
      lesson: {
        introduction: "Le plateau représente le donjon. Tu vas devoir naviguer intelligemment pour voler ton artefact et en ressortir.",
        sections: [
          {
            type: 'text',
            title: 'Les zones du donjon',
            content: "Le donjon est divisé en plusieurs zones avec des difficultés croissantes. Plus tu descends profondément, plus les trésors sont précieux !"
          }
        ],
        summary: "L'exploration est un équilibre entre risque et récompense : descends profondément pour les meilleurs trésors, mais garde assez d'énergie pour remonter !"
      }
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
      lesson: {
        introduction: "Certaines salles contiennent des monstres. Les vaincre te rapporte des points et parfois des bonus !",
        sections: [
          {
            type: 'text',
            title: 'Comment combattre',
            content: "Les cartes avec un symbole ⚔️ te donnent des points de Combat. Si tu as assez de points, tu peux vaincre un monstre pendant ton tour."
          }
        ],
        summary: "Le combat est optionnel mais peut te rapporter des points précieux. Gère bien tes cartes de combat !"
      }
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
      lesson: {
        introduction: "Le dragon est la menace principale du jeu. Chaque fois que tu fais du bruit (Clank!), tu risques de te faire attaquer !",
        sections: [
          {
            type: 'text',
            title: 'Comment ça marche ?',
            content: "Quand tu fais du Clank!, tu places des cubes de ta couleur dans le sac du dragon. Quand le dragon attaque, on pioche des cubes : si c'est ta couleur, tu prends des dégâts !"
          }
        ],
        summary: "Minimise ton Clank! pour éviter les attaques du dragon. C'est la clé de la survie !"
      }
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
      lesson: {
        introduction: "Une fois ton artefact volé, il faut sortir du donjon avant que le dragon ne te tue !",
        sections: [
          {
            type: 'text',
            title: 'Quand partir ?',
            content: "Dès que le premier joueur sort avec un artefact, le compte à rebours commence. Les autres joueurs n'ont plus que 4 tours pour sortir, sinon ils sont coincés !"
          }
        ],
        summary: "La fuite est une course contre la montre. Ne sois pas trop gourmand ou tu risques de tout perdre !"
      }
    },
  ],
};

// Mock data pour les stats utilisateur
export const USER_STATS = {
  totalXP: 0,
  streak: 0,
  completedConcepts: 0,
};