import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from '../services/auth';
import { authService } from '../services/auth';
import { migrationService } from '../services/migration';

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadUser();

    // Écouter les changements d'auth
    const subscription = authService.onAuthStateChange((authUser) => {
      setUser(authUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser, error } = await authService.signIn(email, password);
      
      if (error) {
        return { error };
      }

      setUser(authUser);
      
      // Migrer les données locales vers Supabase si nécessaire
      if (authUser) {
        migrationService.migrateLocalDataToSupabase().catch((err) => {
        });
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { user: authUser, error } = await authService.signUp(email, password);
      
      if (error) {
        return { error };
      }

      // NE PAS set l'utilisateur ici pour permettre la redirection vers login
      // setUser(authUser);
      
      // La migration se fera lors du premier signIn
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}