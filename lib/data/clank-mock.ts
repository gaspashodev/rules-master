// lib/data/clank-mock.ts
// VERSION ENRICHIE - Avec image de couverture et ressources

export interface LessonSection {
  type: 'text' | 'image' | 'video' | 'tip' | 'example';
  title?: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  altText?: string;
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  order: number;
  difficulty: number;
  estimatedTime: number;
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
  
  // ✨ NOUVEAUX CHAMPS
  age: number;                    // Âge minimum
  bggRating: number;              // Note BoardGameGeek (ex: 7.8)
  rulesUrl: string;               // Lien PDF des règles
  videoUrls: string[];            // Liens YouTube des vidéos
  coverImageUrl: string;          // URL de l'image de couverture
  
  concepts: Concept[];
}

export const CLANK_GAME: Game = {
  id: 'clank-001',
  name: 'Clank!',
  icon: '🐉',
  description: 'Les Aventuriers du Deck-building',
  difficulty: 'intermediate',
  playerCount: '2-4',
  playTime: '45-60',
  
  // ✨ NOUVELLES VALEURS
  age: 12,
  bggRating: 7.8,
  rulesUrl: 'https://cdn.1j1ju.com/medias/a6/4c/96-clank-les-aventuriers-du-deck-building-regle.pdf',
  videoUrls: [
    'https://www.youtube.com/watch?v=VIDEO_ID_1',
    'https://www.youtube.com/watch?v=VIDEO_ID_2',
  ],
  coverImageUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1722870/capsule_616x353.jpg',

  concepts: [
    // ========================================
    // CONCEPT 1 : LES BASES (déjà existant)
    // ========================================
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
            type: 'image',
            title: 'Le plateau de jeu',
            content: 'Voici à quoi ressemble le donjon de Clank! Tu commences en haut (entrée du château) et tu descends vers les Profondeurs où se trouvent les artefacts les plus précieux.',
            imageUrl: 'https://data.depuncheur.fr/review/1200/clank-les-aventuriers-du-deckbuilding.jpg',
            altText: 'Vue d\'ensemble du plateau de Clank! montrant le donjon avec ses tunnels et salles'
          },
          {
            type: 'video',
            title: 'Tutoriel vidéo - Vue d\'ensemble',
            content: 'Regarde cette courte vidéo pour mieux visualiser comment se déroule une partie de Clank!',
            videoUrl: 'https://www.youtube.com/watch?v=tnmTeD1joKg',
            altText: 'Vidéo explicative du déroulement d\'une partie'
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

    // ========================================
    // CONCEPT 2 : DECK-BUILDING (NOUVEAU)
    // ========================================
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
        introduction: "Le deck-building est le cœur de Clank! Tu vas constamment améliorer ton paquet de cartes pour devenir plus efficace. C'est comme construire une équipe de super-héros : chaque carte a son rôle !",
        sections: [
          {
            type: 'text',
            title: 'Ton deck de départ',
            content: "Tu commences avec 10 cartes basiques :\n• 6 Burgle (Cambriolage) : donnent 1 Compétence chacune\n• 2 Stumble (Faux pas) : font du Clank! mais ne font rien d'utile\n• 1 Sidestep (Pas de côté) : donne 1 Mouvement\n• 1 Scramble (Se faufiler) : donne 1 Mouvement"
          },
          {
            type: 'tip',
            content: "💡 Les cartes Stumble sont MAUVAISES ! Elles font du bruit et ne donnent rien. Ton objectif est de les retirer de ton deck dès que possible."
          },
          {
            type: 'text',
            title: 'Les trois ressources',
            content: "Chaque carte produit une ou plusieurs ressources :\n\n⚙️ SKILL (Compétence) : Sert à acheter de nouvelles cartes\n⚔️ SWORDS (Épées) : Sert à combattre les monstres\n👢 BOOTS (Bottes) : Sert à se déplacer dans le donjon"
          },
          {
            type: 'example',
            title: 'Exemple de tour',
            content: "Tu tires 5 cartes qui donnent au total :\n• 3 Compétences → tu peux acheter une carte à 3 ou moins\n• 2 Épées → tu peux battre un monstre de force 2\n• 1 Botte → tu peux traverser 1 tunnel\n\nTu utilises tes 3 Compétences pour acheter 'Kobold Merchant' (qui donne 2 Or), puis tes ressources restantes."
          },
          {
            type: 'text',
            title: 'Comment améliorer ton deck ?',
            content: "Tu peux acheter des cartes de deux façons :\n\n1. **Dungeon Row** (bannière bleue) : 6 cartes renouvelées constamment, offre variée\n2. **Réserve** (bannière jaune) : Cartes toujours disponibles (Mercenary, Explore, Secret Tome)\n\nLe coût en Compétence est indiqué en bas à droite de chaque carte."
          },
          {
            type: 'tip',
            content: "💡 Stratégie : Achète des cartes qui donnent plusieurs ressources ou qui ont des effets puissants. Évite d'acheter trop de cartes faibles qui diluent ton deck !"
          },
          {
            type: 'text',
            title: 'Le cycle du deck',
            content: "1. Tu pioches 5 cartes pour ta main\n2. Tu DOIS jouer toutes tes cartes (pas de choix)\n3. Les cartes achetées vont dans ta défausse\n4. Quand ta pioche est vide, mélange ta défausse pour former une nouvelle pioche\n\nC'est un cycle perpétuel : tes nouvelles cartes reviendront dans ta main plus tard !"
          },
          {
            type: 'example',
            title: 'Dilution du deck',
            content: "Mauvais deck : 20 cartes dont 10 faibles → Tu pioches souvent des cartes inutiles\n\nBon deck : 15 cartes dont 12 puissantes → Presque chaque main est forte\n\nL'objectif n'est pas d'avoir BEAUCOUP de cartes, mais de bonnes cartes !"
          },
          {
            type: 'text',
            title: 'Les cartes Device',
            content: "Les cartes Device (bannière pourpre) sont spéciales :\n• Tu les achètes avec des Compétences\n• Elles ne vont PAS dans ton deck\n• Tu bénéficies de leur effet USE immédiatement\n• Elles sont défaussées après utilisation\n\nC'est un effet instantané, très utile pour un boost ponctuel !"
          }
        ],
        summary: "Le deck-building te permet d'améliorer progressivement tes capacités. Achète des cartes puissantes qui donnent plusieurs ressources, et essaie de retirer les cartes faibles comme Stumble. Un deck efficace n'est pas forcément gros, mais contient des cartes de qualité !"
      }
    },

    // ========================================
    // CONCEPT 3 : EXPLORATION (NOUVEAU)
    // ========================================
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
        introduction: "Le plateau représente le donjon du dragon. Tu vas devoir naviguer intelligemment entre les salles pour voler ton artefact et ressortir vivant. Chaque tunnel a ses propres dangers !",
        sections: [
          {
            type: 'text',
            title: 'Les Boots : ta ressource de mouvement',
            content: "Chaque 👢 Boot te permet de traverser 1 tunnel pour atteindre une salle adjacente. Tu peux utiliser plusieurs Boots dans le même tour pour enchaîner plusieurs tunnels.\n\nTu peux te déplacer dans n'importe quelle direction (haut, bas, gauche, droite)."
          },
          {
            type: 'text',
            title: 'Les tunnels spéciaux',
            content: "Tous les tunnels ne se valent pas !\n\n🥾🥾 Tunnels difficiles : Nécessitent 2 Boots au lieu de 1\n\n👹 Tunnels à monstres : Tu perds 1 point de vie OU tu dépenses 1 Épée par masque\n\n🔒 Tunnels à cadenas : Nécessitent une Master Key (clef)\n\n➡️ Tunnels à sens unique : Ne peuvent être empruntés que dans le sens de la flèche"
          },
          {
            type: 'tip',
            content: "💡 Les tunnels à sens unique sont parfaits pour descendre rapidement, mais attention : tu ne pourras pas revenir par le même chemin !"
          },
          {
            type: 'example',
            title: 'Exemple de déplacement',
            content: "Tu as 3 Boots :\n\n• Tunnel normal → 1 Boot (reste 2)\n• Tunnel difficile 🥾🥾 → 2 Boots (reste 0)\n• Tu arrives dans une Crystal Cave\n\nTotal : Tu as traversé 2 tunnels avec tes 3 Boots."
          },
          {
            type: 'text',
            title: 'Les Crystal Caves ⚠️',
            content: "Les Crystal Caves (grottes de cristal) sont des zones spéciales :\n• Quand tu entres dans une Crystal Cave, tu PERDS toutes tes Boots restantes\n• Tu es OBLIGÉ de t'arrêter (sauf avec Flying Carpet)\n• C'est un bon endroit pour récupérer des trésors et se reposer"
          },
          {
            type: 'text',
            title: 'Les zones du donjon',
            content: "Le donjon est divisé en deux zones principales :\n\n🔴 **The Depths** (Les Profondeurs) : Zone dangereuse en bas du plateau\n• Contient les artefacts les plus précieux\n• Si tu meurs ici sans artefact, tu es éliminé\n\n🟢 **Hors des Profondeurs** : Zone plus sûre en haut\n• Si tu meurs ici avec un artefact, les villageois te secourent"
          },
          {
            type: 'tip',
            content: "💡 Stratégie : Descends dans les Profondeurs seulement quand tu es prêt. Une fois ton artefact pris, remonte le plus vite possible vers la sécurité !"
          },
          {
            type: 'text',
            title: 'Ramasser des objets',
            content: "Quand tu entres dans une salle, tu peux prendre 1 jeton :\n• Minor Secret (2 jetons par salle)\n• Major Secret\n• Monkey Idol\n• Artifact\n\nTu ne peux prendre qu'UN SEUL jeton par visite. Pour en prendre un autre, tu dois sortir et revenir."
          },
          {
            type: 'example',
            title: 'Choix stratégique',
            content: "Tu entres dans une salle avec :\n• Un Artifact à 5 points\n• Un Major Secret inconnu\n\nQue faire ?\n• Si c'est ton premier artefact et que tu veux sortir vite → prends l'Artifact\n• Si tu as déjà un Backpack et veux maximiser tes points → tente le Major Secret d'abord !"
          },
          {
            type: 'text',
            title: 'Les salles Market',
            content: "Certaines salles sont des Marchés où tu peux acheter des objets puissants pour 7 Or :\n• Master Key (clef) : Traverse les tunnels à cadenas\n• Backpack : Transporte un 2e artefact\n• Crown : Points de victoire bonus\n\nTu ne peux acheter qu'1 objet par visite, mais tu peux revenir plusieurs fois."
          }
        ],
        summary: "L'exploration est un équilibre entre risque et récompense. Descends dans les Profondeurs pour les meilleurs artefacts, mais assure-toi d'avoir assez de Boots et de santé pour remonter ! Les tunnels spéciaux ajoutent de la stratégie : planifie ton chemin intelligemment."
      }
    },

    // ========================================
    // CONCEPT 4 : COMBAT (NOUVEAU)
    // ========================================
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
        introduction: "Le donjon est infesté de monstres ! Heureusement, tu peux les combattre pour gagner des récompenses. Le combat n'est jamais obligatoire, mais c'est souvent très rentable.",
        sections: [
          {
            type: 'text',
            title: 'Comment combattre ?',
            content: "Les cartes monstre (bannière rouge) du Dungeon Row peuvent être vaincues avec des Épées ⚔️.\n\nLe nombre d'Épées nécessaires est indiqué en bas à droite de la carte. Si tu as assez d'Épées, tu peux vaincre le monstre et gagner sa récompense !"
          },
          {
            type: 'example',
            title: 'Exemple de combat',
            content: "**Orc Grunt** (Grognard Orc)\n• Coût : 2 Épées ⚔️⚔️\n• Récompense : 3 Or\n\nTu as 2 Épées dans ta main → Tu peux le vaincre et gagner 3 Or immédiatement !"
          },
          {
            type: 'text',
            title: 'Les récompenses des monstres',
            content: "Chaque monstre vaincu te donne une récompense indiquée sous DEFEAT :\n• Or (pièces d'or)\n• Points de victoire\n• Effets spéciaux (piocher des cartes, gagner des ressources, etc.)\n\nLa carte monstre est ensuite défaussée et remplacée par une nouvelle carte du Dungeon Deck."
          },
          {
            type: 'tip',
            content: "💡 Les monstres sont une excellente source d'Or ! L'Or te permet d'acheter des objets puissants au Market et compte comme points de victoire à la fin."
          },
          {
            type: 'text',
            title: 'Le Goblin de la Réserve',
            content: "Le Goblin est un monstre spécial toujours disponible dans la Réserve :\n• Coût : 1 Épée ⚔️\n• Récompense : 1 Or\n• La carte n'est JAMAIS défaussée\n\nChaque joueur peut le combattre autant de fois qu'il le peut dans le même tour ! C'est un bon moyen de convertir tes Épées en Or."
          },
          {
            type: 'example',
            title: 'Farming le Goblin',
            content: "Tu as 4 Épées dans ta main :\n• Combat le Goblin → 1 Or (reste 3 Épées)\n• Combat le Goblin → 1 Or (reste 2 Épées)\n• Combat le Goblin → 1 Or (reste 1 Épée)\n• Combat le Goblin → 1 Or (reste 0 Épée)\n\nRésultat : 4 Or gagnés avec 4 Épées ! C'est très rentable."
          },
          {
            type: 'text',
            title: 'Combat vs tunnels à monstres',
            content: "Attention à ne pas confondre :\n\n**Cartes monstres du Dungeon Row** :\n• Combat optionnel\n• Coûte des Épées\n• Donne des récompenses\n\n**Tunnels à monstres** (👹) :\n• Passage de tunnel\n• Tu perds 1 PV OU tu dépenses 1 Épée par masque\n• Aucune récompense"
          },
          {
            type: 'tip',
            content: "💡 Si tu as beaucoup d'Épées, utilise-les pour vaincre des monstres (récompenses) plutôt que pour éviter des dégâts dans les tunnels (aucune récompense)."
          },
          {
            type: 'text',
            title: 'Stratégie de combat',
            content: "Quand combattre ?\n\n✅ Combats si :\n• La récompense est intéressante (Or, points, effets)\n• Tu as des Épées en surplus\n• Tu veux libérer une place dans le Dungeon Row pour de meilleures cartes\n\n❌ Évite si :\n• Tu as besoin de tes Épées pour les tunnels\n• La récompense est faible\n• Tu as d'autres priorités (acheter des cartes, te déplacer)"
          },
          {
            type: 'example',
            title: 'Choix tactique',
            content: "Ta main te donne 3 Épées, 2 Boots, 1 Compétence.\n\nOption A : Combattre un monstre à 3 Épées → Gagner 5 Or\nOption B : Garder les Épées pour traverser 3 tunnels à monstres sans perdre de PV\n\nLe bon choix dépend de ta situation : as-tu besoin de te déplacer loin ? Es-tu en bonne santé ?"
          },
          {
            type: 'text',
            title: 'Les cartes Companion',
            content: "Certaines cartes donnent des Épées de façon permanente (Companions = Compagnons). Ces cartes sont très puissantes car elles te permettent de combattre régulièrement sans sacrifier d'autres ressources.\n\nExemple : 'Mercenary' donne 2 Épées ⚔️⚔️ chaque fois que tu la joues."
          }
        ],
        summary: "Le combat est une activité optionnelle mais très rentable. Les monstres te donnent de l'Or et des bonus précieux. Le Goblin de la Réserve est parfait pour convertir tes Épées en Or. Gère intelligemment tes Épées entre combats (récompenses) et tunnels (survie)."
      }
    },

    // ========================================
    // CONCEPT 5 : LE DRAGON (NOUVEAU)
    // ========================================
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
        introduction: "Le dragon est la menace principale du jeu ! Chaque fois que tu fais du bruit (Clank!), tu risques de te faire attaquer. C'est le cœur de la tension dans Clank! : plus tu fais de bruit, plus tu es en danger.",
        sections: [
          {
            type: 'text',
            title: 'Comment fonctionne le Clank! ?',
            content: "Certaines cartes ont un symbole 🔊 Clank! Quand tu joues ces cartes, tu dois ajouter le nombre de cubes de ta couleur indiqué dans la Clank! Area (zone des Clanks) sur le plateau.\n\nCes cubes représentent le bruit que tu fais. Plus il y a de cubes de ta couleur, plus tu risques d'être attaqué !"
          },
          {
            type: 'example',
            title: 'Faire du Clank!',
            content: "Tu joues une carte 'Stumble' qui indique :\n🔊 +1 Clank!\n\n→ Tu prends 1 cube de ta couleur de ta réserve et le places dans la Clank! Area.\n\nCe cube reste là jusqu'à une attaque du dragon."
          },
          {
            type: 'text',
            title: 'Quand le dragon attaque-t-il ?',
            content: "À la fin de chaque tour, on remplit le Dungeon Row avec de nouvelles cartes. Si une ou plusieurs cartes ont le symbole 🐉 Dragon Attack, le dragon attaque IMMÉDIATEMENT (une seule fois par tour, même s'il y a plusieurs symboles).\n\nL'attaque suit ces étapes :\n1. Tous les cubes de la Clank! Area vont dans le sac du Dragon\n2. On mélange le sac\n3. On tire un nombre de cubes selon la piste de rage du dragon\n4. Chaque cube de couleur = 1 PV perdu pour ce joueur"
          },
          {
            type: 'image',
            title: 'La piste de rage',
            content: "La piste de rage du dragon indique combien de cubes sont tirés lors d'une attaque. Elle augmente chaque fois qu'un Artifact ou un Dragon Egg est pris.",
            imageUrl: '/assets/images/dragon-rage-track.png',
            altText: 'Piste de rage du dragon montrant 4 cases avec 3, 4, 5 et 6 cubes'
          },
          {
            type: 'example',
            title: "Exemple d'attaque",
            content: "La Clank! Area contient : 3 cubes verts, 2 cubes jaunes, 1 cube bleu.\n\nLe dragon est sur la case '4 cubes' de la piste de rage.\n\nOn tire 4 cubes du sac :\n• 1 noir → Rien ne se passe\n• 2 verts → Le joueur vert perd 2 PV\n• 1 jaune → Le joueur jaune perd 1 PV\n\nLes cubes bleus n'ont pas été tirés, le joueur bleu ne perd rien !"
          },
          {
            type: 'tip',
            content: "💡 Plus tu fais de Clank!, plus tu as de cubes dans le sac, plus tu risques d'être touché. Minimise ton Clank! pour survivre !"
          },
          {
            type: 'text',
            title: 'La piste de rage du dragon',
            content: "La figurine du dragon avance sur sa piste de rage dans deux situations :\n• Quand un joueur prend un Artifact\n• Quand un joueur révèle un Dragon Egg (Minor Secret)\n\nPlus la figurine avance, plus le dragon tire de cubes lors de ses attaques :\n• Case 1-2 : 3 cubes tirés\n• Case 3-4 : 4 cubes tirés\n• Case 5-6 : 5 cubes tirés\n• Case 7+ : 6 cubes tirés"
          },
          {
            type: 'text',
            title: 'Retirer du Clank!',
            content: "Certaines cartes bénéfiques te permettent de retirer du Clank! (symbole 🔕 -1 Clank!).\n\nQuand tu joues une telle carte :\n• Retire 1 de tes cubes de la Clank! Area\n• S'il n'y a pas de cube à retirer, tu peux 'économiser' cet effet pour annuler un futur Clank! dans le même tour\n\nExemple : Tu joues 'Move Silently' (-1 Clank!) puis 'Stumble' (+1 Clank!) → Les deux s'annulent, rien ne se passe !"
          },
          {
            type: 'tip',
            content: "💡 Les cartes qui retirent du Clank! sont TRÈS précieuses ! Priorité absolue pour les acheter dès que possible."
          },
          {
            type: 'text',
            title: 'Être à court de Clank!',
            content: "Si tu n'as plus de cubes dans ta réserve (tous tes cubes sont soit dans la Clank! Area, soit sur ta piste de dégâts) :\n\n✅ Avantage : Tu ne peux plus faire de Clank! (c'est gratuit !)\n❌ Inconvénient : Tu ne peux plus perdre volontairement de PV pour traverser les tunnels à monstres"
          },
          {
            type: 'text',
            title: 'Les cartes Danger',
            content: "Certaines cartes ont le symbole ⚠️ Danger. Tant qu'elles sont visibles dans le Dungeon Row, elles augmentent la dangerosité du dragon :\n\nPour chaque carte Danger visible, on tire +1 cube supplémentaire lors des attaques !\n\nExemple : Le dragon est sur la case '4 cubes', mais il y a 2 cartes Danger dans le Dungeon Row → On tire 6 cubes au lieu de 4 !"
          },
          {
            type: 'example',
            title: 'Impact des cartes Danger',
            content: "Situation normale : Dragon tire 4 cubes\n\nAvec 2 cartes Danger visibles : Dragon tire 6 cubes\n\n→ 50% de cubes en plus ! Les attaques deviennent beaucoup plus dangereuses. Essaie d'acheter ou combattre ces cartes pour les retirer du Dungeon Row."
          },
          {
            type: 'text',
            title: 'Stratégie anti-dragon',
            content: "Comment survivre au dragon ?\n\n1. **Minimise ton Clank!** : Évite les cartes qui font du bruit\n2. **Retire tes Stumbles** : Ces cartes font du Clank! sans donner de ressources\n3. **Achète des cartes -Clank!** : Move Silently, Tiptoe, etc.\n4. **Sors vite** : Une fois ton artefact pris, ne traîne pas\n5. **Gère les cartes Danger** : Retire-les du Dungeon Row si possible"
          }
        ],
        summary: "Le dragon attaque via le sac de Clank! : plus tu fais de bruit, plus tu risques de perdre des PV. La piste de rage augmente avec les artefacts volés, rendant le jeu de plus en plus dangereux. Minimise ton Clank!, retire les cartes qui en font, et sors rapidement une fois ton butin obtenu !"
      }
    },

    // ========================================
    // CONCEPT 6 : LA FUITE (NOUVEAU)
    // ========================================
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
        introduction: "Une fois ton artefact volé, le vrai défi commence : sortir du donjon vivant ! Le timing est crucial, car dès que le premier joueur sort, c'est la course contre la montre pour tous les autres.",
        sections: [
          {
            type: 'text',
            title: 'Quand faut-il partir ?',
            content: "C'est LA question stratégique de Clank! :\n\n🏃 Partir tôt ?\n• Moins de risques\n• Moins de points\n• Artefact moins précieux\n\n⏰ Rester plus longtemps ?\n• Plus de trésors\n• Artefact plus précieux\n• Mais plus de dangers et risque de mort"
          },
          {
            type: 'tip',
            content: "💡 Il n'y a pas de bonne réponse universelle ! Adapte ta stratégie à ta santé, ton deck, et ce que font les autres joueurs."
          },
          {
            type: 'text',
            title: 'Le compte à rebours',
            content: "Dès que le PREMIER joueur sort du donjon (ou est secouru) avec un artefact :\n\n1. Il place son pion sur la piste de compte à rebours (case la plus à gauche)\n2. À chaque tour suivant, il avance son pion d'une case\n3. Chaque case (à partir de la 2e) déclenche une attaque du dragon avec des cubes supplémentaires\n4. À la 5e case, TOUS les joueurs encore dans le donjon sont assommés !\n\nLes autres joueurs n'ont plus que 4 tours pour sortir."
          },
          {
            type: 'example',
            title: 'Le compte à rebours en action',
            content: "Tour 10 : Alice sort du donjon → Place son pion sur la case 1\n\nTour 11 (tour d'Alice) : Pion → case 2 → Attaque dragon +1 cube\nTour 12 (tour d'Alice) : Pion → case 3 → Attaque dragon +2 cubes\nTour 13 (tour d'Alice) : Pion → case 4 → Attaque dragon +3 cubes\nTour 14 (tour d'Alice) : Pion → case 5 → Tous les joueurs dans le donjon sont assommés !"
          },
          {
            type: 'text',
            title: 'Les attaques renforcées',
            content: "Pendant le compte à rebours, les attaques du dragon deviennent de plus en plus violentes :\n\n• Case 1 : Pas d'attaque supplémentaire\n• Case 2 : +1 cube tiré lors des attaques\n• Case 3 : +2 cubes tirés lors des attaques\n• Case 4 : +3 cubes tirés lors des attaques\n• Case 5 : Tous les joueurs restants assommés\n\nC'est une pression énorme pour les joueurs encore dans le donjon !"
          },
          {
            type: 'tip',
            content: "💡 Si tu es dans les Profondeurs quand le compte à rebours commence, tu es probablement en danger mortel. Assure-toi d'avoir un plan de sortie rapide AVANT de prendre ton artefact !"
          },
          {
            type: 'text',
            title: 'Être assommé : les conséquences',
            content: "Si ta piste de santé est complètement remplie (10 dégâts), tu es assommé. Les conséquences dépendent de ta position :\n\n✅ **Hors des Profondeurs + avec Artifact** :\n• Les villageois te secourent\n• Tu ne joues plus mais tes points comptent\n• Tu peux gagner la partie !\n\n❌ **Dans les Profondeurs OU sans Artifact** :\n• Tu es éliminé du jeu\n• Tes points ne comptent pas\n• Tu ne peux pas gagner"
          },
          {
            type: 'example',
            title: 'Situations de sauvetage',
            content: "**Scénario A : Alice assommée**\n• Position : Hors des Profondeurs\n• Artefact : Oui (valeur 10)\n• Résultat : Secourue ! Elle peut gagner avec ses 35 points\n\n**Scénario B : Bob assommé**\n• Position : Dans les Profondeurs\n• Artefact : Oui (valeur 30)\n• Résultat : Éliminé ! Trop loin pour être secouru\n\n**Scénario C : Claire assommée**\n• Position : Hors des Profondeurs\n• Artefact : Non\n• Résultat : Éliminée ! Pas d'artefact = pas de sauvetage"
          },
          {
            type: 'text',
            title: 'Le Mastery Token',
            content: "Si tu sors du donjon VIVANT (pas assommé) avec au moins un artefact, tu reçois un Mastery Token qui vaut 20 points de victoire !\n\nC'est une récompense énorme pour ceux qui réussissent l'exploit sans se faire assommer. Ça peut faire la différence entre la victoire et la défaite."
          },
          {
            type: 'text',
            title: 'Après la sortie',
            content: "Une fois sorti ou secouru, ton jeu change :\n\n• Tu ne fais plus de Clank!\n• Les cartes qui affectent les joueurs ne te concernent plus\n• Les cubes de ta couleur tirés du sac ne te font plus de dégâts\n• Tu ne joues plus de tour (sauf avancer sur la piste de compte à rebours si tu es sorti en premier)"
          },
          {
            type: 'text',
            title: 'Stratégies de sortie',
            content: "**Stratégie rapide** :\n• Prends un artefact proche de l'entrée (5-7 points)\n• Remonte immédiatement\n• Moins de points mais très sûr\n\n**Stratégie équilibrée** :\n• Descends à mi-profondeur\n• Prends un artefact moyen (10-15 points)\n• Ramasse quelques trésors en remontant\n\n**Stratégie risquée** :\n• Va au fond des Profondeurs\n• Prends l'artefact le plus précieux (20-30 points)\n• Remonte le plus vite possible\n• Très dangereux mais très rentable si réussi"
          },
          {
            type: 'tip',
            content: "💡 Le joueur qui sort en premier n'a pas forcément l'avantage ! Souvent, ceux qui prennent un peu plus de risques et accumulent plus de points gagnent, tant qu'ils sortent vivants dans les 4 tours."
          },
          {
            type: 'text',
            title: 'Gérer la pression',
            content: "Quand le compte à rebours commence, gère ta panique :\n\n1. **Calcule ta distance** : Combien de Boots pour sortir ?\n2. **Évalue ta santé** : Peux-tu survivre 2-3 attaques ?\n3. **Optimise ton deck** : Achète des cartes qui donnent beaucoup de Boots\n4. **Prends des risques calculés** : Un dernier trésor en vaut-il la peine ?\n5. **Accepte la défaite si nécessaire** : Mieux vaut sortir avec peu de points que mourir avec beaucoup"
          },
          {
            type: 'example',
            title: 'Course finale',
            content: "Le compte à rebours est sur la case 3 (il reste 2 tours).\n\nTu es à 5 tunnels de la sortie.\nTu as 10 PV (pleine santé).\nTon deck donne en moyenne 3 Boots par tour.\n\n→ Tu as besoin de 2 tours : 3 Boots + 3 Boots = 6 Boots (assez pour 5 tunnels)\n→ Tu vas subir 2 attaques du dragon pendant ce temps\n→ Si tu survis aux attaques, tu sors vivant !\n\nC'est tendu mais faisable. GO GO GO ! 🏃"
          }
        ],
        summary: "La fuite est la phase la plus intense de Clank! Dès que le premier joueur sort, c'est la course : 4 tours pour sortir ou être secouru. Le compte à rebours augmente la dangerosité du dragon à chaque tour. Planifie ta sortie AVANT de prendre ton artefact, et équilibre risque et récompense. Sortir vivant vaut 20 points bonus !"
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