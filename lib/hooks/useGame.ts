import { CLANK_GAME, USER_STATS } from '../data/clank-mock';

// Hook simple qui retourne les données mockées
// Plus tard, on remplacera par un vrai call Supabase avec useQuery
export function useGame(gameId: string) {
  // Simulate loading
  return {
    data: CLANK_GAME,
    isLoading: false,
    error: null,
  };
}

export function useUserStats() {
  return {
    data: USER_STATS,
    isLoading: false,
  };
}