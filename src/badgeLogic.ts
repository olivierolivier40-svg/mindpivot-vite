import { Session, Streaks, BadgeId, CompletedProgram } from './types.ts';
import { RITUELS } from './constants.ts';
import { calculateStreaks } from './utils.ts';

// Note: The logic for PARCOURS_TERMINE will need access to completedPrograms state.
// A simple placeholder is used for now. This should be passed in if needed.
export const isBadgeUnlocked = (badgeId: BadgeId, sessions: Session[], streaks: Streaks, completedPrograms: CompletedProgram[]): boolean => {
    switch (badgeId) {
        case 'PREMIER_RITUEL':
            return sessions.length >= 1;

        case 'TROIS_JOURS_SUITE':
            return streaks.longest >= 3;

        case 'SEPT_JOURS_SUITE':
            return streaks.longest >= 7;

        case 'TRENTE_JOURS_SUITE':
            return streaks.longest >= 30;

        case 'DIX_ENTREES_JOURNAL':
            return sessions.filter(s => s.journal && s.journal.trim() !== '').length >= 10;

        case 'TROIS_CATEGORIES': {
            const categories = new Set(sessions.map(s => {
                const ritual = RITUELS.find(r => r.id === s.ritualId);
                return ritual ? ritual.category : undefined;
            }));
            return categories.has('respiration') && categories.has('neuro') && categories.has('micro-rituel');
        }

        case 'DIX_RITUELS_DIFFERENTS':
            return new Set(sessions.map(s => s.ritualId)).size >= 10;

        case 'CENT_SESSIONS':
            return sessions.length >= 100;

        case 'RITUEL_AVANT_8H':
            return sessions.some(s => new Date(s.timestamp).getHours() < 8);

        case 'RITUEL_APRES_22H':
            return sessions.some(s => new Date(s.timestamp).getHours() >= 22);
            
        case 'PARCOURS_TERMINE':
            return completedPrograms.length > 0;

        default:
            return false;
    }
};
