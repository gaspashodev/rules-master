import { supabase } from '../supabase';

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

/**
 * Service d'authentification avec Supabase
 */
class AuthService {
  /**
   * Inscrit un nouvel utilisateur
   */
  async signUp(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Signup error:', error);
        return { user: null, error };
      }

      if (!data.user) {
        return { user: null, error: new Error('No user returned from signup') };
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      };

      console.log('✅ User signed up:', user.email);
      return { user, error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Connecte un utilisateur existant
   */
  async signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Signin error:', error);
        return { user: null, error };
      }

      if (!data.user) {
        return { user: null, error: new Error('No user returned from signin') };
      }

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      };

      console.log('✅ User signed in:', user.email);
      return { user, error: null };
    } catch (error) {
      console.error('Signin exception:', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Déconnecte l'utilisateur actuel
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Signout error:', error);
        return { error };
      }

      console.log('✅ User signed out');
      return { error: null };
    } catch (error) {
      console.error('Signout exception:', error);
      return { error: error as Error };
    }
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email!,
        created_at: user.created_at,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Vérifie si un utilisateur est connecté
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  async resetPassword(email: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }

      console.log('✅ Reset password email sent to:', email);
      return { error: null };
    } catch (error) {
      console.error('Reset password exception:', error);
      return { error: error as Error };
    }
  }

  /**
   * Écoute les changements d'état d'authentification
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
        });
      } else {
        callback(null);
      }
    });

    return subscription;
  }
}

// Export singleton
export const authService = new AuthService();
