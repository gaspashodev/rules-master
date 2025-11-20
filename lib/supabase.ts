import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase credentials not found. Please check your .env file and restart the app.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types pour les tables Supabase
export interface DbUserProgress {
  id: string;
  user_id: string;
  game_id: string;
  completed_concepts: string[];
  current_concept: string | null;
  total_xp: number;
  streak: number;
  last_activity_date: string;
  created_at: string;
  updated_at: string;
}

export interface DbConceptCompletion {
  id: string;
  user_id: string;
  game_id: string;
  concept_id: string;
  completed_at: string;
  xp_earned: number;
}
