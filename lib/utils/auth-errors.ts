/**
 * Helper pour traduire les erreurs Supabase en messages conviviaux
 */

export function getAuthErrorMessage(error: Error | null): string {
  if (!error) {
    return '';
  }

  const message = error.message.toLowerCase();

  // Erreurs de connexion
  if (message.includes('invalid login credentials')) {
    return 'Email ou mot de passe incorrect';
  }

  if (message.includes('email not confirmed')) {
    return 'Vérifie ton email pour confirmer ton compte';
  }

  if (message.includes('user not found')) {
    return 'Aucun compte trouvé avec cet email';
  }

  // Erreurs d'inscription
  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'Cet email est déjà utilisé';
  }

  if (message.includes('password should be at least')) {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }

  if (message.includes('invalid email')) {
    return 'Format d\'email invalide';
  }

  if (message.includes('email rate limit exceeded')) {
    return 'Trop de tentatives. Réessaie dans quelques minutes';
  }

  // Erreurs réseau
  if (message.includes('fetch failed') || message.includes('network')) {
    return 'Erreur de connexion. Vérifie ta connexion internet';
  }

  if (message.includes('timeout')) {
    return 'Délai d\'attente dépassé. Réessaie dans un instant';
  }

  // Erreurs serveur
  if (message.includes('server error') || message.includes('internal')) {
    return 'Erreur serveur. Réessaie dans quelques instants';
  }

  // Erreurs de token/session
  if (message.includes('session') || message.includes('token')) {
    return 'Session expirée. Reconnecte-toi';
  }

  // Erreur générique si rien ne correspond
  return 'Une erreur est survenue. Réessaie dans un instant';
}

/**
 * Helper pour vérifier si une erreur nécessite une action spécifique
 */
export function getAuthErrorAction(error: Error | null): 'none' | 'confirm_email' | 'retry' | 'contact_support' {
  if (!error) {
    return 'none';
  }

  const message = error.message.toLowerCase();

  if (message.includes('email not confirmed')) {
    return 'confirm_email';
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'retry';
  }

  if (message.includes('server error') || message.includes('internal')) {
    return 'contact_support';
  }

  return 'none';
}