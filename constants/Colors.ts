export const Colors = {
  light: {
    // Backgrounds
    background: '#ffffff',
    backgroundSecondary: '#f5f5f5',
    
    // Text
    text: '#000000',
    textSecondary: '#4b5563',
    textTertiary: '#6b7280',
    
    // Brand
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    
    // Cards
    cardBackground: 'rgba(0, 0, 0, 0.03)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    
    // Orbs (gradient backgrounds)
    orb1Start: '#ddd6fe',
    orb1End: '#c4b5fd',
    orb2Start: '#fce7f3',
    orb2End: '#fbcfe8',
    
    // Status
    success: '#10b981',
    locked: '#9ca3af',
    
    // Difficulty badge
    difficultyBg: 'rgba(139, 92, 246, 0.2)',
    difficultyBorder: 'rgba(139, 92, 246, 0.3)',
    difficultyText: '#8b5cf6',
  },
  
  dark: {
    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#0a0a0a',
    
    // Text
    text: '#ffffff',
    textSecondary: '#9ca3af',
    textTertiary: '#6b7280',
    
    // Brand
    primary: '#8b5cf6',
    primaryLight: '#a78bfa',
    
    // Cards
    cardBackground: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    
    // Orbs (gradient backgrounds)
    orb1Start: '#3b82f6',
    orb1End: '#8b5cf6',
    orb2Start: '#ec4899',
    orb2End: '#f43f5e', 
    
    // Status
    success: '#10b981',
    locked: '#6b7280',
    
    // Difficulty badge
    difficultyBg: 'rgba(139, 92, 246, 0.2)',
    difficultyBorder: 'rgba(139, 92, 246, 0.3)',
    difficultyText: '#c4b5fd',
  },
};

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;