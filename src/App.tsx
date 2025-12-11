
import { useState, useEffect, useCallback, useRef } from 'react';
import { RITUELS, SOUND_OPTIONS, PROGRAMS, BADGES, BADGE_CATEGORIES, LABELS, HELP_CONTENT } from './constants.ts';
import type { Ritual, Session, Badge, BadgeId, Streaks, SoundSettings, ActiveProgram, CompletedProgram } from './types.ts';
import { calculateSessionStreaks } from './utils.ts';
import { useI18n } from './hooks/useI18n.tsx';
import { isBadgeUnlocked } from './badgeLogic.ts';
import { generateGeminiText } from './services/geminiService.ts';
import { dataService, type UserProfile } from './services/dataService.ts';
import { supabase } from './supabaseClient.ts';

// --- Importing Components from their files ---
import { Button } from './components/Button.tsx';
import { Card } from './components/Card.tsx';
import { Modal } from './components/Modal.tsx';
import { Player } from './components/Player.tsx';
import { RitualCard } from './components/RitualCard.tsx';
import { CheckinSlider } from './components/CheckinSlider.tsx';
import { StatsScreen } from './components/StatsScreen.tsx';
import { Breadcrumbs } from './components/Breadcrumbs.tsx';
import { OnboardingScreen } from './components/OnboardingScreen.tsx';
import { CheckinPage } from './components/CheckinPage.tsx';
import { PremiumModal } from './components/PremiumModal.tsx';
import { FooterButton } from './components/FooterButton.tsx';
import { ProgramCard } from './components/ProgramCard.tsx';
import { HowItWorksPage } from './components/HowItWorksPage.tsx';
import { FAQPage } from './components/FAQPage.tsx';
import { SettingsPage } from './components/SettingsPage.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';

// --- SVG Icons ---
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/></svg>;
const JourneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V20C6 16.69 8.69 14 12 14C15.31 14 18 11.31 18 8V2"/></svg>;
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>;
const StatsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 20h16v2H4v-2zM4 2h2v14H4V2zm6 6h2v8h-2V8zm6-4h2v12h-2V4z"/></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-1.01l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.28-1.17.62-1.69 1.01l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69 1.01l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.28 1.17-.62 1.69-1.01l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>;

const themes = ['dark', 'light', 'aurora', 'dyslexia-tdah'];
type Theme = 'dark' | 'light' | 'aurora' | 'dyslexia-tdah';

function App() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [textSize, setTextSize] = useState(1);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<Partial<Record<BadgeId, string>>>({});
  const [hasUnseenBadge, setHasUnseenBadge] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [lastScreen, setLastScreen] = useState('welcome');
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({ enabled: true, volume: 0.5, selectedSound: 'bol' });
  const [ritualEntryPoint, setRitualEntryPoint] = useState('checkin');
  
  // Check-in State
  const [energie, setEnergie] = useState(0); const [humeur, setHumeur] = useState(0); const [chargeMentale, setChargeMentale] = useState(0); const [tensionCorporelle, setTensionCorporelle] = useState(0); const [fatiguePhysique, setFatiguePhysique] = useState(0); const [agitation, setAgitation] = useState(0);
  const [joie, setJoie] = useState(0); const [tristesse, setTristesse] = useState(0); const [colere, setColere] = useState(0); const [peur, setPeur] = useState(0); const [sensibilite, setSensibilite] = useState(0);
  const [clarteMentale, setClarteMentale] = useState(0); const [rumination, setRumination] = useState(0);
  const [orientationTemporelle, setOrientationTemporelle] = useState(0); const [qualitePensees, setQualitePensees] = useState(0); const [vitesseMentale, setVitesseMentale] = useState(0); const [sentimentControle, setSentimentControle] = useState(0);
  
  const [activeRitual, setActiveRitual] = useState<Ritual | null>(null);
  const [activeProgram, setActiveProgram] = useState<ActiveProgram | null>(null);
  const [completedPrograms, setCompletedPrograms] = useState<CompletedProgram[]>([]);
  const [infoModalRitualId, setInfoModalRitualId] = useState<string | null>(null);
  const [programInfoModalId, setProgramInfoModalId] = useState<string | null>(null);
  const [badgeModal, setBadgeModal] = useState<BadgeId | null>(null);
  const [helpInfo, setHelpInfo] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [geminiCheckinFeedback, setGeminiCheckinFeedback] = useState('');
  const [isLoadingCheckinFeedback, setIsLoadingCheckinFeedback] = useState(false);
  const [isLoadingJournalFeedbackForSession, setIsLoadingJournalFeedbackForSession] = useState<string | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editingText, setEditingText] = useState("");
  const [favoriteRituals, setFavoriteRituals] = useState<Set<string>>(new Set());
  const [favoritesFilterActive, setFavoritesFilterActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const infoTriggerRef = useRef<HTMLElement | null>(null);
  
  const themeLabels: Record<Theme, { labelKey: string, class: string }> = {
    dark: { labelKey: 'settings_theme_dark', class: '' },
    light: { labelKey: 'settings_theme_light', class: 'theme-light' },
    aurora: { labelKey: 'settings_theme_aurora', class: 'theme-aurora' },
    'dyslexia-tdah': { labelKey: 'settings_theme_dyslexia', class: 'theme-dyslexia-tdah' },
  };

  useEffect(() => { document.documentElement.lang = 'fr'; }, []);
  useEffect(() => { document.documentElement.className = themeLabels[theme].class; }, [theme]);
  useEffect(() => { document.documentElement.style.fontSize = `${textSize * 16}px`; }, [textSize]);
  
  // CHARGEMENT INITIAL (Local + Cloud)
  useEffect(() => { 
      const initApp = async () => {
          // Préférences locales
          const storedSound = JSON.parse(localStorage.getItem('mindPivotSound') || 'null') as SoundSettings | null; if (storedSound) setSoundSettings(storedSound);
          const storedFavorites = JSON.parse(localStorage.getItem('mindPivotFavorites') || '[]') as string[]; setFavoriteRituals(new Set(storedFavorites));
          const storedTheme = localStorage.getItem('mindPivotTheme') as Theme | null; if (storedTheme && themes.includes(storedTheme)) setTheme(storedTheme); else setTheme('light');
          const hasOnboarded = localStorage.getItem('mindPivotOnboarded'); if (!hasOnboarded) setShowOnboarding(true);

          // Chargement des données utilisateur via le service
          const userData = await dataService.loadUserData();
          const currentUser = await dataService.getUser();
          
          setUser(currentUser);
          setSessions(userData.sessions);
          setUnlockedBadges(userData.unlockedBadges);
          setActiveProgram(userData.activeProgram);
          setCompletedPrograms(userData.completedPrograms);
          
          // Premium : priorité à la DB, sinon fallback sur simulation locale
          const storedPremiumSimulated = localStorage.getItem('mindPivotPremium') === 'true';
          setIsPremiumUser(userData.isPremium || storedPremiumSimulated);
      };
      
      initApp();

      // Écouteur d'authentification Supabase
      if (supabase) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
              if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                  const currentUser = await dataService.getUser();
                  setUser(currentUser);
                  // Recharger les données pour refléter le changement d'état
                  const userData = await dataService.loadUserData();
                  setSessions(userData.sessions);
                  setUnlockedBadges(userData.unlockedBadges);
                  setIsPremiumUser(userData.isPremium || (localStorage.getItem('mindPivotPremium') === 'true'));
              }
          });
          return () => subscription.unsubscribe();
      }
  }, []);

  useEffect(() => { localStorage.setItem('mindPivotSound', JSON.stringify(soundSettings)); }, [soundSettings]);
  useEffect(() => { localStorage.setItem('mindPivotTheme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('mindPivotActiveProgram', JSON.stringify(activeProgram)); }, [activeProgram]);
  useEffect(() => { localStorage.setItem('mindPivotCompletedPrograms', JSON.stringify(completedPrograms)); }, [completedPrograms]);
  useEffect(() => { try { localStorage.setItem('mindPivotFavorites', JSON.stringify(Array.from(favoriteRituals))); } catch (e) { console.error("Failed to save favorites:", e); } }, [favoriteRituals]);

  const toggleFavorite = (ritualId: string) => { setFavoriteRituals(prev => { const newFavorites = new Set(prev); if (newFavorites.has(ritualId)) { newFavorites.delete(ritualId); } else { newFavorites.add(ritualId); } return newFavorites; }); };
  const navigateTo = (screen: string) => { window.scrollTo(0, 0); setLastScreen(currentScreen); setCurrentScreen(screen); if (screen === 'parcours') setHasUnseenBadge(false); };
  const resetCheckin = () => { setEnergie(0); setHumeur(0); setChargeMentale(0); setTensionCorporelle(0); setFatiguePhysique(0); setAgitation(0); setJoie(0); setTristesse(0); setColere(0); setPeur(0); setSensibilite(0); setClarteMentale(0); setRumination(0); setOrientationTemporelle(0); setQualitePensees(0); setVitesseMentale(0); setSentimentControle(0); };
  const resetAndGoHome = () => { resetCheckin(); navigateTo('welcome'); };
  
  const handleStartRitual = (id: string, from = 'checkin') => { 
    const ritual = RITUELS.find(r => r.id === id); 
    if (ritual) {
      if (ritual.isPremium && !isPremiumUser) { setShowPremiumModal(true); return; }
      setRitualEntryPoint(from); setActiveRitual(ritual); navigateTo('player'); 
    } 
  };

  const handleStartProgram = (programId: string) => { const program = PROGRAMS.find(p => p.id === programId); if (program) { if (program.isPremium && !isPremiumUser) { setShowPremiumModal(true); return; } const newActiveProgram = { programId, currentDay: 1 }; setActiveProgram(newActiveProgram); handleContinueProgram(newActiveProgram); } };
  const handleContinueProgram = (programState: ActiveProgram) => { const program = PROGRAMS.find(p => p.id === programState.programId); if (program && programState.currentDay <= program.durationDays) { const ritualId = program.ritualIds[programState.currentDay - 1]; handleStartRitual(ritualId, 'program'); } };
  const handleAbandonProgram = () => { if (window.confirm("Es-tu sûr de vouloir abandonner ce parcours ?")) { setActiveProgram(null); } };
  const handleInfoRitual = (id: string) => { infoTriggerRef.current = document.activeElement as HTMLElement; setInfoModalRitualId(id); };
  const closeInfoModal = () => { setInfoModalRitualId(null); infoTriggerRef.current?.focus(); };
  
  const handleRandomRitual = () => {
      const recentRitualIds = sessions.slice(-3).map(s => s.ritualId);
      let availableRituals = RITUELS.filter(r => (!r.isPremium || isPremiumUser) && !r.id.endsWith('5m') && !recentRitualIds.includes(r.id));
      if (availableRituals.length === 0) availableRituals = RITUELS.filter(r => (!r.isPremium || isPremiumUser) && !r.id.endsWith('5m'));
      if (availableRituals.length === 0) { setShowPremiumModal(true); return; }
      const randomRitual = availableRituals[Math.floor(Math.random() * availableRituals.length)];
      if (randomRitual) handleStartRitual(randomRitual.id, 'random');
  };
  
  const checkForNewBadges = useCallback((potentialSessions: Session[]): BadgeId | null => {
      const streaks = calculateSessionStreaks(potentialSessions);
      const badgeIds = Object.keys(BADGES) as BadgeId[];
      for (const badgeId of badgeIds) {
          if (!unlockedBadges[badgeId] && isBadgeUnlocked(badgeId, potentialSessions, streaks, completedPrograms)) return badgeId;
      }
      return null;
  }, [unlockedBadges, completedPrograms]);
  
  const handleCompleteRitual = async (ritualId: string, dureeSec: number, journalText: string, newlyUnlockedBadgeId: BadgeId | null) => {
      if (dureeSec > 0) {
          const newSession: Session = { id: `sess_${Date.now()}`, ritualId, dureeSec, timestamp: new Date().toISOString(), journal: journalText };
          try {
              setSessions(prevSessions => [...prevSessions, newSession]);
              await dataService.saveSession(newSession); // Sauvegarde via Service
              if (newlyUnlockedBadgeId && !unlockedBadges[newlyUnlockedBadgeId]) {
                  const now = new Date().toISOString();
                  setUnlockedBadges(prevBadges => ({ ...prevBadges, [newlyUnlockedBadgeId]: now }));
                  setHasUnseenBadge(true);
                  await dataService.unlockBadge(newlyUnlockedBadgeId); // Sauvegarde Badge
              }
          } catch (error) { console.error("Failed to save session:", error); }
      }
      // Logique Programme
      if (ritualEntryPoint === 'program' && activeProgram) {
          const program = PROGRAMS.find(p => p.id === activeProgram.programId);
          if (program) {
              if (activeProgram.currentDay < program.durationDays) {
                  setActiveProgram(ap => ap ? { ...ap, currentDay: ap.currentDay + 1 } : null);
              } else {
                  alert(t('program_completion_message', { title: t(program.title) }));
                  setCompletedPrograms(prev => {
                    const updated = [...prev, { programId: program.id, completedAt: new Date().toISOString() }];
                    const streaks = calculateSessionStreaks(sessions);
                    const parcoursBadgeId: BadgeId = 'PARCOURS_TERMINE';
                    if (!unlockedBadges[parcoursBadgeId] && isBadgeUnlocked(parcoursBadgeId, sessions, streaks, updated)) {
                         setUnlockedBadges(prevBadges => ({ ...prevBadges, [parcoursBadgeId]: new Date().toISOString() }));
                         setHasUnseenBadge(true);
                         dataService.unlockBadge(parcoursBadgeId);
                    }
                    return updated;
                  });
                  setActiveProgram(null);
              }
          }
      }
      if (['all', 'program', 'random'].includes(ritualEntryPoint)) navigateTo('welcome'); else navigateTo('suggestions');
  };

  const handleDeleteSession = (sessionId: string) => { if (window.confirm(t('journal_delete_confirm'))) { setSessions(prevSessions => { const updatedSessions = prevSessions.filter(s => s.id !== sessionId); localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions)); return updatedSessions; }); } };
  const handleEditSession = (session: Session) => { setEditingSession(session); setEditingText(session.journal || ""); };
  const handleSaveEdit = () => { if(!editingSession) return; setSessions(prevSessions => { const updatedSessions = prevSessions.map(s => s.id === editingSession.id ? { ...s, journal: editingText } : s); localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions)); return updatedSessions; }); setEditingSession(null); setEditingText(""); };

  const handleRequestJournalFeedback = async (session: Session) => {
    if (!session.journal) return;
    const ritual = RITUELS.find(r => r.id === session.ritualId);
    if (!ritual) return;
    if (!isPremiumUser) { setShowPremiumModal(true); return; }
    setIsLoadingJournalFeedbackForSession(session.id);
    try {
        const prompt = `Tu es un coach de bien-être. Rituel terminé: "${t(ritual.label)}". Journal: "${session.journal}". Feedback court (2 phrases, 40 mots max) en français, validant le ressenti et encourageant. Tutoiement.`;
        const feedback = await generateGeminiText(prompt);
        setSessions(prevSessions => { const updatedSessions = prevSessions.map(s => s.id === session.id ? { ...s, iaFeedback: feedback.trim() } : s); localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions)); return updatedSessions; });
    } catch (error) { console.error("Gemini error:", error); } finally { setIsLoadingJournalFeedbackForSession(null); }
  };

  const handleOnboardingComplete = () => { try { localStorage.setItem('mindPivotOnboarded', 'true'); setShowOnboarding(false); } catch (e) { setShowOnboarding(false); } };

  const clearAllData = () => {
      if (window.confirm(t('settings_clear_data_confirm'))) {
          try {
              localStorage.clear(); // Nettoyage radical
              window.location.reload();
          } catch (e) { alert(t('settings_clear_data_error')); }
      }
  };

  const goBack = () => {
    if(currentScreen === 'player') navigateTo(lastScreen);
    else if(['all', 'stats', 'journal', 'parcours', 'programs', 'profile', 'howitworks', 'faq', 'settings'].includes(currentScreen)) { resetAndGoHome(); }
    else if (currentScreen === 'suggestions') navigateTo('checkin_pensees');
    else if (currentScreen === 'checkin_pensees') navigateTo('checkin_emotions');
    else if (currentScreen === 'checkin_emotions') navigateTo('checkin_general');
    else if (currentScreen === 'checkin_general') navigateTo('checkin_rapide');
    else navigateTo('welcome');
  }
  
  const getSuggestedRituals = useCallback((): Ritual[] => {
      // Logique simplifiée pour l'exemple, à adapter selon vos algos complexes
      // Filtrer par tags correspondant au checkin
      const candidateRituals = RITUELS.filter(r => !r.isPremium || isPremiumUser);
      return candidateRituals.slice(0, 4); 
  }, [isPremiumUser]);
  
  useEffect(() => {
    if (currentScreen === 'suggestions') {
      const fetchFeedback = async () => {
        setIsLoadingCheckinFeedback(true);
        try {
          // Appel Gemini fictif ou réel ici pour le feedback du checkin
          setGeminiCheckinFeedback("Voici une sélection pour toi."); 
        } finally { setIsLoadingCheckinFeedback(false); }
      };
      fetchFeedback();
    }
  }, [currentScreen]);

  // Safely detect user agent
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';
  const isIOS = isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isAndroid = isBrowser && /Android/.test(navigator.userAgent);
  
  const playTestSound = (soundId: 'bol' | 'diapason' | 'gong' | 'none') => {
      if (soundId === 'none' || !soundSettings.enabled) return;
      new Audio(SOUND_OPTIONS[soundId].url).play().catch(() => {});
  };
  
  const renderScreen = () => {
      const screenProps = { className: "animate-fade-in" };
      switch (currentScreen) {
        case 'welcome':
          const currentProgram = activeProgram ? PROGRAMS.find(p => p.id === activeProgram.programId) : null;
          return (
            <div {...screenProps} className="flex flex-col items-center text-center">
              {currentProgram && activeProgram && (
                <Card className="mb-6 w-full">
                  <div className="text-center">
                    <p className="text-lg text-muted mb-4">{t('current_journey_title')}<br/><strong className="text-xl text-fg">{t(currentProgram.title)}</strong></p>
                    <div className="w-full bg-white/10 rounded-full h-2.5 mb-2"><div className="bg-accent h-2.5 rounded-full" style={{width: `${(activeProgram.currentDay -1) / currentProgram.durationDays * 100}%`}}></div></div>
                    <p className="text-sm text-muted">{t('program_info_day', { day: activeProgram.currentDay })} / {currentProgram.durationDays}</p>
                    <Button onClick={() => handleContinueProgram(activeProgram)} variant="primary" className="mt-4 w-full">{t('continue_journey_button')}</Button>
                  </div>
                </Card>
              )}
              <div className="w-full mt-4">
                <h2 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: t('welcome_title') }} />
                <p className="text-muted mt-2 mb-8 text-lg">{t('welcome_subtitle')}</p>
                <div className="space-y-4 w-full max-w-xs mx-auto">
                  <Button onClick={() => navigateTo('checkin_rapide')} size="large" variant="primary" className="w-full">{t('discover_ritual_button')}</Button>
                  <Button onClick={() => navigateTo('programs')} variant="secondary" className="w-full">{t('discover_programs_button')}</Button>
                  <Button onClick={handleRandomRitual} variant="secondary" className="w-full">{t('random_ritual_button')}</Button>
                </div>
              </div>
            </div>
          );
        case 'checkin_rapide':
          return <CheckinPage energie={energie} setEnergie={setEnergie} humeur={humeur} setHumeur={setHumeur} chargeMentale={chargeMentale} setChargeMentale={setChargeMentale} onNavigate={navigateTo} onBack={resetAndGoHome} onHelp={setHelpInfo} />;
        
        case 'checkin_general':
          return (
            <div {...screenProps}>
              <Breadcrumbs current="general" onNavigate={navigateTo} />
              <Card>
                <h3 className="text-xl font-bold mb-4 text-center">{t('checkin_general_title')}</h3>
                <CheckinSlider label={t('label_tensionCorporelle_title')} value={tensionCorporelle} onChange={(e) => setTensionCorporelle(parseInt(e.target.value))} labels={LABELS.tensionCorporelle.map(k => t(k))} helpId="tensionCorporelle" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_fatiguePhysique_title')} value={fatiguePhysique} onChange={(e) => setFatiguePhysique(parseInt(e.target.value))} labels={LABELS.fatiguePhysique.map(k => t(k))} helpId="fatiguePhysique" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_agitation_title')} value={agitation} onChange={(e) => setAgitation(parseInt(e.target.value))} labels={LABELS.agitation.map(k => t(k))} helpId="agitation" onHelp={setHelpInfo} />
                <div className="mt-6 flex justify-end">
                  <Button onClick={() => navigateTo('checkin_emotions')}>{t('continue')}</Button>
                </div>
              </Card>
            </div>
          );
        case 'checkin_emotions':
          return (
            <div {...screenProps}>
              <Breadcrumbs current="emotions" onNavigate={navigateTo} />
              <Card>
                <h3 className="text-xl font-bold mb-4 text-center">{t('checkin_emotions_title')}</h3>
                <CheckinSlider label={t('label_joie_title')} value={joie} onChange={(e) => setJoie(parseInt(e.target.value))} labels={LABELS.joie.map(k => t(k))} helpId="joie" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_tristesse_title')} value={tristesse} onChange={(e) => setTristesse(parseInt(e.target.value))} labels={LABELS.tristesse.map(k => t(k))} helpId="tristesse" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_colere_title')} value={colere} onChange={(e) => setColere(parseInt(e.target.value))} labels={LABELS.colere.map(k => t(k))} helpId="colere" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_peur_title')} value={peur} onChange={(e) => setPeur(parseInt(e.target.value))} labels={LABELS.peur.map(k => t(k))} helpId="peur" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_sensibilite_title')} value={sensibilite} onChange={(e) => setSensibilite(parseInt(e.target.value))} labels={LABELS.sensibilite.map(k => t(k))} helpId="sensibilite" onHelp={setHelpInfo} />
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={() => navigateTo('checkin_general')}>{t('previous')}</Button>
                  <Button onClick={() => navigateTo('checkin_pensees')}>{t('continue')}</Button>
                </div>
              </Card>
            </div>
          );
        case 'checkin_pensees':
          return (
            <div {...screenProps}>
              <Breadcrumbs current="pensees" onNavigate={navigateTo} />
              <Card>
                <h3 className="text-xl font-bold mb-4 text-center">{t('checkin_thoughts_title')}</h3>
                <CheckinSlider label={t('label_clarteMentale_title')} value={clarteMentale} onChange={(e) => setClarteMentale(parseInt(e.target.value))} labels={LABELS.clarteMentale.map(k => t(k))} helpId="clarteMentale" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_rumination_title')} value={rumination} onChange={(e) => setRumination(parseInt(e.target.value))} labels={LABELS.rumination.map(k => t(k))} helpId="rumination" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_orientationTemporelle_title')} value={orientationTemporelle} onChange={(e) => setOrientationTemporelle(parseInt(e.target.value))} labels={LABELS.orientationTemporelle.map(k => t(k))} helpId="orientationTemporelle" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_qualitePensees_title')} value={qualitePensees} onChange={(e) => setQualitePensees(parseInt(e.target.value))} labels={LABELS.qualitePensees.map(k => t(k))} helpId="qualitePensees" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_vitesseMentale_title')} value={vitesseMentale} onChange={(e) => setVitesseMentale(parseInt(e.target.value))} labels={LABELS.vitesseMentale.map(k => t(k))} helpId="vitesseMentale" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_sentimentControle_title')} value={sentimentControle} onChange={(e) => setSentimentControle(parseInt(e.target.value))} labels={LABELS.sentimentControle.map(k => t(k))} helpId="sentimentControle" onHelp={setHelpInfo} />
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={() => navigateTo('checkin_emotions')}>{t('previous')}</Button>
                  <Button variant="primary" onClick={() => navigateTo('suggestions')}>{t('checkin_see_suggestions')}</Button>
                </div>
              </Card>
            </div>
          );
        case 'suggestions':
          const suggestions = getSuggestedRituals();
          return (
            <div {...screenProps} className="space-y-4 pb-20">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{t('suggestions_title')}</h2>
                {isLoadingCheckinFeedback ? (
                  <p className="text-sm text-muted animate-pulse">{t('loading_analysis')}</p>
                ) : (
                  <p className="text-sm text-muted italic p-2">{geminiCheckinFeedback}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                {suggestions.map(ritual => (
                  <RitualCard 
                    key={ritual.id} 
                    ritual={ritual} 
                    onStart={handleStartRitual} 
                    onInfo={handleInfoRitual} 
                    isFavorite={favoriteRituals.has(ritual.id)}
                    onToggleFavorite={toggleFavorite}
                    isPremiumUser={isPremiumUser}
                  />
                ))}
              </div>
              <div className="text-center mt-8">
                <Button variant="secondary" onClick={() => navigateTo('all')}>{t('all_rituals_button')}</Button>
              </div>
            </div>
          );
        case 'all':
          let filteredRituals = RITUELS.filter(r => 
            (t(r.label).toLowerCase().includes(searchQuery.toLowerCase()) || r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
            && (!favoritesFilterActive || favoriteRituals.has(r.id))
            && (!tagFilter || r.tags.includes(tagFilter))
          );
          
          const allTags = Array.from(new Set(RITUELS.flatMap(r => r.tags)));

          return (
            <div {...screenProps} className="space-y-4 pb-24">
              <Button variant='secondary' size='small' onClick={() => navigateTo('welcome')}>← {t('back_to_home')}</Button>
              <h2 className="text-2xl font-bold text-center mb-4">{t('all_rituals_title')}</h2>
              
              <div className="flex flex-col gap-3">
                  <input 
                    type="search" 
                    placeholder={t('search_placeholder')} 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-accent focus:outline-none transition-all"
                  />
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <button 
                          onClick={() => setFavoritesFilterActive(!favoritesFilterActive)}
                          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${favoritesFilterActive ? 'bg-amber-400/20 text-amber-400 border-amber-400' : 'bg-transparent text-muted border-white/10 hover:border-white/30'}`}
                      >
                          ★ {t('filter_favorites_label')}
                      </button>
                      <select 
                          value={tagFilter || ''} 
                          onChange={(e) => setTagFilter(e.target.value || null)}
                          className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-muted focus:outline-none"
                      >
                          <option value="">{t('all_tags')}</option>
                          {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                      </select>
                  </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRituals.map(ritual => (
                  <RitualCard 
                    key={ritual.id} 
                    ritual={ritual} 
                    onStart={handleStartRitual} 
                    onInfo={handleInfoRitual}
                    isFavorite={favoriteRituals.has(ritual.id)}
                    onToggleFavorite={toggleFavorite}
                    isPremiumUser={isPremiumUser}
                  />
                ))}
              </div>
            </div>
          );
        case 'programs':
            return (
                <div {...screenProps} className="space-y-4 pb-24">
                    <Button variant='secondary' size='small' onClick={() => navigateTo('welcome')}>← {t('back_to_home')}</Button>
                    <h2 className="text-2xl font-bold text-center mb-6">{t('all_programs_title')}</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {PROGRAMS.map(program => (
                            <ProgramCard 
                                key={program.id} 
                                program={program} 
                                onStart={handleStartProgram} 
                                onInfo={(id) => setProgramInfoModalId(id)}
                                isLocked={program.isPremium && !isPremiumUser}
                            />
                        ))}
                    </div>
                </div>
            );
        case 'parcours':
            return (
                <div {...screenProps} className="space-y-6 pb-24">
                    <h2 className="text-2xl font-bold text-center">{t('journey_title')}</h2>
                    
                    {activeProgram && (
                        <Card className="border-accent/30 bg-accent/5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-accent">{t('current_journey_title')}</h3>
                                <button onClick={handleAbandonProgram} className="text-xs text-muted hover:text-bad underline">{t('abandon_journey_button')}</button>
                            </div>
                            <p className="font-bold text-xl mb-2">{t(PROGRAMS.find(p => p.id === activeProgram.programId)?.title || '')}</p>
                            <div className="w-full bg-white/10 rounded-full h-3 mb-2">
                                <div className="bg-accent h-3 rounded-full transition-all duration-500" style={{width: `${(activeProgram.currentDay - 1) / (PROGRAMS.find(p => p.id === activeProgram.programId)?.durationDays || 1) * 100}%`}}></div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-sm text-muted">{t('program_info_day', { day: activeProgram.currentDay })} / {PROGRAMS.find(p => p.id === activeProgram.programId)?.durationDays}</p>
                                <Button size="small" onClick={() => handleContinueProgram(activeProgram)}>{t('continue_journey_button')}</Button>
                            </div>
                        </Card>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="text-center p-4">
                            <p className="text-3xl font-bold text-accent">{calculateSessionStreaks(sessions).current}</p>
                            <p className="text-xs text-muted uppercase tracking-wider">{t('journey_streak_current')}</p>
                        </Card>
                        <Card className="text-center p-4">
                            <p className="text-3xl font-bold text-white">{calculateSessionStreaks(sessions).longest}</p>
                            <p className="text-xs text-muted uppercase tracking-wider">{t('journey_streak_record')}</p>
                        </Card>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">{t('journey_unlocked_badges', { unlockedCount: Object.keys(unlockedBadges).length, totalCount: Object.keys(BADGES).length })}</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {(Object.entries(BADGES) as [BadgeId, Badge][]).map(([id, badge]) => {
                                const isUnlocked = !!unlockedBadges[id];
                                return (
                                    <div 
                                        key={id} 
                                        onClick={() => setBadgeModal(id)}
                                        className={`aspect-square rounded-full flex items-center justify-center text-2xl border-2 cursor-pointer transition-all ${isUnlocked ? 'bg-accent/20 border-accent text-white shadow-lg shadow-accent/20 hover:scale-110' : 'bg-white/5 border-white/10 text-white/20 grayscale'}`}
                                    >
                                        {badge.icon}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    <div className="text-center pt-4">
                        <Button variant="secondary" onClick={() => navigateTo('programs')}>{t('journey_see_all_programs')}</Button>
                    </div>
                </div>
            );
        case 'journal':
            const reversedSessions = [...sessions].reverse();
            return (
                <div {...screenProps} className="space-y-4 pb-24">
                    <Button variant='secondary' size='small' onClick={() => navigateTo('welcome')}>← {t('back_to_home')}</Button>
                    <h2 className="text-2xl font-bold text-center mb-6">{t('journal_title')}</h2>
                    {reversedSessions.length === 0 ? (
                        <p className="text-center text-muted">{t('journal_empty')}</p>
                    ) : (
                        reversedSessions.map(session => {
                            const ritual = RITUELS.find(r => r.id === session.ritualId);
                            const date = new Date(session.timestamp).toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
                            return (
                                <Card key={session.id} className="relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-lg">{ritual ? t(ritual.label) : 'Rituel inconnu'}</h4>
                                            <p className="text-xs text-muted capitalize">{date} • {Math.floor(session.dureeSec / 60)} min</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditSession(session)} className="text-muted hover:text-white p-1" title={t('journal_edit')}>✎</button>
                                            <button onClick={() => handleDeleteSession(session.id)} className="text-muted hover:text-bad p-1" title={t('journal_delete')}>🗑️</button>
                                        </div>
                                    </div>
                                    {editingSession?.id === session.id ? (
                                        <div className="space-y-2">
                                            <textarea 
                                                value={editingText} 
                                                onChange={(e) => setEditingText(e.target.value)} 
                                                className="w-full p-2 rounded bg-white/10 border border-white/20 text-sm min-h-[100px]"
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <Button size="small" variant="secondary" onClick={() => setEditingSession(null)}>{t('journal_cancel')}</Button>
                                                <Button size="small" variant="primary" onClick={handleSaveEdit}>{t('journal_save')}</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-white/5 p-3 rounded-lg text-sm italic text-white/80 mb-3 whitespace-pre-wrap border-l-2 border-accent/50">
                                                {session.journal || t('journal_no_notes')}
                                            </div>
                                            {session.journal && (
                                                <div className="mt-3 pt-3 border-t border-white/10">
                                                    {session.iaFeedback ? (
                                                        <div className="bg-accent/10 p-3 rounded-lg text-sm text-accent-info">
                                                            <span className="font-bold block mb-1">🤖 {t('journal_ia_coach_feedback_label')}</span>
                                                            {session.iaFeedback}
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleRequestJournalFeedback(session)}
                                                            disabled={isLoadingJournalFeedbackForSession === session.id}
                                                            className="text-xs text-accent-info hover:underline flex items-center gap-1"
                                                        >
                                                            {isLoadingJournalFeedbackForSession === session.id ? t('journal_ia_coach_loading') : `✨ ${t('journal_ia_coach_button')}`}
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </Card>
                            );
                        })
                    )}
                </div>
            );
        case 'stats': return <StatsScreen sessions={sessions} onBack={goBack} />;
        case 'profile':
            return (
                <div {...screenProps} className="space-y-6 pb-24">
                    <h2 className="text-2xl font-bold text-center">{t('profile_title')}</h2>
                    <Card>
                        <div className="text-center space-y-2">
                            {user ? (
                                <>
                                    <p className="font-bold text-lg">Bonjour, {user.first_name || user.email.split('@')[0]} !</p>
                                    <p className="text-sm text-muted">{user.is_premium ? 'Membre Premium ✨' : 'Compte Gratuit'}</p>
                                    <Button size="small" variant="secondary" onClick={() => dataService.signOut()}>Se déconnecter</Button>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm text-muted mb-2">Connecte-toi pour sauvegarder tes données.</p>
                                    <Button variant="primary" onClick={() => setShowAuthModal(true)}>Se connecter / Créer un compte</Button>
                                </>
                            )}
                        </div>
                    </Card>
                    <Card>
                        <div className="grid grid-cols-3 gap-4 text-center">
                             <div><p className="text-3xl font-bold">{calculateSessionStreaks(sessions).current}</p><p className="text-xs text-muted">{t('journey_streak_current')}</p></div>
                             <div><p className="text-3xl font-bold">{calculateSessionStreaks(sessions).longest}</p><p className="text-xs text-muted">{t('journey_streak_record')}</p></div>
                             <div><p className="text-3xl font-bold">{sessions.length}</p><p className="text-xs text-muted">{t('profile_rituals_completed')}</p></div>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="font-bold text-lg mb-3 text-left">{t('profile_navigation')}</h3>
                        <div className="space-y-2">
                            {[{labelKey: 'profile_nav_badges', screen: 'parcours', icon: '🏆'}, {labelKey: 'profile_nav_stats', screen: 'stats', icon: '📊'}, {labelKey: 'profile_nav_journal', screen: 'journal', icon: '📖'}].map(item => (
                                <button key={item.screen} onClick={() => navigateTo(item.screen)} className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-colors">
                                    <span className="text-2xl">{item.icon}</span><span className="flex-1 font-semibold">{t(item.labelKey)}</span><span className="text-muted">&gt;</span>
                                </button>
                            ))}
                        </div>
                    </Card>
                </div>
            );
        case 'howitworks': return <HowItWorksPage onNavigate={navigateTo} />;
        case 'faq': return <FAQPage onNavigate={navigateTo} />;
        case 'settings': return <SettingsPage onNavigate={navigateTo} theme={theme} setTheme={setTheme} textSize={textSize} setTextSize={setTextSize} soundSettings={soundSettings} setSoundSettings={setSoundSettings} playTestSound={playTestSound} isIOS={isIOS} isAndroid={isAndroid} setShowInstallModal={setShowInstallModal} isPremiumUser={isPremiumUser} setIsPremiumUser={setIsPremiumUser} clearAllData={clearAllData} themeLabels={themeLabels} />;
        case 'player': if (activeRitual) return <Player ritual={activeRitual} onComplete={handleCompleteRitual} onBack={goBack} sessions={sessions} onCheckForNewBadges={checkForNewBadges} soundSettings={soundSettings} setSoundSettings={setSoundSettings} checkinData={{}} onShowInfo={handleInfoRitual} />; return null;
        default: return <Card><p>Écran non trouvé.</p><Button variant="primary" onClick={resetAndGoHome}>{t('home')}</Button></Card>;
      }
  };
  
  if (showOnboarding) return <OnboardingScreen onComplete={handleOnboardingComplete} />;

  return (
    <div className="min-h-screen text-fg font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24 relative">
        {currentScreen !== 'player' && !showOnboarding && (
            <header className="flex justify-between items-start mb-6">
                <div>
                  <button onClick={resetAndGoHome} className="text-left focus:outline-none"><h1 className="text-2xl font-bold">MindPivot 🔥</h1></button>
                  <p className="text-sm text-muted">{t('header_subtitle')}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Button onClick={() => navigateTo('all')} size="small" className="btn-gradient-cta">{t('all_rituals_button')}</Button>
                    <div className="flex items-center">
                      <Button variant="ghost" size="small" className="!p-0 w-8 h-8" onClick={() => navigateTo('settings')}><SettingsIcon /></Button>
                    </div>
                </div>
            </header>
        )}
        {renderScreen()}
      </div>
      
      {currentScreen !== 'player' && !showOnboarding && (
        <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-white/10 flex justify-around p-1">
            <FooterButton icon={<HomeIcon/>} label={t('nav_home')} onClick={() => navigateTo('welcome')} isActive={currentScreen === 'welcome'} />
            <FooterButton icon={<JourneyIcon/>} label={t('nav_journey')} onClick={() => navigateTo('parcours')} isActive={['parcours', 'programs'].includes(currentScreen)} hasNotification={hasUnseenBadge} />
            <FooterButton icon={<JournalIcon/>} label={t('nav_journal')} onClick={() => navigateTo('journal')} isActive={currentScreen === 'journal'} />
            <FooterButton icon={<StatsIcon/>} label={t('nav_stats')} onClick={() => navigateTo('stats')} isActive={currentScreen === 'stats'} />
            <FooterButton icon={<ProfileIcon/>} label={t('nav_profile')} onClick={() => navigateTo('profile')} isActive={currentScreen === 'profile'} />
        </footer>
      )}

      {/* Modales diverses */}
      <Modal show={showAuthModal} title={""} onClose={() => setShowAuthModal(false)} hideHeaderCloseButton={true}>
          <div className="relative">
              <button className="absolute -top-6 -right-2 text-muted hover:text-fg" onClick={() => setShowAuthModal(false)}>✕</button>
              <AuthScreen onAuthSuccess={() => { setShowAuthModal(false); dataService.syncLocalToCloud(); }} />
          </div>
      </Modal>
      <PremiumModal show={showPremiumModal} onClose={() => setShowPremiumModal(false)} onUpgrade={() => { setIsPremiumUser(true); setShowPremiumModal(false); }} />
      
      {/* Autres Modales */}
      {infoModalRitualId && (
          <Modal 
              show={!!infoModalRitualId} 
              title={t(RITUELS.find(r => r.id === infoModalRitualId)?.modal.titre || '')} 
              onClose={closeInfoModal}
          >
              <div className="space-y-4">
                  {(() => {
                      const ritual = RITUELS.find(r => r.id === infoModalRitualId);
                      if(!ritual) return null;
                      return (
                          <>
                              <div className="flex justify-center text-6xl mb-4">{ritual.modal.icon}</div>
                              <div>
                                  <h4 className="font-bold text-accent">{t('why')}</h4>
                                  <p className="text-muted text-sm whitespace-pre-line">{t(ritual.modal.sections.pourquoi)}</p>
                              </div>
                              <div>
                                  <h4 className="font-bold text-accent-secondary">{t('how')}</h4>
                                  <p className="text-muted text-sm whitespace-pre-line">{t(ritual.modal.sections.comment)}</p>
                              </div>
                              <div>
                                  <h4 className="font-bold text-accent-tertiary">{t('tips')}</h4>
                                  <p className="text-muted text-sm whitespace-pre-line">{t(ritual.modal.sections.conseils)}</p>
                              </div>
                              {ritual.modal.sections.enSavoirPlus && (
                                  <div>
                                      <h4 className="font-bold text-accent-info">{t('learn_more')}</h4>
                                      <p className="text-muted text-sm whitespace-pre-line">{t(ritual.modal.sections.enSavoirPlus)}</p>
                                  </div>
                              )}
                              {ritual.modal.sections.pourAllerPlusLoin && (
                                  <div className="pt-2 border-t border-white/10">
                                      <h4 className="font-bold text-muted mb-1 text-xs uppercase tracking-wider">{t('go_further')}</h4>
                                      <div className="text-link text-sm" dangerouslySetInnerHTML={{ __html: t(ritual.modal.sections.pourAllerPlusLoin) }} />
                                  </div>
                              )}
                          </>
                      );
                  })()}
              </div>
          </Modal>
      )}

      {programInfoModalId && (
          <Modal 
              show={!!programInfoModalId} 
              title={t(PROGRAMS.find(p => p.id === programInfoModalId)?.title || '')} 
              onClose={() => setProgramInfoModalId(null)}
          >
              <div className="space-y-4">
                  {(() => {
                      const program = PROGRAMS.find(p => p.id === programInfoModalId);
                      if(!program) return null;
                      return (
                          <>
                              <div className="flex justify-center text-6xl mb-4">{program.icon}</div>
                              {program.details && (
                                  <>
                                      <div><h4 className="font-bold text-accent">{t('program_info_objective')}</h4><p className="text-muted text-sm">{t(program.details.objective)}</p></div>
                                      <div><h4 className="font-bold text-accent-secondary">{t('program_info_mechanism')}</h4><p className="text-muted text-sm">{t(program.details.mechanism)}</p></div>
                                      <div><h4 className="font-bold text-accent-tertiary">{t('program_info_benefits')}</h4><p className="text-muted text-sm">{t(program.details.benefits)}</p></div>
                                  </>
                              )}
                              <div className="bg-white/5 p-4 rounded-lg mt-4">
                                  <h4 className="font-bold mb-2">{t('program_info_rituals_list', { durationDays: program.durationDays })}</h4>
                                  <ul className="text-sm space-y-1">
                                      {program.ritualIds.map((rid, idx) => {
                                          const r = RITUELS.find(rit => rit.id === rid);
                                          return <li key={idx} className="flex justify-between text-muted"><span>{t('program_info_day', { day: idx + 1 })}</span> <span className="text-fg font-medium">{r ? t(r.label) : rid}</span></li>;
                                      })}
                                  </ul>
                              </div>
                              <div className="pt-4 flex justify-center">
                                  <Button onClick={() => { setProgramInfoModalId(null); handleStartProgram(program.id); }}>{t('program_info_start_button')}</Button>
                              </div>
                          </>
                      );
                  })()}
              </div>
          </Modal>
      )}

      {badgeModal && (
          <Modal show={!!badgeModal} title={t(BADGES[badgeModal]?.name || '')} onClose={() => setBadgeModal(null)}>
              <div className="text-center p-4">
                  <div className="text-8xl mb-6 animate-emoji-pulse">{BADGES[badgeModal]?.icon}</div>
                  <p className="text-lg text-muted mb-4">{t(BADGES[badgeModal]?.description || '')}</p>
                  {unlockedBadges[badgeModal] && (
                      <p className="text-xs text-accent uppercase tracking-widest font-bold">
                          {t('journey_badge_unlocked_on', { date: new Date(unlockedBadges[badgeModal]!).toLocaleDateString() })}
                      </p>
                  )}
                  {navigator.share && (
                      <Button variant="secondary" className="mt-6" onClick={() => {
                          navigator.share({
                              title: t('journey_badge_share_title'),
                              text: t('journey_badge_share_text', { badgeName: t(BADGES[badgeModal]!.name), badgeIcon: BADGES[badgeModal]!.icon }),
                              url: window.location.href
                          }).catch(console.error);
                      }}>
                          <ShareIcon /> {t('journey_share_badge')}
                      </Button>
                  )}
              </div>
          </Modal>
      )}

      {helpInfo && (
          <Modal show={!!helpInfo} title={t(HELP_CONTENT[helpInfo as keyof typeof HELP_CONTENT]?.title || '')} onClose={() => setHelpInfo(null)}>
              <p className="text-muted leading-relaxed">{t(HELP_CONTENT[helpInfo as keyof typeof HELP_CONTENT]?.text || '')}</p>
          </Modal>
      )}

      {showShareModal && (
          <Modal show={showShareModal} title={t('settings_share_title')} onClose={() => setShowShareModal(false)}>
              <div className="text-center">
                  <p className="mb-4">{t('settings_share_text')}</p>
                  {navigator.share ? (
                      <Button onClick={() => navigator.share({ title: 'MindPivot', text: t('settings_share_text'), url: window.location.href })}>Partager</Button>
                  ) : (
                      <p className="text-sm text-muted">{t('share_not_supported')}</p>
                  )}
              </div>
          </Modal>
      )}

      {showInstallModal && (
          <Modal show={showInstallModal} title={t('settings_install_title')} onClose={() => setShowInstallModal(false)}>
              <div className="space-y-4 text-center">
                  <div className="text-6xl mb-2">📲</div>
                  <p className="text-lg font-semibold">{t('settings_install_app')}</p>
                  {isIOS && (
                      <div className="bg-white/5 p-4 rounded-lg text-left text-sm space-y-2">
                          <p>1. {t('settings_install_ios').split(',')[0]}</p>
                          <p>2. {t('settings_install_ios').split(',')[1]}</p>
                      </div>
                  )}
                  {isAndroid && (
                      <div className="bg-white/5 p-4 rounded-lg text-left text-sm space-y-2">
                          <p>1. {t('settings_install_android').split(',')[0]}</p>
                          <p>2. {t('settings_install_android').split(',')[1]}</p>
                      </div>
                  )}
              </div>
          </Modal>
      )}
    </div>
  );
}

export default App;
