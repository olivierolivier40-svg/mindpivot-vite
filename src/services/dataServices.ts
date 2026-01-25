
import { supabase } from '../supabaseClient.ts';
import type { Session, BadgeId } from '../types.ts';

// Clés pour le LocalStorage
const LS_KEYS = {
  SESSIONS: 'StopAndZenSessions',
  BADGES: 'StopAndZenBadges',
  FAVORITES: 'StopAndZenFavorites',
  PROGRAM: 'StopAndZenActiveProgram',
  COMPLETED_PROGRAMS: 'StopAndZenCompletedPrograms',
};

// --- Types ---
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  is_premium: boolean;
}

// --- Service ---

export const dataService = {
  
  /**
   * Récupère l'utilisateur actuel connecté
   */
  async getUser(): Promise<UserProfile | null> {
    if (!supabase) return null;
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Tente de récupérer le profil étendu (premium status) s'il existe
        const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

        return {
        id: user.id,
        email: user.email!,
        first_name: profile?.first_name,
        is_premium: profile?.is_premium || false,
        };
    } catch (e) {
        console.error("Erreur getUser:", e);
        return null;
    }
  },

  /**
   * Charge toutes les données (Sessions, Badges, etc.)
   * Priorité : Cloud si connecté, sinon Local.
   */
  async loadUserData() {
    const user = await this.getUser();

    // 1. Mode Invité (Offline ou non connecté) ou si Supabase a échoué
    if (!user) {
      return {
        sessions: JSON.parse(localStorage.getItem(LS_KEYS.SESSIONS) || '[]') as Session[],
        unlockedBadges: JSON.parse(localStorage.getItem(LS_KEYS.BADGES) || '{}') as Partial<Record<BadgeId, string>>,
        activeProgram: JSON.parse(localStorage.getItem(LS_KEYS.PROGRAM) || 'null'),
        completedPrograms: JSON.parse(localStorage.getItem(LS_KEYS.COMPLETED_PROGRAMS) || '[]'),
        isPremium: false, // Par défaut en local (sauf si dev mode activé dans App.tsx)
      };
    }

    // 2. Mode Connecté (Supabase)
    try {
        // On charge en parallèle pour la vitesse
        const [sessionsResult, badgesResult] = await Promise.all([
        supabase!.from('sessions').select('*'),
        supabase!.from('user_badges').select('*'),
        ]);

        // Transformation des données DB vers format App
        const dbSessions: Session[] = (sessionsResult.data || []).map((s: any) => ({
        id: s.id,
        ritualId: s.ritual_id,
        dureeSec: s.duration_sec,
        timestamp: s.created_at, 
        journal: s.journal_text,
        iaFeedback: s.ia_feedback,
        }));

        const dbBadges: Partial<Record<BadgeId, string>> = {};
        (badgesResult.data || []).forEach((b: any) => {
        dbBadges[b.badge_id as BadgeId] = b.unlocked_at;
        });

        // Note: Pour l'instant, on garde les programmes en local même connecté pour simplifier
        const activeProgram = JSON.parse(localStorage.getItem(LS_KEYS.PROGRAM) || 'null');
        const completedPrograms = JSON.parse(localStorage.getItem(LS_KEYS.COMPLETED_PROGRAMS) || '[]');

        return {
        sessions: dbSessions,
        unlockedBadges: dbBadges,
        activeProgram,
        completedPrograms,
        isPremium: user.is_premium,
        };
    } catch (e) {
        console.error("Erreur chargement Cloud:", e);
        // Fallback local si erreur réseau
        return {
            sessions: JSON.parse(localStorage.getItem(LS_KEYS.SESSIONS) || '[]') as Session[],
            unlockedBadges: JSON.parse(localStorage.getItem(LS_KEYS.BADGES) || '{}') as Partial<Record<BadgeId, string>>,
            activeProgram: JSON.parse(localStorage.getItem(LS_KEYS.PROGRAM) || 'null'),
            completedPrograms: JSON.parse(localStorage.getItem(LS_KEYS.COMPLETED_PROGRAMS) || '[]'),
            isPremium: false,
        };
    }
  },

  /**
   * Sauvegarde une nouvelle session
   */
  async saveSession(session: Session) {
    const user = await this.getUser();

    // Toujours sauvegarder en local (backup + mode offline)
    const localSessions = JSON.parse(localStorage.getItem(LS_KEYS.SESSIONS) || '[]');
    localStorage.setItem(LS_KEYS.SESSIONS, JSON.stringify([...localSessions, session]));

    // Si connecté, envoyer à Supabase
    if (user && supabase) {
      const { error } = await supabase.from('sessions').insert({
        user_id: user.id, 
        ritual_id: session.ritualId,
        duration_sec: session.dureeSec,
        journal_text: session.journal,
        ia_feedback: session.iaFeedback,
        created_at: session.timestamp,
      });
      if (error) console.error("Erreur save Supabase:", error);
    }
  },

  /**
   * Débloque un badge
   */
  async unlockBadge(badgeId: BadgeId) {
    const user = await this.getUser();
    const now = new Date().toISOString();

    // Local
    const localBadges = JSON.parse(localStorage.getItem(LS_KEYS.BADGES) || '{}');
    if (!localBadges[badgeId]) {
        localBadges[badgeId] = now;
        localStorage.setItem(LS_KEYS.BADGES, JSON.stringify(localBadges));
    }

    // Cloud
    if (user && supabase) {
      const { error } = await supabase.from('user_badges').upsert({
        user_id: user.id,
        badge_id: badgeId,
        unlocked_at: now
      }, { onConflict: 'user_id, badge_id' });
      
      if (error) console.error("Erreur badge Supabase:", error);
    }
  },

  /**
   * Synchronisation (Migration) : Local vers Cloud
   * À appeler juste après une connexion (Login/Signup) pour ne pas perdre les données "invité"
   */
  async syncLocalToCloud() {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Récupérer les données locales
    const localSessions: Session[] = JSON.parse(localStorage.getItem(LS_KEYS.SESSIONS) || '[]');
    const localBadges: Record<string, string> = JSON.parse(localStorage.getItem(LS_KEYS.BADGES) || '{}');

    if (localSessions.length === 0 && Object.keys(localBadges).length === 0) return;

    // 2. Préparer les payloads pour Supabase
    const sessionsPayload = localSessions.map(s => ({
        user_id: user.id,
        ritual_id: s.ritualId,
        duration_sec: s.dureeSec,
        journal_text: s.journal,
        ia_feedback: s.iaFeedback,
        created_at: s.timestamp,
    }));

    const badgesPayload = Object.entries(localBadges).map(([badgeId, date]) => ({
        user_id: user.id,
        badge_id: badgeId,
        unlocked_at: date
    }));

    // 3. Envoyer
    if (sessionsPayload.length > 0) {
        // Upsert simple ou Insert (on accepte le risque de doublon minime pour l'instant pour simplifier)
        await supabase.from('sessions').insert(sessionsPayload);
    }

    if (badgesPayload.length > 0) {
        await supabase.from('user_badges').upsert(badgesPayload, { onConflict: 'user_id, badge_id' });
    }

    console.log("Synchronisation terminée.");
  },

  async signOut() {
      if (!supabase) return;
      await supabase.auth.signOut();
      window.location.reload(); 
  }
};
