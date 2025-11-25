// lib/data/clank-quizzes.ts
// VERSION COMPLÈTE avec les 6 quiz

import type { Quiz, QuizQuestion } from '../types/quiz';

// ========================================
// QUIZ 1 : LES BASES (déjà existant)
// ========================================
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

export const LES_BASES_QUIZ: Quiz = {
  id: 'quiz-concept-1',
  conceptId: 'concept-1',
  questions: LES_BASES_QUESTIONS,
  passingScore: 60,
  bonusXP: 25,
};

// ========================================
// QUIZ 2 : DECK-BUILDING (NOUVEAU)
// ========================================
const DECK_BUILDING_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-deck',
    question: "Que se passe-t-il avec les cartes que tu achètes ?",
    options: [
      { id: 'a', text: 'Tu les joues immédiatement', isCorrect: false },
      { id: 'b', text: 'Elles vont dans ta défausse', isCorrect: true },
      { id: 'c', text: 'Elles vont dans ta main', isCorrect: false },
      { id: 'd', text: 'Elles sont retirées du jeu', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les cartes achetées vont dans ta défausse et reviendront dans ta main lors d'un prochain tour, quand tu mélangeras ton deck.",
    difficulty: 'easy',
  },
  {
    id: 'q2-deck',
    question: "Quelle est la MAUVAISE carte de ton deck de départ ?",
    options: [
      { id: 'a', text: 'Burgle (Cambriolage)', isCorrect: false },
      { id: 'b', text: 'Sidestep (Pas de côté)', isCorrect: false },
      { id: 'c', text: 'Stumble (Faux pas)', isCorrect: true },
      { id: 'd', text: 'Scramble (Se faufiler)', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Stumble fait du Clank! sans donner aucune ressource utile. C'est une carte à retirer dès que possible !",
    difficulty: 'easy',
  },
  {
    id: 'q3-deck',
    question: "À quoi sert la ressource SKILL (Compétence) ?",
    options: [
      { id: 'a', text: 'Combattre des monstres', isCorrect: false },
      { id: 'b', text: 'Se déplacer dans le donjon', isCorrect: false },
      { id: 'c', text: 'Acheter de nouvelles cartes', isCorrect: true },
      { id: 'd', text: 'Acheter des objets au Market', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Le Skill sert uniquement à acheter de nouvelles cartes pour améliorer ton deck. Les objets au Market s'achètent avec de l'Or.",
    difficulty: 'medium',
  },
  {
    id: 'q4-deck',
    question: "Qu'est-ce qu'une carte Device (bannière pourpre) ?",
    options: [
      { id: 'a', text: 'Une carte que tu gardes pour toujours', isCorrect: false },
      { id: 'b', text: 'Une carte avec un effet immédiat qui ne va pas dans ton deck', isCorrect: true },
      { id: 'c', text: 'Une carte plus puissante que les autres', isCorrect: false },
      { id: 'd', text: 'Une carte qui coûte plus cher', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les cartes Device donnent un effet immédiat (USE) puis sont défaussées. Elles ne vont jamais dans ton deck, c'est un boost ponctuel !",
    difficulty: 'medium',
  },
  {
    id: 'q5-deck',
    question: "Quelle est la meilleure stratégie pour un deck efficace ?",
    options: [
      { id: 'a', text: 'Acheter le plus de cartes possible', isCorrect: false },
      { id: 'b', text: 'Acheter des cartes puissantes et retirer les cartes faibles', isCorrect: true },
      { id: 'c', text: 'Garder toutes les cartes de départ', isCorrect: false },
      { id: 'd', text: "N'acheter que des cartes qui donnent des Boots", isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Un bon deck est un deck de qualité, pas de quantité ! Achète des cartes puissantes et retire les cartes faibles comme Stumble pour maximiser ton efficacité.",
    difficulty: 'hard',
  },
];

export const DECK_BUILDING_QUIZ: Quiz = {
  id: 'quiz-concept-2',
  conceptId: 'concept-2',
  questions: DECK_BUILDING_QUESTIONS,
  passingScore: 60,
  bonusXP: 25,
};

// ========================================
// QUIZ 3 : EXPLORATION (NOUVEAU)
// ========================================
const EXPLORATION_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-explo',
    question: "Combien de Boots faut-il pour traverser un tunnel normal ?",
    options: [
      { id: 'a', text: '1 Boot', isCorrect: true },
      { id: 'b', text: '2 Boots', isCorrect: false },
      { id: 'c', text: 'Ça dépend du tunnel', isCorrect: false },
      { id: 'd', text: 'Aucune, les tunnels sont gratuits', isCorrect: false },
    ],
    correctAnswerId: 'a',
    explanation: "Un tunnel normal coûte 1 Boot. Seuls les tunnels avec le symbole 🥾🥾 nécessitent 2 Boots.",
    difficulty: 'easy',
  },
  {
    id: 'q2-explo',
    question: "Que se passe-t-il quand tu entres dans une Crystal Cave ?",
    options: [
      { id: 'a', text: 'Tu gagnes 1 Boot gratuit', isCorrect: false },
      { id: 'b', text: 'Tu perds toutes tes Boots restantes', isCorrect: true },
      { id: 'c', text: 'Tu dois combattre un monstre', isCorrect: false },
      { id: 'd', text: 'Tu peux ressortir du donjon directement', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les Crystal Caves te font perdre toutes tes Boots restantes. Tu es obligé de t'arrêter, sauf avec le Flying Carpet.",
    difficulty: 'easy',
  },
  {
    id: 'q3-explo',
    question: "Comment traverses-tu un tunnel avec l'icône de monstre 👹 ?",
    options: [
      { id: 'a', text: 'Tu dois combattre un monstre', isCorrect: false },
      { id: 'b', text: 'Tu perds 1 PV par masque OU tu dépenses 1 Épée par masque', isCorrect: true },
      { id: 'c', text: "C'est impossible sans une Master Key", isCorrect: false },
      { id: 'd', text: 'Tu dois avoir au moins 5 PV', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les tunnels à monstres te font perdre 1 PV par masque, SAUF si tu dépenses 1 Épée par masque pour éviter les dégâts.",
    difficulty: 'medium',
  },
  {
    id: 'q4-explo',
    question: "Combien de jetons peux-tu prendre quand tu entres dans une salle ?",
    options: [
      { id: 'a', text: 'Tous les jetons disponibles', isCorrect: false },
      { id: 'b', text: '1 seul jeton', isCorrect: true },
      { id: 'c', text: '2 jetons maximum', isCorrect: false },
      { id: 'd', text: 'Autant que tu veux si tu as un Backpack', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Tu ne peux prendre qu'UN SEUL jeton par visite. Pour en prendre un autre, tu dois sortir de la salle et y revenir.",
    difficulty: 'medium',
  },
  {
    id: 'q5-explo',
    question: "Que se passe-t-il si tu es assommé dans les Profondeurs sans artefact ?",
    options: [
      { id: 'a', text: 'Les villageois te secourent', isCorrect: false },
      { id: 'b', text: 'Tu continues à jouer avec 1 PV', isCorrect: false },
      { id: 'c', text: 'Tu es éliminé du jeu', isCorrect: true },
      { id: 'd', text: 'Tu perds seulement la moitié de tes points', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Si tu es assommé dans les Profondeurs sans artefact, tu es trop loin pour être secouru. Tu es éliminé et ne peux pas gagner !",
    difficulty: 'hard',
  },
];

export const EXPLORATION_QUIZ: Quiz = {
  id: 'quiz-concept-3',
  conceptId: 'concept-3',
  questions: EXPLORATION_QUESTIONS,
  passingScore: 60,
  bonusXP: 25,
};

// ========================================
// QUIZ 4 : COMBAT (NOUVEAU)
// ========================================
const COMBAT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-combat',
    question: "Comment vaincre un monstre du Dungeon Row ?",
    options: [
      { id: 'a', text: 'Avec des Compétences (Skill)', isCorrect: false },
      { id: 'b', text: 'Avec des Épées (Swords)', isCorrect: true },
      { id: 'c', text: 'Avec des Bottes (Boots)', isCorrect: false },
      { id: 'd', text: 'Avec de l\'Or', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les monstres se combattent avec des Épées. Le nombre d'Épées nécessaire est indiqué en bas à droite de la carte monstre.",
    difficulty: 'easy',
  },
  {
    id: 'q2-combat',
    question: "Qu'obtiens-tu en battant le Goblin de la Réserve ?",
    options: [
      { id: 'a', text: '1 Or', isCorrect: true },
      { id: 'b', text: '2 Compétences', isCorrect: false },
      { id: 'c', text: '1 point de victoire', isCorrect: false },
      { id: 'd', text: '1 Boot', isCorrect: false },
    ],
    correctAnswerId: 'a',
    explanation: "Le Goblin donne 1 Or chaque fois que tu le bats. Tu peux le combattre plusieurs fois dans le même tour !",
    difficulty: 'easy',
  },
  {
    id: 'q3-combat',
    question: "Que devient une carte monstre après que tu l'aies vaincue ?",
    options: [
      { id: 'a', text: 'Elle va dans ton deck', isCorrect: false },
      { id: 'b', text: 'Elle est retirée du jeu', isCorrect: false },
      { id: 'c', text: 'Elle va dans la défausse du Dungeon Deck', isCorrect: true },
      { id: 'd', text: 'Elle retourne dans la Réserve', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Après avoir vaincu un monstre, tu gagnes sa récompense et la carte va dans la défausse du Dungeon Deck. Une nouvelle carte prend sa place.",
    difficulty: 'medium',
  },
  {
    id: 'q4-combat',
    question: "Combien de fois peux-tu combattre le Goblin dans un même tour ?",
    options: [
      { id: 'a', text: 'Une seule fois', isCorrect: false },
      { id: 'b', text: 'Deux fois maximum', isCorrect: false },
      { id: 'c', text: 'Autant de fois que tu as d\'Épées', isCorrect: true },
      { id: 'd', text: 'Le Goblin ne peut pas être combattu', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Le Goblin peut être combattu autant de fois que tu as d'Épées ! C'est excellent pour convertir tes Épées en Or.",
    difficulty: 'medium',
  },
  {
    id: 'q5-combat',
    question: "Quelle est la différence entre un monstre du Dungeon Row et un tunnel à monstres ?",
    options: [
      { id: 'a', text: 'Il n\'y a pas de différence', isCorrect: false },
      { id: 'b', text: 'Les monstres du Dungeon Row donnent des récompenses', isCorrect: true },
      { id: 'c', text: 'Les tunnels à monstres coûtent plus d\'Épées', isCorrect: false },
      { id: 'd', text: 'On ne peut pas éviter les monstres du Dungeon Row', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les monstres du Dungeon Row donnent des récompenses (Or, points, effets). Les tunnels à monstres te font juste perdre des PV sans récompense. Combat les premiers, évite les seconds !",
    difficulty: 'hard',
  },
];

export const COMBAT_QUIZ: Quiz = {
  id: 'quiz-concept-4',
  conceptId: 'concept-4',
  questions: COMBAT_QUESTIONS,
  passingScore: 60,
  bonusXP: 25,
};

// ========================================
// QUIZ 5 : LE DRAGON (NOUVEAU)
// ========================================
const DRAGON_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-dragon',
    question: "Que se passe-t-il quand tu fais du Clank! ?",
    options: [
      { id: 'a', text: 'Tu perds des points immédiatement', isCorrect: false },
      { id: 'b', text: 'Tu ajoutes des cubes de ta couleur dans la Clank! Area', isCorrect: true },
      { id: 'c', text: 'Le dragon attaque immédiatement', isCorrect: false },
      { id: 'd', text: 'Tu perds 1 PV', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Faire du Clank! signifie ajouter des cubes de ta couleur dans la Clank! Area. Ces cubes y restent jusqu'à une attaque du dragon.",
    difficulty: 'easy',
  },
  {
    id: 'q2-dragon',
    question: "Quand le dragon attaque-t-il ?",
    options: [
      { id: 'a', text: 'À chaque tour', isCorrect: false },
      { id: 'b', text: 'Quand une carte avec le symbole 🐉 Dragon Attack apparaît', isCorrect: true },
      { id: 'c', text: 'Quand un joueur prend un artefact', isCorrect: false },
      { id: 'd', text: 'Quand un joueur fait plus de 3 Clank!', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Le dragon attaque uniquement quand une carte avec le symbole 🐉 Dragon Attack est révélée en remplissant le Dungeon Row.",
    difficulty: 'easy',
  },
  {
    id: 'q3-dragon',
    question: "Que fait la piste de rage du dragon ?",
    options: [
      { id: 'a', text: 'Elle détermine combien de cubes sont tirés lors d\'une attaque', isCorrect: true },
      { id: 'b', text: 'Elle détermine combien de PV tu perds', isCorrect: false },
      { id: 'c', text: 'Elle détermine la fréquence des attaques', isCorrect: false },
      { id: 'd', text: 'Elle ne sert à rien', isCorrect: false },
    ],
    correctAnswerId: 'a',
    explanation: "La piste de rage indique combien de cubes sont tirés du sac lors d'une attaque. Plus elle est haute, plus le dragon est dangereux !",
    difficulty: 'medium',
  },
  {
    id: 'q4-dragon',
    question: "Qu'est-ce qu'une carte Danger (⚠️) ?",
    options: [
      { id: 'a', text: 'Une carte qui fait beaucoup de Clank!', isCorrect: false },
      { id: 'b', text: 'Une carte qui fait tirer +1 cube supplémentaire lors des attaques', isCorrect: true },
      { id: 'c', text: 'Une carte qui déclenche une attaque immédiate', isCorrect: false },
      { id: 'd', text: 'Une carte que tu ne peux pas acheter', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Les cartes Danger augmentent la dangerosité du dragon : +1 cube tiré par carte Danger visible. Essaie de les retirer du Dungeon Row !",
    difficulty: 'medium',
  },
  {
    id: 'q5-dragon',
    question: "Que se passe-t-il si tu n'as plus de cubes dans ta réserve ?",
    options: [
      { id: 'a', text: 'Tu es éliminé du jeu', isCorrect: false },
      { id: 'b', text: 'Tu ne peux plus jouer', isCorrect: false },
      { id: 'c', text: 'Tu ne fais plus de Clank! (gratuit) mais ne peux plus perdre de PV volontairement', isCorrect: true },
      { id: 'd', text: 'Tu dois acheter de nouveaux cubes', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Être à court de cubes a deux effets : tu ne fais plus de Clank! gratuitement, mais tu ne peux plus traverser les tunnels à monstres en perdant des PV (il te faut des Épées).",
    difficulty: 'hard',
  },
];

export const DRAGON_QUIZ: Quiz = {
  id: 'quiz-concept-5',
  conceptId: 'concept-5',
  questions: DRAGON_QUESTIONS,
  passingScore: 60,
  bonusXP: 25,
};

// ========================================
// QUIZ 6 : LA FUITE (NOUVEAU)
// ========================================
const FUITE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-fuite',
    question: "Combien de tours ont les autres joueurs après que le premier soit sorti ?",
    options: [
      { id: 'a', text: '2 tours', isCorrect: false },
      { id: 'b', text: '4 tours', isCorrect: true },
      { id: 'c', text: '6 tours', isCorrect: false },
      { id: 'd', text: 'Temps illimité', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Dès que le premier joueur sort avec un artefact, les autres ont exactement 4 tours pour sortir ou être secourus, sinon ils sont assommés !",
    difficulty: 'easy',
  },
  {
    id: 'q2-fuite',
    question: "Que vaut le Mastery Token ?",
    options: [
      { id: 'a', text: '10 points', isCorrect: false },
      { id: 'b', text: '20 points', isCorrect: true },
      { id: 'c', text: '30 points', isCorrect: false },
      { id: 'd', text: '5 points', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Le Mastery Token vaut 20 points de victoire ! Tu le reçois si tu sors du donjon VIVANT (pas assommé) avec au moins un artefact.",
    difficulty: 'easy',
  },
  {
    id: 'q3-fuite',
    question: "Que se passe-t-il pendant le compte à rebours ?",
    options: [
      { id: 'a', text: 'Rien de spécial', isCorrect: false },
      { id: 'b', text: 'Le dragon attaque avec des cubes supplémentaires', isCorrect: true },
      { id: 'c', text: 'Les joueurs gagnent des points bonus', isCorrect: false },
      { id: 'd', text: 'Les monstres deviennent plus faibles', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "Pendant le compte à rebours, les attaques du dragon deviennent de plus en plus violentes : +1, +2, puis +3 cubes supplémentaires !",
    difficulty: 'medium',
  },
  {
    id: 'q4-fuite',
    question: "Peux-tu être secouru si tu es dans les Profondeurs ?",
    options: [
      { id: 'a', text: 'Oui, toujours', isCorrect: false },
      { id: 'b', text: 'Oui, si tu as un artefact', isCorrect: false },
      { id: 'c', text: 'Non, tu es éliminé', isCorrect: true },
      { id: 'd', text: 'Oui, si tu as plus de 5 PV', isCorrect: false },
    ],
    correctAnswerId: 'c',
    explanation: "Si tu es assommé dans les Profondeurs, tu es trop loin pour être secouru, même avec un artefact. Tu es éliminé du jeu !",
    difficulty: 'medium',
  },
  {
    id: 'q5-fuite',
    question: "Que se passe-t-il à la case 5 du compte à rebours ?",
    options: [
      { id: 'a', text: 'La partie se termine', isCorrect: false },
      { id: 'b', text: 'Tous les joueurs encore dans le donjon sont assommés', isCorrect: true },
      { id: 'c', text: 'Le dragon disparaît', isCorrect: false },
      { id: 'd', text: 'Les joueurs gagnent un artefact gratuit', isCorrect: false },
    ],
    correctAnswerId: 'b',
    explanation: "À la case 5 du compte à rebours, c'est game over pour ceux qui sont encore dans le donjon : ils sont tous assommés, quelle que soit leur santé !",
    difficulty: 'hard',
  },
];

export const FUITE_QUIZ: Quiz = {
  id: 'quiz-concept-6',
  conceptId: 'concept-6',
  questions: FUITE_QUESTIONS,
  passingScore: 60,
  bonusXP: 25,
};

// ========================================
// EXPORT GLOBAL
// ========================================
export const CLANK_QUIZZES: Quiz[] = [
  LES_BASES_QUIZ,
  DECK_BUILDING_QUIZ,
  EXPLORATION_QUIZ,
  COMBAT_QUIZ,
  DRAGON_QUIZ,
  FUITE_QUIZ,
];

export function getQuizByConcept(conceptId: string): Quiz | undefined {
  return CLANK_QUIZZES.find(quiz => quiz.conceptId === conceptId);
}

export function hasQuiz(conceptId: string): boolean {
  return CLANK_QUIZZES.some(quiz => quiz.conceptId === conceptId);
}