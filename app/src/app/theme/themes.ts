import type { ThemeName } from '../types/models';

export type AppTheme = {
  name: ThemeName;
  colors: {
    bg: string;
    card: string;
    text: string;
    mutedText: string;
    border: string;
    primary: string;
    primaryText: string;
    danger: string;
    tabIcon: string;
  };
};

export const themes: Record<ThemeName, AppTheme> = {
  systemLight: {
    name: 'systemLight',
    colors: {
      bg: '#FFFFFF',
      card: '#F6F7F9',
      text: '#111827',
      mutedText: '#6B7280',
      border: '#E5E7EB',
      primary: '#0e56f0',
      primaryText: '#FFFFFF',
      danger: '#DC2626',
      tabIcon: '#111827',
    },
  },
  systemDark: {
    name: 'systemDark',
    colors: {
      bg: '#0F172A',
      card: '#1E293B',
      text: '#F1F5F9',
      mutedText: '#94A3B8',
      border: '#2A3448',
      primary: '#094ad4',
      primaryText: '#FFFFFF',
      danger: '#EF4444',
      tabIcon: '#CBD5E1',
    }
  },
  freshMint: {
    name: 'freshMint',
    colors: {
      bg: '#F2FBF8',
      card: '#FFFFFF',
      text: '#0F2E24',
      mutedText: '#6eb69f',
      border: '#D7EDE6',
      primary: '#10B981',
      primaryText: '#FFFFFF',
      danger: '#DC2626',
      tabIcon: '#6BAF9E',
    }
  },
  fineRoyal: {
    name: 'fineRoyal',
    colors: {
      bg: '#0B0B0D',
      card: '#141418',
      text: '#F5F5F5',
      mutedText: '#A3A3A3',
      border: '#2A2A33',
      primary: '#D4AF37',
      primaryText: '#0B0B0D',
      danger: '#EF4444',
      tabIcon: '#E11D48',
    },
  },
  purpleHaze: {
    name: 'purpleHaze',
    colors: {
      bg: '#0A0612',
      card: '#140B23',
      text: '#F4EFFF',
      mutedText: '#C7B7E8',
      border: '#2A1744',
      primary: '#EC4899',    
      primaryText: '#12061F',
      danger: '#FB7185',
      tabIcon: '#A855F7',
    },
  },
  hackTheSystem: {
    name: 'hackTheSystem',
    colors: {
      bg: '#050806',
      card: '#0B120D',
      text: '#D1FAE5',
      mutedText: '#86EFAC',
      border: '#12301E',
      primary: '#22C55E',
      primaryText: '#041008',
      danger: '#F87171',
      tabIcon: '#22C55E',
    },
  },
};