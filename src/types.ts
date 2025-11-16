export interface Ritual {
  id: string;
  label: string;
  category: 'neuro' | 'respiration' | 'micro-rituel';
  playerType: string;
  dureeSec: number;
  donut: string;
  haptique: {
    onPhaseChange?: boolean;
    tickSec?: number;
  };
  tags: string[];
  isPremium?: boolean;
  options?: {
    perPhaseProgress?: boolean;
    extend5min?: boolean;
    id5min?: string;
  };
  data?: any;
  modal: {
    titre: string;
    icon: string;
    sections: {
      pourquoi: string;
      comment: string;
      conseils: string;
      enSavoirPlus?: string;
      pourAllerPlusLoin?: string;
    };
  };
  instructions?: string;
  immersiveInstructions?: string;
  preStartInstructions?: string;
  preStartSteps?: { text: string; backgroundUrl?: string }[];
}

export interface Program {
  id: string;
  title: string;
  icon: string;
  durationDays: number;
  description: string;
  isPremium: boolean;
  ritualIds: string[];
  details?: {
    objective: string;
    mechanism: string;
    benefits: string;
  };
}

export interface ActiveProgram {
  programId: string;
  currentDay: number; // 1-based index
}

export interface CompletedProgram {
  programId: string;
  completedAt: string;
}

export interface Session {
  id: string;
  ritualId: string;
  dureeSec: number;
  timestamp: string;
  journal?: string;
  iaFeedback?: string;
}

export interface Badge {
  name: string;
  icon: string;
  category: 'premiers_pas' | 'constance' | 'exploration' | 'maitrise' | 'secrets';
  description: string;
  hint: string;
}

// Correction de la dépendance circulaire. Au lieu d'importer depuis constants.ts,
// nous listons les IDs de badges manuellement pour briser la boucle.
export type BadgeId =
  | 'PREMIER_RITUEL'
  | 'TROIS_JOURS_SUITE'
  | 'SEPT_JOURS_SUITE'
  | 'TRENTE_JOURS_SUITE'
  | 'DIX_ENTREES_JOURNAL'
  | 'TROIS_CATEGORIES'
  | 'DIX_RITUELS_DIFFERENTS'
  | 'CENT_SESSIONS'
  | 'RITUEL_AVANT_8H'
  | 'RITUEL_APRES_22H'
  | 'PARCOURS_TERMINE';

export interface Streaks {
  current: number;
  longest: number;
}

export type SoundId = 'bol' | 'diapason' | 'gong' | 'none';

export interface SoundSettings {
  guidance: boolean;
  completion: boolean;
  volume: number;
  selectedSound: SoundId;
}