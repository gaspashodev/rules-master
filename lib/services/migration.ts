import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabase';
import type { UserProgress } from '../types/database';
import { STORAGE_KEYS } from '../types/database';
import { authService } from './auth';

/**
 * Service de migration des données locales vers Supabase
 * Utilisé lors de la première connexion après l'installation de Supabase
 */
class MigrationService {
  private static readonly MIGRATION_FLAG_KEY = '@rulesmaster_migration_done';

  /**
   * Vérifie si la migration a déjà été effectuée pour cet utilisateur
   */
  async isMigrationDone(userId: string): Promise<boolean> {
    try {
      const flag = await AsyncStorage.getItem(`${MigrationService.MIGRATION_FLAG_KEY
}_${userId}`);
      return flag === 'true';
    } catch (error) {
      console.error('Error checking migration status:', error);
      return false;
    }
  }

  /**
   * Marque la migration comme effectuée pour cet utilisateur
   */
  private async markMigrationDone(userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${MigrationService.MIGRATION_FLAG_KEY}_${userId}`, 'true');
    } catch (error) {
      console.error('Error marking migration done:', error);
    }
  }

  /**
   * Migre les données locales vers Supabase
   * À appeler après la première connexion
   */
  async migrateLocalDataToSupabase(): Promise<{
    success: boolean;
    migratedProgress?: UserProgress;
    error?: Error;
  }> {
    try {
      // 1. Vérifier que l'utilisateur est connecté
      const user = await authService.getCurrentUser();
      if (!user) {
        return { success: false, error: new Error('User not authenticated') };
      }

      // 2. Vérifier si la migration a déjà été faite
      const alreadyMigrated = await this.isMigrationDone(user.id);
      if (alreadyMigrated) {
        console.log('✅ Migration already done for this user');
        return { success: true };
      }

      console.log('🔄 Starting migration of local data to Supabase...');

      // 3. Lire les données locales
      const localProgressData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      
      if (!localProgressData) {
        console.log('📭 No local data to migrate');
        await this.markMigrationDone(user.id);
        return { success: true };
      }

      const cachedProgress = JSON.parse(localProgressData);
      const localProgress: UserProgress = cachedProgress.progress;

      // 4. Vérifier s'il y a des données significatives à migrer
      if (!localProgress.completedConcepts || localProgress.completedConcepts.length === 0) {
        console.log('📭 No completed concepts to migrate');
        await this.markMigrationDone(user.id);
        return { success: true };
      }

      console.log(`📦 Found ${localProgress.completedConcepts.length} completed concepts to migrate`);

      // 5. Mettre à jour le userId avec le vrai user ID
      const migratedProgress: UserProgress = {
        ...localProgress,
        userId: user.id,
        updatedAt: new Date().toISOString(),
      };

      // 6. Vérifier si l'utilisateur a déjà des données dans Supabase
      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('game_id', migratedProgress.gameId)
        .single();

      if (existingProgress) {
        // Merger les données : garder le max d'XP et tous les concepts complétés
        const mergedCompletedConcepts = Array.from(
          new Set([
            ...(existingProgress.completed_concepts || []),
            ...migratedProgress.completedConcepts,
          ])
        );

        const mergedProgress = {
          user_id: user.id,
          game_id: migratedProgress.gameId,
          completed_concepts: mergedCompletedConcepts,
          current_concept: migratedProgress.currentConcept || existingProgress.current_concept,
          total_xp: Math.max(migratedProgress.totalXP, existingProgress.total_xp),
          streak: Math.max(migratedProgress.streak, existingProgress.streak),
          last_activity_date: migratedProgress.lastActivityDate,
          created_at: existingProgress.created_at,
          updated_at: new Date().toISOString(),
        };

        console.log(`🔀 Merging with existing Supabase data...`);
        const { error: updateError } = await supabase
          .from('user_progress')
          .update(mergedProgress)
          .eq('user_id', user.id)
          .eq('game_id', migratedProgress.gameId);

        if (updateError) {
          console.error('Migration merge error:', updateError);
          return { success: false, error: updateError as Error };
        }

        // Créer les enregistrements de complétion manquants
        await this.createMissingCompletions(
          user.id,
          migratedProgress.gameId,
          mergedCompletedConcepts,
          existingProgress.completed_concepts || []
        );

      } else {
        // Pas de données existantes, créer tout nouveau
        const newProgress = {
          user_id: user.id,
          game_id: migratedProgress.gameId,
          completed_concepts: migratedProgress.completedConcepts,
          current_concept: migratedProgress.currentConcept,
          total_xp: migratedProgress.totalXP,
          streak: migratedProgress.streak,
          last_activity_date: migratedProgress.lastActivityDate,
          created_at: migratedProgress.createdAt,
          updated_at: migratedProgress.updatedAt,
        };

        console.log('📤 Uploading local data to Supabase...');
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert([newProgress]);

        if (insertError) {
          console.error('Migration insert error:', insertError);
          return { success: false, error: insertError as Error };
        }

        // Créer les enregistrements de complétion
        await this.createMissingCompletions(
          user.id,
          migratedProgress.gameId,
          migratedProgress.completedConcepts,
          []
        );
      }

      // 7. Marquer la migration comme effectuée
      await this.markMigrationDone(user.id);

      console.log('✅ Migration completed successfully!');
      return { success: true, migratedProgress };

    } catch (error) {
      console.error('Migration error:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Crée les enregistrements de complétion manquants
   */
  private async createMissingCompletions(
    userId: string,
    gameId: string,
    allCompletedConcepts: string[],
    existingCompletedConcepts: string[]
  ): Promise<void> {
    try {
      const missingConcepts = allCompletedConcepts.filter(
        (conceptId) => !existingCompletedConcepts.includes(conceptId)
      );

      if (missingConcepts.length === 0) {
        return;
      }

      console.log(`📝 Creating ${missingConcepts.length} completion records...`);

      const now = new Date().toISOString();
      const completions = missingConcepts.map((conceptId) => ({
        user_id: userId,
        game_id: gameId,
        concept_id: conceptId,
        xp_earned: 50, // Default XP
        completed_at: now,
      }));

      const { error } = await supabase
        .from('concept_completions')
        .insert(completions);

      if (error) {
        console.error('Error creating completions:', error);
      }
    } catch (error) {
      console.error('Error in createMissingCompletions:', error);
    }
  }

  /**
   * Réinitialise le flag de migration (pour debug/test)
   */
  async resetMigrationFlag(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${MigrationService.MIGRATION_FLAG_KEY}_${userId}`);
      console.log('🔄 Migration flag reset for user:', userId);
    } catch (error) {
      console.error('Error resetting migration flag:', error);
    }
  }
}

// Export singleton
export const migrationService = new MigrationService();