import { useState, useEffect, useCallback, useRef } from 'react';
import { RITUELS, SOUND_OPTIONS, PROGRAMS, BADGES, BADGE_CATEGORIES, LABELS, HELP_CONTENT } from './constants.ts';
import type { Ritual, Session, Badge, BadgeId, Streaks, SoundSettings, ActiveProgram, CompletedProgram } from './types.ts';
import { calculateSessionStreaks } from './utils.ts';
import { useI18n } from './hooks/useI18n.tsx';
import { isBadgeUnlocked } from './badgeLogic.ts';
import { generateGeminiText } from './services/geminiService.ts';

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

// --- SVG Icons (can stay here as they are small) ---
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
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [textSize, setTextSize] = useState(1);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [unlockedBadges, setUnlockedBadges] = useState<Partial<Record<BadgeId, string>>>({});
  const [hasUnseenBadge, setHasUnseenBadge] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [lastScreen, setLastScreen] = useState('welcome');
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({ enabled: true, volume: 0.5, selectedSound: 'bol' });
  const [ritualEntryPoint, setRitualEntryPoint] = useState('checkin');
  
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
  const testAudioRef = useRef<HTMLAudioElement>(null);
  
  const themeLabels: Record<Theme, { labelKey: string, class: string }> = {
    dark: { labelKey: 'settings_theme_dark', class: '' },
    light: { labelKey: 'settings_theme_light', class: 'theme-light' },
    aurora: { labelKey: 'settings_theme_aurora', class: 'theme-aurora' },
    'dyslexia-tdah': { labelKey: 'settings_theme_dyslexia', class: 'theme-dyslexia-tdah' },
  };


  useEffect(() => { document.documentElement.lang = 'fr'; }, []);
  useEffect(() => { document.documentElement.className = themeLabels[theme].class; }, [theme]);
  useEffect(() => { document.documentElement.style.fontSize = `${textSize * 16}px`; }, [textSize]);
  useEffect(() => { 
      try { 
          const storedSessions = JSON.parse(localStorage.getItem('mindPivotSessions') || '[]') as Session[]; setSessions(storedSessions); 
          const storedBadges = JSON.parse(localStorage.getItem('mindPivotBadges') || '{}') as Partial<Record<BadgeId, string>>; setUnlockedBadges(storedBadges);
          const storedSound = JSON.parse(localStorage.getItem('mindPivotSound') || 'null') as SoundSettings | null; if (storedSound) setSoundSettings(storedSound);
          const storedFavorites = JSON.parse(localStorage.getItem('mindPivotFavorites') || '[]') as string[]; setFavoriteRituals(new Set(storedFavorites));
          const storedTheme = localStorage.getItem('mindPivotTheme') as Theme | null; if (storedTheme && themes.includes(storedTheme)) setTheme(storedTheme); else setTheme('light');
          const storedPremium = localStorage.getItem('mindPivotPremium') === 'true'; setIsPremiumUser(storedPremium);
          const storedProgram = JSON.parse(localStorage.getItem('mindPivotActiveProgram') || 'null') as ActiveProgram | null; setActiveProgram(storedProgram);
          const storedCompletedPrograms = JSON.parse(localStorage.getItem('mindPivotCompletedPrograms') || '[]') as CompletedProgram[]; setCompletedPrograms(storedCompletedPrograms);
          const hasOnboarded = localStorage.getItem('mindPivotOnboarded');
          if (!hasOnboarded) {
              setShowOnboarding(true);
          }
      } catch(e) { console.error('Failed to load data'); } 
  }, []);

  useEffect(() => { localStorage.setItem('mindPivotSound', JSON.stringify(soundSettings)); }, [soundSettings]);
  useEffect(() => { localStorage.setItem('mindPivotTheme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('mindPivotPremium', String(isPremiumUser)); }, [isPremiumUser]);
  useEffect(() => { localStorage.setItem('mindPivotActiveProgram', JSON.stringify(activeProgram)); }, [activeProgram]);
  useEffect(() => { localStorage.setItem('mindPivotCompletedPrograms', JSON.stringify(completedPrograms)); }, [completedPrograms]);

  useEffect(() => {
      try {
          localStorage.setItem('mindPivotFavorites', JSON.stringify(Array.from(favoriteRituals)));
      } catch (e) {
          console.error("Failed to save favorites:", e);
      }
  }, [favoriteRituals]);

  const toggleFavorite = (ritualId: string) => {
    setFavoriteRituals(prev => {
        const newFavorites = new Set(prev);
        if (newFavorites.has(ritualId)) {
            newFavorites.delete(ritualId);
        } else {
            newFavorites.add(ritualId);
        }
        return newFavorites;
    });
  };

  const navigateTo = (screen: string) => { window.scrollTo(0, 0); setLastScreen(currentScreen); setCurrentScreen(screen); if (screen === 'parcours') setHasUnseenBadge(false); };
  const resetCheckin = () => { 
      setEnergie(0); setHumeur(0); setChargeMentale(0); 
      setTensionCorporelle(0); setFatiguePhysique(0); setAgitation(0);
      setJoie(0); setTristesse(0); setColere(0); setPeur(0); setSensibilite(0);
      setClarteMentale(0); setRumination(0); setOrientationTemporelle(0); 
      setQualitePensees(0); setVitesseMentale(0); setSentimentControle(0); 
  };
  const resetAndGoHome = () => { resetCheckin(); navigateTo('welcome'); };
  
  const handleStartRitual = (id: string, from = 'checkin') => { 
    const ritual = RITUELS.find(r => r.id === id); 
    if (ritual) {
      if (ritual.isPremium && !isPremiumUser) {
        setShowPremiumModal(true);
        return;
      }
      setRitualEntryPoint(from);
      setActiveRitual(ritual); 
      navigateTo('player'); 
    } 
  };

  const handleStartProgram = (programId: string) => {
      const program = PROGRAMS.find(p => p.id === programId);
      if (program) {
          if (program.isPremium && !isPremiumUser) {
              setShowPremiumModal(true);
              return;
          }
          const newActiveProgram = { programId, currentDay: 1 };
          setActiveProgram(newActiveProgram);
          handleContinueProgram(newActiveProgram);
      }
  };

  const handleContinueProgram = (programState: ActiveProgram) => {
      const program = PROGRAMS.find(p => p.id === programState.programId);
      if (program && programState.currentDay <= program.durationDays) {
          const ritualId = program.ritualIds[programState.currentDay - 1];
          handleStartRitual(ritualId, 'program');
      }
  };

  const handleAbandonProgram = () => {
      if (window.confirm("Es-tu sûr de vouloir abandonner ce parcours ? Ta progression sera perdue.")) {
          setActiveProgram(null);
      }
  };

  const handleInfoRitual = (id: string) => { infoTriggerRef.current = document.activeElement as HTMLElement; setInfoModalRitualId(id); };
  const closeInfoModal = () => { setInfoModalRitualId(null); infoTriggerRef.current?.focus(); };
  
  const handleRandomRitual = () => {
      const recentRitualIds = sessions.slice(-3).map(s => s.ritualId);
      let availableRituals = RITUELS.filter(r => 
          (!r.isPremium || isPremiumUser) && 
          !r.id.endsWith('5m') && 
          !recentRitualIds.includes(r.id)
      );

      if (availableRituals.length === 0) {
          // Fallback if filtering leaves no options
          availableRituals = RITUELS.filter(r => (!r.isPremium || isPremiumUser) && !r.id.endsWith('5m'));
      }
      
      if (availableRituals.length === 0) {
          setShowPremiumModal(true);
          return;
      }

      const randomRitual = availableRituals[Math.floor(Math.random() * availableRituals.length)];
      if (randomRitual) {
          handleStartRitual(randomRitual.id, 'random');
      }
  };
  
  const checkForNewBadges = useCallback((potentialSessions: Session[]): BadgeId | null => {
      const streaks = calculateSessionStreaks(potentialSessions);
      const badgeIds = Object.keys(BADGES) as BadgeId[];
      for (const badgeId of badgeIds) {
          if (!unlockedBadges[badgeId]) {
              if (isBadgeUnlocked(badgeId, potentialSessions, streaks, completedPrograms)) {
                  return badgeId;
              }
          }
      }
      return null;
  }, [unlockedBadges, completedPrograms]);
  
  const handleCompleteRitual = (ritualId: string, dureeSec: number, journalText: string, newlyUnlockedBadgeId: BadgeId | null) => {
      if (dureeSec > 0) {
          const newSession: Session = { id: `sess_${Date.now()}`, ritualId, dureeSec, timestamp: new Date().toISOString(), journal: journalText };
          try {
              setSessions(prevSessions => {
                  const updatedSessions = [...prevSessions, newSession];
                  localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions));
                  return updatedSessions;
              });

              if (newlyUnlockedBadgeId && !unlockedBadges[newlyUnlockedBadgeId]) {
                  setUnlockedBadges(prevBadges => {
                      const updatedBadges = { ...prevBadges, [newlyUnlockedBadgeId]: new Date().toISOString() };
                      localStorage.setItem('mindPivotBadges', JSON.stringify(updatedBadges));
                      return updatedBadges;
                  });
                  setHasUnseenBadge(true);
              }
          } catch (error) {
              console.error("Failed to save session or badge:", error);
          }
      }
      if (ritualEntryPoint === 'program' && activeProgram) {
          const program = PROGRAMS.find(p => p.id === activeProgram.programId);
          if (program) {
              if (activeProgram.currentDay < program.durationDays) {
                  setActiveProgram(ap => ap ? { ...ap, currentDay: ap.currentDay + 1 } : null);
              } else {
                  alert(t('program_completion_message', { title: t(program.title) }));
                  setCompletedPrograms(prev => {
                    const updated = [...prev, { programId: program.id, completedAt: new Date().toISOString() }];
                    // Check for parcours badge immediately after completion
                    const streaks = calculateSessionStreaks(sessions);
                    const parcoursBadgeId: BadgeId = 'PARCOURS_TERMINE';
                    if (!unlockedBadges[parcoursBadgeId] && isBadgeUnlocked(parcoursBadgeId, sessions, streaks, updated)) {
                         setUnlockedBadges(prevBadges => {
                            const updatedBadges = { ...prevBadges, [parcoursBadgeId]: new Date().toISOString() };
                            localStorage.setItem('mindPivotBadges', JSON.stringify(updatedBadges));
                            return updatedBadges;
                        });
                        setHasUnseenBadge(true);
                    }
                    return updated;
                  });
                  setActiveProgram(null);
              }
          }
      }
      if (['all', 'program', 'random'].includes(ritualEntryPoint)) {
        navigateTo('welcome');
      } else {
        navigateTo('suggestions');
      }
  };

  const handleDeleteSession = (sessionId: string) => { if (window.confirm(t('journal_delete_confirm'))) { setSessions(prevSessions => { const updatedSessions = prevSessions.filter(s => s.id !== sessionId); localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions)); return updatedSessions; }); } };
  const handleEditSession = (session: Session) => { setEditingSession(session); setEditingText(session.journal || ""); };
  const handleSaveEdit = () => { if(!editingSession) return; setSessions(prevSessions => { const updatedSessions = prevSessions.map(s => s.id === editingSession.id ? { ...s, journal: editingText } : s); localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions)); return updatedSessions; }); setEditingSession(null); setEditingText(""); };

  const handleRequestJournalFeedback = async (session: Session) => {
    if (!session.journal) return;
    const ritual = RITUELS.find(r => r.id === session.ritualId);
    if (!ritual) return;

    if (!isPremiumUser) {
        setShowPremiumModal(true);
        return;
    }

    setIsLoadingJournalFeedbackForSession(session.id);
    try {
        const prompt = `Tu es un coach de bien-être, bienveillant et perspicace. Un utilisateur vient de terminer le rituel "${t(ritual.label)}" et a écrit la note suivante dans son journal : "${session.journal}". Rédige une courte réflexion (2-3 phrases, 40 mots max) en français qui valide son ressenti, offre un encouragement ou pose une question douce pour approfondir sa pensée. Adresse-toi à l'utilisateur avec "tu". Ne retourne que la réponse, sans introduction ni conclusion.`;
        const feedback = await generateGeminiText(prompt);

        setSessions(prevSessions => {
            const updatedSessions = prevSessions.map(s => s.id === session.id ? { ...s, iaFeedback: feedback.trim() } : s);
            localStorage.setItem('mindPivotSessions', JSON.stringify(updatedSessions));
            return updatedSessions;
        });
    } catch (error) {
        console.error("Gemini journal feedback error:", error);
    } finally {
        setIsLoadingJournalFeedbackForSession(null);
    }
  };

  const handleOnboardingComplete = () => {
    try {
        localStorage.setItem('mindPivotOnboarded', 'true');
        setShowOnboarding(false);
    } catch (e) {
        console.error("Failed to save onboarding status", e);
        setShowOnboarding(false);
    }
  };

  const clearAllData = () => {
      if (window.confirm(t('settings_clear_data_confirm'))) {
          try {
              localStorage.removeItem('mindPivotSessions');
              localStorage.removeItem('mindPivotBadges');
              localStorage.removeItem('mindPivotFavorites');
              localStorage.removeItem('mindPivotTheme');
              localStorage.removeItem('mindPivotOnboarded');
              localStorage.removeItem('mindPivotPremium');
              localStorage.removeItem('mindPivotActiveProgram');
              localStorage.removeItem('mindPivotCompletedPrograms');
              setSessions([]);
              setUnlockedBadges({});
              setFavoriteRituals(new Set());
              setTheme('dark');
              setIsPremiumUser(false);
              setActiveProgram(null);
              setCompletedPrograms([]);
              navigateTo('welcome');
              alert(t('settings_clear_data_success'));
          } catch (e) {
              console.error("Failed to clear data:", e);
              alert(t('settings_clear_data_error'));
          }
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
      const answers = { energie, humeur, chargeMentale, tensionCorporelle, fatiguePhysique, agitation, joie, tristesse, colere, peur, sensibilite, clarteMentale, rumination, orientationTemporelle, qualitePensees, vitesseMentale, sentimentControle };
      let needs: Record<string, number> = {};

      if (answers.energie <= -1) { needs['dynamiser'] = (needs['dynamiser'] || 0) + 2; }
      if (answers.humeur <= -1) { needs['compassion'] = (needs['compassion'] || 0) + 2; needs['mindset'] = (needs['mindset'] || 0) + 1.5; }
      if (answers.chargeMentale <= -1) { needs['apaiser'] = (needs['apaiser'] || 0) + 2; needs['lacher-prise'] = (needs['lacher-prise'] || 0) + 1.5; }
      if (answers.tensionCorporelle <= -1) { needs['somatique'] = (needs['somatique'] || 0) + 2; needs['détente'] = (needs['détente'] || 0) + 1; }
      if (answers.fatiguePhysique <= -1) { needs['dynamiser'] = (needs['dynamiser'] || 0) + 1; needs['récupération'] = (needs['récupération'] || 0) + 2; }
      if (answers.agitation <= -1) { needs['apaiser'] = (needs['apaiser'] || 0) + 2; needs['ancrage'] = (needs['ancrage'] || 0) + 1.5; }
      if (answers.tristesse <= -1) { needs['compassion'] = (needs['compassion'] || 0) + 2; needs['lacher-prise'] = (needs['lacher-prise'] || 0) + 1; }
      if (answers.colere <= -1) { needs['lacher-prise'] = (needs['lacher-prise'] || 0) + 2; needs['calmer'] = (needs['calmer'] || 0) + 1.5; }
      if (answers.peur <= -1) { needs['ancrage'] = (needs['ancrage'] || 0) + 2; needs['apaiser'] = (needs['apaiser'] || 0) + 1.5; }
      if (answers.clarteMentale <= -1) { needs['clarifier'] = (needs['clarifier'] || 0) + 2; needs['focus'] = (needs['focus'] || 0) + 1.5; }
      if (answers.rumination <= -1) { needs['presence'] = (needs['presence'] || 0) + 2; needs['lacher-prise'] = (needs['lacher-prise'] || 0) + 1.5; }
      if (answers.qualitePensees <= -1) { needs['compassion'] = (needs['compassion'] || 0) + 2; needs['mindset'] = (needs['mindset'] || 0) + 1; }
      if (answers.vitesseMentale >= 1) { needs['calmer'] = (needs['calmer'] || 0) + 1.5; }
      if (answers.sentimentControle <= -1) { needs['ancrage'] = (needs['ancrage'] || 0) + 1.5; }
      if (answers.energie <= -1 && answers.chargeMentale <= -1) { needs['lacher-prise'] = (needs['lacher-prise'] || 0) + 2; needs['somatique'] = (needs['somatique'] || 0) + 1; }
      if (answers.peur <= -1 && answers.agitation <= -1) { needs['apaiser'] = (needs['apaiser'] || 0) + 2; needs['somatique_doux'] = (needs['somatique_doux'] || 0) + 1.5; }

      const candidateRituals = RITUELS.filter(r => !r.isPremium || isPremiumUser);
      
      if (Object.keys(needs).length === 0) {
        return candidateRituals.filter(r => ['rit.equilibre_5_5', 'rit.gratitude_90', 'rit.body_scan_180', 'rit.micro_awe'].includes(r.id)).slice(0, 4);
      }

      const recentRitualIds = sessions.slice(-3).map(s => s.ritualId);
      let scores = candidateRituals.map(r => {
          let score = r.tags.reduce((acc, tag) => acc + (needs[tag] || 0), 0);
          if (recentRitualIds.includes(r.id)) { score *= 0.6; }
          if (r.id === 'rit.coherence_bento') { score *= 1.1; } // Small boost
          return { ...r, score: score };
      });
      const sortedRituals = scores.sort((a, b) => b.score - a.score);
      const topSuggestions = sortedRituals.filter(r => r.score > 0).slice(0, 10);
      let finalSuggestions: Ritual[] = [];
      let categoriesUsed: Set<string> = new Set();

      for (const ritual of topSuggestions) {
          if (finalSuggestions.length >= 4) break;
          if (!categoriesUsed.has(ritual.category) || finalSuggestions.length >= 2) {
              if (!finalSuggestions.some(s => s.id === ritual.id)) {
                  finalSuggestions.push(ritual);
                  categoriesUsed.add(ritual.category);
              }
          }
      }
      if (finalSuggestions.length < 4) {
        const remaining = topSuggestions.filter(r => !finalSuggestions.find(f => f.id === r.id));
        finalSuggestions.push(...remaining.slice(0, 4 - finalSuggestions.length));
      }
      return finalSuggestions.slice(0, 4);
  }, [sessions, isPremiumUser, energie, humeur, chargeMentale, tensionCorporelle, fatiguePhysique, agitation, joie, tristesse, colere, peur, sensibilite, clarteMentale, rumination, orientationTemporelle, qualitePensees, vitesseMentale, sentimentControle]);
  
  useEffect(() => {
    if (currentScreen === 'suggestions') {
      const fetchFeedback = async () => {
        setIsLoadingCheckinFeedback(true);
        try {
          const answers = { energie, humeur, chargeMentale, tensionCorporelle, fatiguePhysique, agitation, joie, tristesse, colere, peur, sensibilite, clarteMentale, rumination, orientationTemporelle, qualitePensees, vitesseMentale, sentimentControle };
          const summary = Object.entries(answers)
            .filter(([, value]) => value !== 0)
            .map(([key, value]) => `${t(`label_${key}_title`)}: ${t(LABELS[key as keyof typeof LABELS][(value as number)+2])}`)
            .join(', ');
          
          const prompt = `En te basant sur le check-in suivant d'un utilisateur (${summary}), rédige une phrase de synthèse courte (1-2 phrases, 30 mots max), empathique et sans jugement en français qui valide son état actuel. La phrase doit être encourageante et introduire les suggestions de rituels qui vont suivre. Adresse-toi à l'utilisateur avec "tu". Ne retourne que la phrase, sans aucune introduction ou conclusion. Exemple: "Il semble que ton énergie soit un peu basse et ton esprit agité. Voici quelques rituels pour t'aider à t'ancrer et retrouver de la sérénité."`;
          
          const feedback = await generateGeminiText(prompt);
          setGeminiCheckinFeedback(feedback.trim());
        } catch (error) {
          console.error("Gemini feedback error:", error);
          setGeminiCheckinFeedback("");
        } finally {
          setIsLoadingCheckinFeedback(false);
        }
      };
      fetchFeedback();
    }
  }, [currentScreen, energie, humeur, chargeMentale, tensionCorporelle, fatiguePhysique, agitation, joie, tristesse, colere, peur, sensibilite, clarteMentale, rumination, orientationTemporelle, qualitePensees, vitesseMentale, sentimentControle, t]);

  const infoRitualData = RITUELS.find(r => r.id === infoModalRitualId);
  const programInfoData = PROGRAMS.find(p => p.id === programInfoModalId);
  const streaks: Streaks = calculateSessionStreaks(sessions);
  const handleShare = async () => { if(navigator.share){ try { await navigator.share({ title: 'MindPivot', text: 'Une webapp de micro-rituels pour apaiser, clarifier et dynamiser.', url: window.location.href }); } catch(e) { console.error('Share failed', e); } } else { setShowShareModal(true); } };
  const handleShareBadge = async (badge: Badge) => { if(navigator.share){ try { await navigator.share({ title: t('journey_badge_share_title'), text: t('journey_badge_share_text', { badgeName: t(badge.name), badgeIcon: badge.icon }), url: window.location.href }); } catch(e) { console.error('Share failed', e); } } else { alert(t('share_not_supported')); } };
  
  // Safely detect user agent to prevent crashes
  const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';
  const userAgent = isBrowser ? navigator.userAgent : '';
  const isIOS = isBrowser && /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = isBrowser && /Android/.test(userAgent);
  
  const playTestSound = (soundId: 'bol' | 'diapason' | 'gong') => {
      if (testAudioRef.current) {
          testAudioRef.current.src = SOUND_OPTIONS[soundId].url;
          testAudioRef.current.volume = soundSettings.volume;
          testAudioRef.current.play().catch(e => console.error("Test sound error", e));
      }
  };
  
  const renderScreen = () => {
      const screenProps = { className: "animate-fade-in" };
      switch (currentScreen) {
        case 'welcome':
          const currentProgram = activeProgram ? PROGRAMS.find(p => p.id === activeProgram.programId) : null;
          const randomButtonText = t('random_ritual_button');
          const emojiIndex = randomButtonText.lastIndexOf(' ');
          const textPart = emojiIndex > -1 ? randomButtonText.substring(0, emojiIndex) : randomButtonText;
          const emojiPart = emojiIndex > -1 ? randomButtonText.substring(emojiIndex + 1) : '';

          return (
            <div {...screenProps} className="flex flex-col items-center text-center">
              {currentProgram && activeProgram && (
                <Card className="mb-6 w-full">
                  <div className="text-center">
                    <p className="text-lg text-muted mb-4">
                        {t('current_journey_title')}<br/>
                        <strong className="text-xl text-fg">{t(currentProgram.title)}</strong>
                    </p>
                    <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
                        <div className="bg-accent h-2.5 rounded-full" style={{width: `${(activeProgram.currentDay -1) / currentProgram.durationDays * 100}%`}}></div>
                    </div>
                    <p className="text-sm text-muted">{t('program_info_day', { day: activeProgram.currentDay })} / {currentProgram.durationDays}</p>
                    <Button onClick={() => handleContinueProgram(activeProgram)} variant="primary" className="mt-4 w-full">{t('continue_journey_button')}</Button>
                    <Button onClick={handleAbandonProgram} variant="ghost" size="small" className="mt-2 text-bad">{t('abandon_journey_button')}</Button>
                  </div>
                </Card>
              )}
              <div className="w-full mt-4">
                <h2 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: t('welcome_title') }} />
                <p className="text-muted mt-2 mb-8 text-lg">{t('welcome_subtitle')}</p>
                <div className="w-full h-px bg-white/10 my-8"></div>
                <div className="space-y-4 w-full max-w-xs mx-auto">
                  <Button onClick={() => navigateTo('checkin_rapide')} size="large" variant="primary" className="w-full">
                    {t('discover_ritual_button')}
                  </Button>
                  <Button onClick={() => navigateTo('programs')} variant="secondary" className="w-full !text-white !bg-[var(--color-accent-secondary)] !border-[var(--color-accent-secondary)] hover:!bg-opacity-80">
                    {t('discover_programs_button')}
                  </Button>
                  <Button onClick={handleRandomRitual} variant="secondary" className="w-full !text-white !bg-[var(--color-accent-tertiary)] !border-[var(--color-accent-tertiary)] hover:!bg-opacity-80 group">
                    {textPart} <span className="inline-block animate-roll-dice">{emojiPart}</span>
                  </Button>
                </div>
              </div>
            </div>
          );

        case 'checkin_rapide':
          return <CheckinPage {...{ energie, setEnergie, humeur, setHumeur, chargeMentale, setChargeMentale, onNavigate: navigateTo, onBack: resetAndGoHome, onHelp: setHelpInfo }} />;
        
        case 'checkin_general':
          return (
            <Card {...screenProps}>
               <Button variant='secondary' size='small' onClick={goBack}>← {t('previous')}</Button>
               <div className="text-center mt-2">
                <h2 className="text-2xl font-bold mb-2">{t('checkin_general_title')}</h2>
                <Breadcrumbs current="general" onNavigate={navigateTo} />
                <CheckinSlider label={t('label_tensionCorporelle_title')} value={tensionCorporelle} onChange={e => setTensionCorporelle(parseInt(e.target.value, 10))} labels={LABELS.tensionCorporelle.map(k => t(k))} helpId="tensionCorporelle" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_fatiguePhysique_title')} value={fatiguePhysique} onChange={e => setFatiguePhysique(parseInt(e.target.value, 10))} labels={LABELS.fatiguePhysique.map(k => t(k))} helpId="fatiguePhysique" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_agitation_title')} value={agitation} onChange={e => setAgitation(parseInt(e.target.value, 10))} labels={LABELS.agitation.map(k => t(k))} helpId="agitation" onHelp={setHelpInfo} />
                <div className="flex gap-4 justify-center mt-4">
                  <Button variant="primary" onClick={() => navigateTo('checkin_emotions')}>{t('continue')}</Button>
                  <Button variant="info" onClick={() => navigateTo('suggestions')}>{t('checkin_direct_suggestions')}</Button>
                </div>
              </div>
            </Card>
          );

        case 'checkin_emotions':
           return (
             <Card {...screenProps}>
               <Button variant='secondary' size='small' onClick={goBack}>← {t('previous')}</Button>
               <div className="text-center mt-2">
                <h2 className="text-2xl font-bold mb-2">{t('checkin_emotions_title')}</h2>
                <Breadcrumbs current="emotions" onNavigate={navigateTo} />
                <CheckinSlider label={t('label_joie_title')} value={joie} onChange={e => setJoie(parseInt(e.target.value, 10))} labels={LABELS.joie.map(k => t(k))} helpId="joie" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_tristesse_title')} value={tristesse} onChange={e => setTristesse(parseInt(e.target.value, 10))} labels={LABELS.tristesse.map(k => t(k))} helpId="tristesse" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_colere_title')} value={colere} onChange={e => setColere(parseInt(e.target.value, 10))} labels={LABELS.colere.map(k => t(k))} helpId="colere" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_peur_title')} value={peur} onChange={e => setPeur(parseInt(e.target.value, 10))} labels={LABELS.peur.map(k => t(k))} helpId="peur" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_sensibilite_title')} value={sensibilite} onChange={e => setSensibilite(parseInt(e.target.value, 10))} labels={LABELS.sensibilite.map(k => t(k))} helpId="sensibilite" onHelp={setHelpInfo} />
                <div className="flex gap-4 justify-center mt-4">
                  <Button variant="primary" onClick={() => navigateTo('checkin_pensees')}>{t('continue')}</Button>
                  <Button variant="info" onClick={() => navigateTo('suggestions')}>{t('checkin_direct_suggestions')}</Button>
                </div>
               </div>
             </Card>
           );

        case 'checkin_pensees':
           return (
             <Card {...screenProps}>
                <Button variant='secondary' size='small' onClick={goBack}>← {t('previous')}</Button>
                <div className="text-center mt-2">
                <h2 className="text-2xl font-bold mb-2">{t('checkin_thoughts_title')}</h2>
                <Breadcrumbs current="pensees" onNavigate={navigateTo} />
                <CheckinSlider label={t('label_clarteMentale_title')} value={clarteMentale} onChange={e => setClarteMentale(parseInt(e.target.value, 10))} labels={LABELS.clarteMentale.map(k => t(k))} helpId="clarteMentale" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_rumination_title')} value={rumination} onChange={e => setRumination(parseInt(e.target.value, 10))} labels={LABELS.rumination.map(k => t(k))} helpId="rumination" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_orientationTemporelle_title')} value={orientationTemporelle} onChange={e => setOrientationTemporelle(parseInt(e.target.value, 10))} labels={LABELS.orientationTemporelle.map(k => t(k))} helpId="orientationTemporelle" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_qualitePensees_title')} value={qualitePensees} onChange={e => setQualitePensees(parseInt(e.target.value, 10))} labels={LABELS.qualitePensees.map(k => t(k))} helpId="qualitePensees" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_vitesseMentale_title')} value={vitesseMentale} onChange={e => setVitesseMentale(parseInt(e.target.value, 10))} labels={LABELS.vitesseMentale.map(k => t(k))} helpId="vitesseMentale" onHelp={setHelpInfo} />
                <CheckinSlider label={t('label_sentimentControle_title')} value={sentimentControle} onChange={e => setSentimentControle(parseInt(e.target.value, 10))} labels={LABELS.sentimentControle.map(k => t(k))} helpId="sentimentControle" onHelp={setHelpInfo} />
                <Button variant="primary" onClick={() => navigateTo('suggestions')} size="large" className="w-full mt-6">{t('checkin_see_suggestions')}</Button>
                </div>
             </Card>
           );
        
        case 'suggestions':
          const suggestedRituals = getSuggestedRituals();
          return (
            <div {...screenProps}>
              <Button variant='secondary' size='small' onClick={goBack}>← {t('checkin_refine')}</Button>
              <div className="text-center mt-2">
                <h2 className="text-2xl font-bold mb-4">{t('suggestions_title')}</h2>
                <p className="text-muted text-lg mb-6 min-h-[4rem] flex items-center justify-center">
                  {isLoadingCheckinFeedback ? <span className="animate-pulse">{t('loading_analysis')}</span> : geminiCheckinFeedback}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestedRituals.map(ritual => (
                    <RitualCard key={ritual.id} ritual={ritual} onStart={handleStartRitual} onInfo={handleInfoRitual} isFavorite={favoriteRituals.has(ritual.id)} onToggleFavorite={toggleFavorite} isPremiumUser={isPremiumUser} />
                  ))}
                </div>
                <Button variant="ghost" onClick={resetAndGoHome} className="mt-8">{t('back_to_home')}</Button>
              </div>
            </div>
          );

        case 'all':
            const allRituals = RITUELS.filter(r => !r.id.endsWith('5m')).sort((a, b) => {
              if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
              }
              return t(a.label).localeCompare(t(b.label));
            });
            const curatedTags = ['apaiser', 'dynamiser', 'focus', 'sommeil', 'stress', 'anxiete', 'colere', 'rumination', 'respiration', 'somatique', 'mindset', 'lacher-prise', 'confiance', 'joie', 'détente'].sort();

            const filteredRituals = allRituals.filter(ritual => {
                const searchMatch = t(ritual.label).toLowerCase().includes(searchQuery.toLowerCase()) || t(ritual.modal.sections.pourquoi).toLowerCase().includes(searchQuery.toLowerCase());
                const favoriteMatch = !favoritesFilterActive || favoriteRituals.has(ritual.id);
                const tagMatch = !tagFilter || ritual.tags.includes(tagFilter);
                return searchMatch && favoriteMatch && tagMatch;
            });

            return (
                <div {...screenProps}>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">{t('all_rituals_title')}</h2>
                        <div className="flex gap-2 mb-4">
                            <input type="search" placeholder={t('search_placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-4 py-3 text-base rounded-lg bg-card border-2 border-white/30 focus:ring-2 focus:ring-accent focus:border-accent transition-colors placeholder:text-muted shadow-sm" />
                            <Button variant={favoritesFilterActive ? 'primary' : 'secondary'} onClick={() => setFavoritesFilterActive(!favoritesFilterActive)} className="!p-0 w-12 h-12 flex-shrink-0" aria-label={t('filter_favorites_label')}>
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            </Button>
                        </div>
                        <div className="mb-4">
                          <h3 className="font-bold text-accent mb-2">{t('filter_by_tag')}</h3>
                          <div className="flex flex-wrap gap-2 justify-center">
                            <Button size="small" variant={!tagFilter ? 'primary' : 'secondary'} onClick={() => setTagFilter(null)}>{t('all_tags')}</Button>
                            {curatedTags.map(tag => (
                              <Button key={tag} size="small" variant={tagFilter === tag ? 'primary' : 'secondary'} onClick={() => setTagFilter(tag)}>
                                {t(tag) || tag}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredRituals.map(ritual => (
                                <RitualCard key={ritual.id} ritual={ritual} onStart={handleStartRitual} onInfo={handleInfoRitual} isFavorite={favoriteRituals.has(ritual.id)} onToggleFavorite={toggleFavorite} isPremiumUser={isPremiumUser} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        
        case 'programs':
            return (
                <div {...screenProps}>
                    <Button variant='secondary' size='small' onClick={() => navigateTo('welcome')}>← {t('back_to_home')}</Button>
                    <div className="text-center mt-2">
                        <h2 className="text-2xl font-bold mb-4">{t('all_programs_title')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PROGRAMS.map(program => (
                                <ProgramCard key={program.id} program={program} onStart={handleStartProgram} onInfo={setProgramInfoModalId} isLocked={program.isPremium && !isPremiumUser} />
                            ))}
                        </div>
                    </div>
                </div>
            );
            
        case 'parcours':
          const unlockedBadgeIds = Object.keys(unlockedBadges) as BadgeId[];
          return (
            <div {...screenProps}>
              <Button variant='secondary' size='small' onClick={resetAndGoHome}>← {t('home')}</Button>
              <div className="text-center mt-2">
                <h2 className="text-2xl font-bold mb-4">{t('journey_title')}</h2>
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 p-3 bg-white/5 rounded-lg">
                        <p className="text-3xl font-bold">{streaks.current}</p>
                        <p className="text-sm text-muted">{t('journey_streak_current')}</p>
                    </div>
                    <div className="flex-1 p-3 bg-white/5 rounded-lg">
                        <p className="text-3xl font-bold">{streaks.longest}</p>
                        <p className="text-sm text-muted">{t('journey_streak_record')}</p>
                    </div>
                </div>
                
                <Button variant="primary" onClick={() => navigateTo('programs')} size="large" className="w-full mb-6">{t('journey_see_all_programs')}</Button>

                <h3 className="font-bold text-lg mb-4 text-left">{t('journey_unlocked_badges', { unlockedCount: unlockedBadgeIds.length, totalCount: Object.keys(BADGES).length })}</h3>
                {Object.entries(BADGE_CATEGORIES).map(([catKey, catValue]) => (
                    <div key={catKey} className="mb-4 text-left">
                        <h4 className="font-semibold text-accent mb-2">{t(catValue)}</h4>
                        <div className="flex flex-wrap gap-4">
                        {Object.entries(BADGES)
                          .filter(([, badge]) => badge.category === catKey)
                          .map(([badgeId, badge]) => {
                            const isUnlocked = unlockedBadges[badgeId as BadgeId];
                            return (
                                <div key={badgeId} onClick={() => isUnlocked && setBadgeModal(badgeId as BadgeId)} className={`flex flex-col items-center text-center w-20 ${isUnlocked ? 'cursor-pointer' : 'opacity-40'}`}>
                                    <div className="text-4xl p-2 rounded-full bg-white/5">{isUnlocked ? badge.icon : '❓'}</div>
                                    <p className="text-xs mt-1">{t(badge.name)}</p>
                                </div>
                            );
                        })}
                        </div>
                    </div>
                ))}
              </div>
            </div>
          );

        case 'journal':
            const sortedSessions = [...sessions].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            return (
                <div {...screenProps} className="pb-24">
                  <Button variant='secondary' size='small' onClick={resetAndGoHome}>← {t('home')}</Button>
                  <h2 className="text-2xl font-bold text-center mt-2 mb-6">{t('journal_title')}</h2>
                  {sortedSessions.length === 0 ? (
                    <p className="text-muted text-center">{t('journal_empty')}</p>
                  ) : (
                    <div className="space-y-4">
                      {sortedSessions.map(session => {
                        const ritual = RITUELS.find(r => r.id === session.ritualId);
                        if (!ritual) return null;
                        return (
                          <Card key={session.id}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold">{t(ritual.label)}</h3>
                                <p className="text-xs text-muted">{new Date(session.timestamp).toLocaleString('fr', { dateStyle: 'long', timeStyle: 'short' })}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button size="small" variant="ghost" onClick={() => handleEditSession(session)}>{t('journal_edit')}</Button>
                                <Button size="small" variant="ghost" className="text-bad" onClick={() => handleDeleteSession(session.id)}>{t('journal_delete')}</Button>
                              </div>
                            </div>
                            {session.journal ? (
                              <p className="text-sm mt-2 whitespace-pre-wrap">{session.journal}</p>
                            ) : (
                              <p className="text-sm mt-2 text-muted italic">{t('journal_no_notes')}</p>
                            )}
                            {session.iaFeedback && (
                                <div className="mt-3 pt-3 border-t border-white/20 text-sm text-accent-info flex gap-2">
                                    <span className="font-bold">{t('journal_ia_coach_feedback_label')}</span>
                                    <p className="italic">{session.iaFeedback}</p>
                                </div>
                            )}
                            {session.journal && !session.iaFeedback && isPremiumUser && (
                                <div className="mt-3">
                                    <Button size="small" variant="info" onClick={() => handleRequestJournalFeedback(session)} disabled={isLoadingJournalFeedbackForSession === session.id}>
                                        {isLoadingJournalFeedbackForSession === session.id ? t('journal_ia_coach_loading') : t('journal_ia_coach_button')}
                                    </Button>
                                </div>
                            )}
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </div>
            );

        case 'stats':
          return <StatsScreen sessions={sessions} onBack={goBack} />;
        
        case 'profile':
            const lastUnlockedBadgeEntry = Object.entries(unlockedBadges).sort(([, a], [, b]) => new Date(b as string).getTime() - new Date(a as string).getTime())[0];
            const lastBadge = lastUnlockedBadgeEntry ? BADGES[lastUnlockedBadgeEntry[0] as BadgeId] : null;
            const recentSessions = sessions.slice(-3).reverse();

            return (
                <div {...screenProps} className="space-y-6 pb-24">
                    <h2 className="text-2xl font-bold text-center">{t('profile_title')}</h2>
                    <Card>
                        <div className="grid grid-cols-3 gap-4 text-center">
                             <div>
                                <p className="text-3xl font-bold">{streaks.current}</p>
                                <p className="text-xs text-muted">{t('journey_streak_current')}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{streaks.longest}</p>
                                <p className="text-xs text-muted">{t('journey_streak_record')}</p>
                            </div>
                             <div>
                                <p className="text-3xl font-bold">{sessions.length}</p>
                                <p className="text-xs text-muted">{t('profile_rituals_completed')}</p>
                            </div>
                        </div>
                    </Card>

                    {lastBadge && (
                         <Card>
                            <h3 className="font-bold text-lg mb-2 text-left">{t('profile_last_badge')}</h3>
                            <div className="flex items-center gap-4 p-2 bg-white/5 rounded-lg">
                                <span className="text-4xl">{lastBadge.icon}</span>
                                <div className="flex-1 text-left">
                                    <p className="font-semibold">{t(lastBadge.name)}</p>
                                    <p className="text-xs text-muted">{t(lastBadge.description)}</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="small" className="w-full mt-3" onClick={() => navigateTo('parcours')}>{t('profile_see_all_badges')}</Button>
                         </Card>
                    )}

                    {recentSessions.length > 0 && (
                        <Card>
                           <h3 className="font-bold text-lg mb-2 text-left">{t('profile_last_rituals')}</h3>
                           <div className="space-y-2">
                               {recentSessions.map(session => {
                                   const ritual = RITUELS.find(r => r.id === session.ritualId);
                                   return (
                                       <div key={session.id} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                           <span className="text-2xl">{ritual?.modal.icon}</span>
                                           <div className="flex-1 text-left">
                                                <p className="font-semibold">{ritual ? t(ritual.label) : ''}</p>
                                                <p className="text-xs text-muted">{new Date(session.timestamp).toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                                           </div>
                                       </div>
                                   );
                               })}
                           </div>
                        </Card>
                    )}
                    
                    <Card>
                        <h3 className="font-bold text-lg mb-3 text-left">{t('profile_navigation')}</h3>
                        <div className="space-y-2">
                            {[
                                {labelKey: 'profile_nav_badges', screen: 'parcours', icon: '🏆'},
                                {labelKey: 'profile_nav_stats', screen: 'stats', icon: '📊'},
                                {labelKey: 'profile_nav_journal', screen: 'journal', icon: '📖'},
                            ].map(item => (
                                <button key={item.screen} onClick={() => navigateTo(item.screen)} className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-colors">
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="flex-1 font-semibold">{t(item.labelKey)}</span>
                                    <span className="text-muted">&gt;</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                </div>
            );

        case 'howitworks':
            return <HowItWorksPage onNavigate={navigateTo} />;
        
        case 'faq':
            return <FAQPage onNavigate={navigateTo} />;

        case 'settings':
            return <SettingsPage 
                onNavigate={navigateTo}
                theme={theme} setTheme={setTheme}
                themeLabels={themeLabels}
                textSize={textSize} setTextSize={setTextSize}
                soundSettings={soundSettings} setSoundSettings={setSoundSettings}
                playTestSound={playTestSound}
                isIOS={isIOS} isAndroid={isAndroid}
                setShowInstallModal={setShowInstallModal}
                isPremiumUser={isPremiumUser} setIsPremiumUser={setIsPremiumUser}
                clearAllData={clearAllData}
            />;
            
        case 'player':
          if (activeRitual) {
            const checkinData = { energie, humeur, chargeMentale, tensionCorporelle, fatiguePhysique, agitation, joie, tristesse, colere, peur, sensibilite, clarteMentale, rumination, orientationTemporelle, qualitePensees, vitesseMentale, sentimentControle };
            return <Player ritual={activeRitual} onComplete={handleCompleteRitual} onBack={goBack} sessions={sessions} onCheckForNewBadges={checkForNewBadges} soundSettings={soundSettings} checkinData={checkinData} onShowInfo={handleInfoRitual} />;
          }
          return null;

        default:
          return <Card><p>Écran non trouvé.</p><Button variant="primary" onClick={resetAndGoHome}>{t('home')}</Button></Card>;
      }
  };
  
  const dailySessionCount = sessions.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length;

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen text-fg font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24 relative">
        {currentScreen !== 'player' && !showOnboarding && (
            <header className="flex justify-between items-start mb-6">
                <div>
                  <button onClick={resetAndGoHome} className="text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg focus:ring-accent rounded">
                    <h1 className="text-2xl font-bold">MindPivot 🔥 <span title={t('tooltip_daily_rituals')}>{dailySessionCount}</span></h1>
                  </button>
                    <p className="text-sm text-muted">{t('header_subtitle')}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Button onClick={() => navigateTo('all')} size="small" className="btn-gradient-cta">{t('all_rituals_button')}</Button>
                    <div className="flex items-center">
                      <Button variant="ghost" size="small" className="!p-0 w-8 h-8" onClick={() => navigateTo('howitworks')} aria-label={t('settings_how_it_works')}>
                        <span className="font-bold text-xl leading-none">?</span>
                      </Button>
                      <Button variant="ghost" size="small" className="!p-0 w-8 h-8" onClick={() => navigateTo('settings')} aria-label={t('settings_title')}><SettingsIcon /></Button>
                      <Button variant="ghost" size="small" className="!p-0 w-8 h-8" onClick={handleShare} aria-label={t('settings_share_title')}><ShareIcon /></Button>
                    </div>
                </div>
            </header>
        )}
        {renderScreen()}
      </div>
      
      {currentScreen !== 'player' && !showOnboarding && (
        <footer className="fixed bottom-0 left-0 right-0 bg-card border-t border-white/10 flex justify-around">
            <FooterButton icon={<HomeIcon/>} label={t('nav_home')} onClick={() => navigateTo('welcome')} isActive={currentScreen === 'welcome'} />
            <FooterButton icon={<JourneyIcon/>} label={t('nav_journey')} onClick={() => navigateTo('parcours')} isActive={['parcours', 'programs'].includes(currentScreen)} hasNotification={hasUnseenBadge} />
            <FooterButton icon={<JournalIcon/>} label={t('nav_journal')} onClick={() => navigateTo('journal')} isActive={currentScreen === 'journal'} />
            <FooterButton icon={<StatsIcon/>} label={t('nav_stats')} onClick={() => navigateTo('stats')} isActive={currentScreen === 'stats'} />
            <FooterButton icon={<ProfileIcon/>} label={t('nav_profile')} onClick={() => navigateTo('profile')} isActive={currentScreen === 'profile'} />
        </footer>
      )}

      {infoRitualData && <Modal show={!!infoRitualData} title={`${infoRitualData.modal.icon} ${t(infoRitualData.modal.titre)} (${Math.floor(infoRitualData.dureeSec / 60)}:${('0' + (infoRitualData.dureeSec % 60)).slice(-2)} ${t('unit_min')})`} onClose={closeInfoModal}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div><h4 className="font-bold text-accent">{t('why')}</h4><p className="text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t(infoRitualData.modal.sections.pourquoi).replace(/\n/g, '<br />') }}></p></div>
            <div><h4 className="font-bold text-accent">{t('how')}</h4><p className="text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t(infoRitualData.modal.sections.comment).replace(/\n/g, '<br />') }}></p></div>
            <div><h4 className="font-bold text-accent">{t('tips')}</h4><p className="text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t(infoRitualData.modal.sections.conseils).replace(/\n/g, '<br />') }}></p></div>
            {infoRitualData.modal.sections.enSavoirPlus && (
              <div><h4 className="font-bold text-accent">{t('learn_more')}</h4><p className="text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t(infoRitualData.modal.sections.enSavoirPlus).replace(/\n/g, '<br />') }}></p></div>
            )}
            {infoRitualData.modal.sections.pourAllerPlusLoin && (
              <div><h4 className="font-bold text-accent">{t('go_further')}</h4><p className="text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t(infoRitualData.modal.sections.pourAllerPlusLoin).replace(/\n/g, '<br />') }}></p></div>
            )}
            <div className="pt-4 flex justify-end gap-2"><Button variant="primary" onClick={() => { closeInfoModal(); handleStartRitual(infoRitualData.id, 'all'); }}>{t('start')}</Button><Button variant="info" onClick={closeInfoModal}>{t('close')}</Button></div>
          </div>
      </Modal>}

      {programInfoData && <Modal show={!!programInfoData} title={`${programInfoData.icon} ${t(programInfoData.title)}`} onClose={() => setProgramInfoModalId(null)}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto text-left">
              {programInfoData.details && (
                  <>
                      <div><h4 className="font-bold text-accent">{t('program_info_objective')}</h4><p className="text-muted whitespace-pre-line">{t(programInfoData.details.objective)}</p></div>
                      <div><h4 className="font-bold text-accent">{t('program_info_mechanism')}</h4><p className="text-muted whitespace-pre-line">{t(programInfoData.details.mechanism)}</p></div>
                      <div><h4 className="font-bold text-accent">{t('program_info_benefits')}</h4><p className="text-muted whitespace-pre-line">{t(programInfoData.details.benefits)}</p></div>
                  </>
              )}
              <div>
                  <h4 className="font-bold text-accent mb-2">{t('program_info_rituals_list', { durationDays: programInfoData.durationDays })}</h4>
                  <ol className="list-decimal list-inside text-muted space-y-1">
                      {programInfoData.ritualIds.map((ritualId, index) => {
                          const ritual = RITUELS.find(r => r.id === ritualId);
                          return <li key={ritualId}><strong>{t('program_info_day', { day: index + 1 })}:</strong> {ritual ? t(ritual.label) : 'Rituel inconnu'} ({ritual ? `${Math.round(ritual.dureeSec / 60)} ${t('unit_min')}` : 'N/A'})</li>;
                      })}
                  </ol>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-2">
                  <Button variant="primary" onClick={() => { setProgramInfoModalId(null); handleStartProgram(programInfoData.id); }}>{t('program_info_start_button')}</Button>
                  <Button variant="info" onClick={() => setProgramInfoModalId(null)}>{t('close')}</Button>
              </div>
          </div>
      </Modal>}
      
      {badgeModal && BADGES[badgeModal] && <Modal show={!!badgeModal} title={`${BADGES[badgeModal].icon} ${t(BADGES[badgeModal].name)}`} onClose={() => setBadgeModal(null)}>
        <p className="text-muted">{t(BADGES[badgeModal].description)}</p>
        <p className="text-xs text-muted mt-2">{t('journey_badge_unlocked_on', { date: new Date(unlockedBadges[badgeModal]!).toLocaleDateString('fr') })}</p>
        <div className="pt-4 flex justify-end gap-2">
            <Button variant="info" onClick={() => handleShareBadge(BADGES[badgeModal])}>{t('journey_share_badge')}</Button>
            <Button variant="primary" onClick={() => setBadgeModal(null)}>{t('close')}</Button>
        </div>
      </Modal>}

      {helpInfo && HELP_CONTENT[helpInfo as keyof typeof HELP_CONTENT] && <Modal show={!!helpInfo} title={t(HELP_CONTENT[helpInfo as keyof typeof HELP_CONTENT].title)} onClose={() => setHelpInfo(null)}><p>{t(HELP_CONTENT[helpInfo as keyof typeof HELP_CONTENT].text)}</p></Modal>}

      <Modal show={showInstallModal} title={t('settings_install_title')} onClose={() => setShowInstallModal(false)}>
        {isIOS && <p dangerouslySetInnerHTML={{ __html: t('settings_install_ios')}} />}
        {isAndroid && <p dangerouslySetInnerHTML={{ __html: t('settings_install_android')}} />}
      </Modal>

      <Modal show={showShareModal} title={t('settings_share_title')} onClose={() => setShowShareModal(false)}>
        <p>{t('settings_share_text')}</p>
        <input type="text" readOnly value={window.location.href} className="w-full p-2 mt-2 rounded-lg bg-white/10 border border-white/20"/>
      </Modal>
      
      {editingSession && (
        <Modal show={!!editingSession} title={t('journal_edit_session_title', { date: new Date(editingSession.timestamp).toLocaleDateString() })} onClose={() => setEditingSession(null)}>
          <textarea value={editingText} onChange={e => setEditingText(e.target.value)} rows={5} className="w-full p-2 rounded-lg bg-white/10 border border-white/20 focus:ring-accent focus:border-accent" />
          <div className="flex justify-end gap-2 mt-4"><Button variant="primary" onClick={handleSaveEdit}>{t('journal_save')}</Button><Button variant="secondary" onClick={() => setEditingSession(null)}>{t('journal_cancel')}</Button></div>
        </Modal>
      )}

      <PremiumModal show={showPremiumModal} onClose={() => setShowPremiumModal(false)} onUpgrade={() => { setIsPremiumUser(true); setShowPremiumModal(false); }} />
      <audio ref={testAudioRef} preload="auto" />
    </div>
  );
}

export default App;