import { useState, useEffect, useRef, useCallback } from 'react';
import type { Ritual, Session, BadgeId, SoundSettings } from '../types.ts';
import { RITUELS, SOUND_OPTIONS, MORNING_INTENTIONS, LABELS, CITATIONS, BENTO_MANTRAS, ORGANES, RITUAL_INSTRUCTIONS } from '../constants.ts';
import { Button } from './Button.tsx';
import { Card } from './Card.tsx';
import { Modal } from './Modal.tsx';
import { RingDonut } from './RingDonut.tsx';
import { CongratsAndJournal } from './CongratsAndJournal.tsx';
import { EyeMovementAnimation } from './EyeMovementAnimation.tsx';
import { SagesseMinutePlayer } from './SagesseMinutePlayer.tsx';
import { useI18n } from '../hooks/useI18n.tsx';
import { generateGeminiText } from '../services/geminiService.ts';

interface PlayerProps {
  ritual: Ritual;
  onComplete: (ritualId: string, dureeSec: number, journalText: string, newlyUnlockedBadgeId: BadgeId | null) => void;
  onBack: () => void;
  sessions: Session[];
  onCheckForNewBadges: (potentialSessions: Session[]) => BadgeId | null;
  soundSettings: SoundSettings;
  checkinData: Record<string, number>;
}

const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const SoundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>;
const DiceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M16 8h.01"></path><path d="M12 12h.01"></path><path d="M8 16h.01"></path><path d="M8 8h.01"></path><path d="M16 16h.01"></path></svg>;
const SparkleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5 4 11l5.5 2.5L12 19l2.5-5.5L20 11l-5.5-2.5z"/></svg>;
const MusicOnIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.1.895 2 2 2s2-.9 2-2M9 19c0-1.1.895-2 2-2s2 .9 2 2m9-11l-6-1.5" /></svg>;
const MusicOffIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.1.895 2 2 2s2-.9 2-2M9 19c0-1.1.895-2 2-2s2 .9 2 2m9-11l-6-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
</svg>;


const protocolMap: Record<string, {n: string, s: number}[]> = {
    'on_5_5': [{n:'breathe_in',s:5},{n:'breathe_out',s:5}],
    'on_4_7_8': [{n:'breathe_in',s:4},{n:'hold_full',s:7},{n:'breathe_out',s:8}],
    'on_4_4_4_4': [{n:'breathe_in',s:4},{n:'hold_full',s:4},{n:'breathe_out',s:4},{n:'hold_empty',s:4}],
    'on_custom_soupir': [{n:'breathe_in',s:4},{n:'ritual_soupir_physio_120_protocol_step_2',s:1},{n:'ritual_soupir_physio_120_protocol_step_3',s:8},{n:'ritual_soupir_physio_120_protocol_step_4',s:2}],
};

interface OrganState {
  index: number;
  name: string;
  icon: string;
  videoUrl?: string;
}

export const Player = ({ ritual: initialRitual, onComplete, onBack, sessions, onCheckForNewBadges, soundSettings, checkinData }: PlayerProps) => {
  const { t } = useI18n();
  const [ritual, setRitual] = useState(initialRitual);
  const [timeLeft, setTimeLeft] = useState(ritual.dureeSec);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPreStart, setIsPreStart] = useState(true);
  const [preStartStepIndex, setPreStartStepIndex] = useState(0);
  const [newlyUnlockedBadgeId, setNewlyUnlockedBadgeId] = useState<BadgeId | null>(null);
  const [donutLabel, setDonutLabel] = useState(t('player_ready'));
  const [showDonut, setShowDonut] = useState(ritual.donut !== 'off');
  const [phaseTime, setPhaseTime] = useState({current: 0, total: 0});
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showMudraModal, setShowMudraModal] = useState(false);
  const [breathingDirection, setBreathingDirection] = useState<'apaisant' | 'dynamisant'>('apaisant');
  const [currentQuote, setCurrentQuote] = useState<{q: string; a: string} | null>(null);
  const [currentColor, setCurrentColor] = useState('#3498DB');
  const [colorVirtue, setColorVirtue] = useState('');
  const [currentOrgan, setCurrentOrgan] = useState<OrganState>({ index: -1, name: '', icon: '' });
  const [instruction, setInstruction] = useState('');
  const [dynamicInstruction, setDynamicInstruction] = useState('');
  const [audioError, setAudioError] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isBreathingGuidanceOn, setIsBreathingGuidanceOn] = useState(soundSettings.enabled);
  const [isCompletionSoundOn, setIsCompletionSoundOn] = useState(true);
  const [ritualPhaseIndex, setRitualPhaseIndex] = useState(0);
  const [sagesseAgreementIndex, setSagesseAgreementIndex] = useState(0);
  const [isAuroraTheme, setIsAuroraTheme] = useState(false);
  const [isVideoSoundOn, setIsVideoSoundOn] = useState(false);
  // Intention Matinale State
  const [showIntentionsModal, setShowIntentionsModal] = useState(false);
  const [customIntention, setCustomIntention] = useState<string | null>(null);
  const [isGeneratingIntention, setIsGeneratingIntention] = useState(false);

  // Bento specific state
  const [showBentoOptions, setShowBentoOptions] = useState(ritual.playerType === 'bento');
  const [bentoTheme, setBentoTheme] = useState('classique');
  const [bentoPhase, setBentoPhase] = useState<'short' | 'long'>('short');
  const [bentoReadyForPhase2, setBentoReadyForPhase2] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);
  const accumulatedPauseRef = useRef(0);
  const lastPhaseIndexRef = useRef(-1);
  const audioContextRef = useRef<AudioContext | null>(null);

  const generateNewQuote = useCallback(() => setCurrentQuote(CITATIONS[Math.floor(Math.random() * CITATIONS.length)]), []);

  useEffect(() => {
      setRitual(initialRitual);
      setTimeLeft(initialRitual.dureeSec);
      setInstruction(initialRitual.instructions || '');
      setDynamicInstruction(RITUAL_INSTRUCTIONS[initialRitual.id]?.[0]?.text || '');
      setShowDonut(initialRitual.donut && initialRitual.donut !== 'off');
      setIsRunning(false);
      setIsPaused(false);
      setIsComplete(false);
      setNewlyUnlockedBadgeId(null);
      setAudioProgress(0);
      setRitualPhaseIndex(0);
      setSagesseAgreementIndex(0);
      setIsBreathingGuidanceOn(soundSettings.enabled && (initialRitual.haptique?.onPhaseChange || initialRitual.category === 'respiration' || initialRitual.playerType === 'phased-ritual'));
      setIsCompletionSoundOn(soundSettings.enabled && initialRitual.playerType !== 'audio-guide');
      setShowBentoOptions(initialRitual.playerType === 'bento');
      setBentoPhase('short');
      setBentoReadyForPhase2(false);
      setIsPreStart(true);
      setPreStartStepIndex(0);
      setPhaseProgress(0);
      setCustomIntention(null);
      setIsGeneratingIntention(false);
      setIsVideoSoundOn(false);
  }, [initialRitual, soundSettings.enabled]);

  useEffect(() => {
    if (ritual.playerType === 'sagesse-minute') generateNewQuote();
    if (ritual.playerType === 'couleur' && ritual.data?.colors) {
      setColorVirtue(ritual.data.colors[currentColor.toUpperCase()] || '');
    }
  }, [ritual.playerType, ritual.data, currentColor, generateNewQuote]);
  
  useEffect(() => {
    setIsAuroraTheme(document.documentElement.classList.contains('theme-aurora'));
    const observer = new MutationObserver(() => {
      setIsAuroraTheme(document.documentElement.classList.contains('theme-aurora'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class']});
    return () => observer.disconnect();
  }, []);
  
  const playBip = (freq: number, type: OscillatorType = 'sine') => {
      if (!isBreathingGuidanceOn || !audioContextRef.current) return;
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') { ctx.resume(); }
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(soundSettings.volume * 0.5, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
  };
  
  const handleCompletion = useCallback(() => {
      const newSession: Session = { id: `sess_${Date.now()}`, ritualId: ritual.id, dureeSec: ritual.dureeSec, timestamp: new Date().toISOString() };
      const potentialSessions = [...sessions, newSession];
      const newBadgeId = onCheckForNewBadges(potentialSessions);
      if(newBadgeId) setNewlyUnlockedBadgeId(newBadgeId);
      setIsComplete(true);
  }, [ritual, sessions, onCheckForNewBadges]);

  const playEndSoundAndComplete = useCallback(async () => {
      if (isCompletionSoundOn && soundSettings.enabled && audioContextRef.current && SOUND_OPTIONS[soundSettings.selectedSound]) {
          const audioCtx = audioContextRef.current;
          if (audioCtx.state === 'suspended') await audioCtx.resume();
          try {
              const response = await fetch(SOUND_OPTIONS[soundSettings.selectedSound].url);
              const arrayBuffer = await response.arrayBuffer();
              const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
              const source = audioCtx.createBufferSource();
              source.buffer = audioBuffer;
              const gainNode = audioCtx.createGain();
              source.connect(gainNode);
              gainNode.connect(audioCtx.destination);
              gainNode.gain.setValueAtTime(soundSettings.volume, audioCtx.currentTime);
              source.onended = handleCompletion;
              source.start();
          } catch (e) {
              console.error("Error playing end sound with AudioContext:", e);
              handleCompletion();
          }
      } else {
          handleCompletion();
      }
  }, [handleCompletion, isCompletionSoundOn, soundSettings]);
  
  const stop = useCallback((completed = false) => {
      setIsRunning(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (wakeLockRef.current) { wakeLockRef.current.release().catch(() => {}); wakeLockRef.current = null; }
      if (completed) {
          playEndSoundAndComplete();
      } else {
          setTimeLeft(ritual.dureeSec);
          setDonutLabel(t('player_ready'));
          setRitualPhaseIndex(0);
          if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
          setAudioProgress(0);
          onBack(); // Go back if stopped manually
      }
  }, [ritual.dureeSec, playEndSoundAndComplete, onBack, t]);

    const tick = useCallback((timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsedMs = timestamp - startTimeRef.current - accumulatedPauseRef.current;
        let elapsedSec = elapsedMs / 1000;

        if (ritual.playerType === 'audio-guide' && audioRef.current) {
            elapsedSec = audioRef.current.currentTime;
            if (audioRef.current.duration) setAudioProgress(elapsedSec / audioRef.current.duration);
        }

        if (elapsedSec >= ritual.dureeSec) {
            setTimeLeft(0); stop(true); return;
        }

        setTimeLeft(ritual.dureeSec - Math.floor(elapsedSec));
        
        let currentPhaseProgress = 0;
        let sessionProgressRatio = 0;
        if (ritual.dureeSec > 0) {
          sessionProgressRatio = Math.min(1, elapsedSec / ritual.dureeSec);
        }

        if (ritual.id === 'rit.coherence_bento' && elapsedSec >= 60 && bentoPhase === 'short' && !bentoReadyForPhase2) {
          setBentoReadyForPhase2(true);
        }

        // Breathing Logic
        const currentPhaseData = ritual.playerType === 'phased-ritual' ? ritual.data.phases[ritualPhaseIndex] : null;
        const isBreathingPhase = (ritual.playerType === 'respiration' || ritual.playerType === 'bento' || (currentPhaseData && currentPhaseData.type === 'respiration'));

        if (showDonut && isBreathingPhase && isRunning) {
            let timeForBreathingCalc = elapsedSec;
            if (currentPhaseData && currentPhaseData.type === 'respiration') {
                const breathingPhaseStartTime = ritual.data.phases.slice(0, ritualPhaseIndex).reduce((acc: number, p: any) => acc + p.duration, 0);
                timeForBreathingCalc = elapsedSec - breathingPhaseStartTime;
            }

            let protocol: {n: string, s: number}[] | undefined;

            if (ritual.playerType === 'bento') {
                const duration = bentoPhase === 'short' ? 3 : 5;
                protocol = [{n:'breathe_in', s:duration}, {n:'breathe_out', s:duration}];
            } else if (ritual.id === 'rit.nadi_shodhana_120') {
                protocol = ritual.data.protocols[breathingDirection].protocolSteps;
            } else if (currentPhaseData?.protocol) {
                protocol = currentPhaseData.protocol;
            } else if (ritual.data?.protocolSteps) {
                protocol = ritual.data.protocolSteps;
            } else {
                protocol = protocolMap[ritual.donut as keyof typeof protocolMap];
            }

            if (protocol) {
                const totalCycleTime = protocol.reduce((sum, step) => sum + step.s, 0);
                if (totalCycleTime > 0) {
                    const timeInCycle = timeForBreathingCalc % totalCycleTime;
                    let cumulativeTime = 0;
                    let currentPhaseIndex = -1;
                    for (let i = 0; i < protocol.length; i++) {
                        cumulativeTime += protocol[i].s;
                        if (timeInCycle < cumulativeTime) {
                            currentPhaseIndex = i;
                            break;
                        }
                    }
                    if (currentPhaseIndex === -1) currentPhaseIndex = 0; // Fallback
                    
                    if(currentPhaseIndex !== -1) {
                        const currentPhase = protocol[currentPhaseIndex];
                        const phaseStartTime = protocol.slice(0, currentPhaseIndex).reduce((sum, p) => sum + p.s, 0);
                        const timeInPhase = timeInCycle - phaseStartTime;
                        const progressInPhaseRaw = Math.min(1, Math.max(0, timeInPhase / currentPhase.s));
                        
                        const phaseName = t(currentPhase.n).toLowerCase();

                        if (phaseName.startsWith('expire') || phaseName.startsWith('exhale')) {
                            currentPhaseProgress = 1 - progressInPhaseRaw;
                        } else if (phaseName.includes('pleins') || phaseName.includes('full') || phaseName.includes('bloque')) {
                            currentPhaseProgress = 1;
                        } else if (phaseName.includes('vides') || phaseName.includes('empty') || phaseName.includes('pause')) {
                            currentPhaseProgress = 0;
                        } else { // 'inspire', 'inhale', etc.
                            currentPhaseProgress = progressInPhaseRaw;
                        }
                        
                        let newLabel = t(currentPhase.n);
                        if (ritual.playerType === 'bento') {
                            const currentMantraSet = BENTO_MANTRAS[bentoTheme as keyof typeof BENTO_MANTRAS] || BENTO_MANTRAS.classique;
                            const mantraKey = currentPhase.n.startsWith('breathe_in') 
                                ? currentMantraSet[bentoPhase].inhale 
                                : currentMantraSet[bentoPhase].exhale;
                            newLabel = `<div class="text-sm font-light text-muted mb-1">${t('player_bento_repeat_mentally')}</div><div class="font-bold text-xl leading-tight">${t(mantraKey)}</div>`;
                        }
                        setDonutLabel(newLabel);
                        
                        if (currentPhaseIndex !== lastPhaseIndexRef.current) { 
                            const bipPhaseName = t(currentPhase.n).toLowerCase();
                            if (bipPhaseName.startsWith('inspire') || bipPhaseName.startsWith('inhale')) {
                              playBip(432, 'sine');
                            } else if (bipPhaseName.startsWith('expire') || bipPhaseName.startsWith('exhale')) {
                              playBip(288, 'sine');
                            } else if (bipPhaseName.includes('retiens') || bipPhaseName.includes('hold') || bipPhaseName.includes('bloque')) {
                              playBip(350, 'triangle');
                            }
                            lastPhaseIndexRef.current = currentPhaseIndex; 
                        }
                    }
                }
            }
        }

        // Text-guided rituals
        if (RITUAL_INSTRUCTIONS[ritual.id]) {
            const instructions = RITUAL_INSTRUCTIONS[ritual.id];
            const currentInstruction = instructions.slice().reverse().find(i => elapsedSec >= i.time);
            if (currentInstruction && dynamicInstruction !== currentInstruction.text) {
                setDynamicInstruction(currentInstruction.text);
            }
            const reversedInstructions = [...instructions].reverse();
            const currentInstructionIndexInReversed = reversedInstructions.findIndex(i => elapsedSec >= i.time);
            if (currentInstructionIndexInReversed !== -1) {
                const actualIndex = instructions.length - 1 - currentInstructionIndexInReversed;
                const phaseStartTime = instructions[actualIndex].time;
                const phaseEndTime = instructions[actualIndex + 1] ? instructions[actualIndex + 1].time : ritual.dureeSec;
                const phaseDuration = phaseEndTime - phaseStartTime;
                if (phaseDuration > 0) {
                    const timeInPhase = elapsedSec - phaseStartTime;
                    currentPhaseProgress = Math.min(1, timeInPhase / phaseDuration);
                }
            }
        }
        // Slideshow logic
        if (ritual.playerType === 'slideshow') {
            let cumulativeDuration = 0;
            let newIndex = 0;
            for(let i=0; i < ritual.data.images.length; i++) {
                cumulativeDuration += ritual.data.images[i].duration;
                if (elapsedSec < cumulativeDuration) {
                    newIndex = i;
                    break;
                }
            }
            if (slideshowIndex !== newIndex) setSlideshowIndex(newIndex);
            
            let phaseStartTime = 0;
            for (let i = 0; i < newIndex; i++) { phaseStartTime += ritual.data.images[i].duration; }
            const timeInPhase = elapsedSec - phaseStartTime;
            const phaseDuration = ritual.data.images[newIndex].duration;
            if (phaseDuration > 0) currentPhaseProgress = Math.min(1, timeInPhase / phaseDuration);
        }
        // Organ smile logic
        if (ritual.playerType === 'organe-smile') {
            const organDuration = ritual.dureeSec / ORGANES.length;
            const newIndex = Math.floor(elapsedSec / organDuration);
            if(newIndex < ORGANES.length && currentOrgan.index !== newIndex) {
                setCurrentOrgan({ index: newIndex, ...(ORGANES[newIndex] as any) });
            }
            if(organDuration > 0) currentPhaseProgress = (elapsedSec % organDuration) / organDuration;
        }
        // Sagesse minute logic
        if (ritual.playerType === 'sagesse-minute') {
            const phaseDuration = ritual.dureeSec / 4;
            const newIndex = Math.floor(elapsedSec / phaseDuration);
            if (newIndex !== sagesseAgreementIndex) setSagesseAgreementIndex(newIndex);
            if(phaseDuration > 0) currentPhaseProgress = (elapsedSec % phaseDuration) / phaseDuration;
        }
        // Phased ritual logic
        if (ritual.playerType === 'phased-ritual') {
            let cumulativeDuration = 0;
            let newPhaseIndex = -1;
            for(let i=0; i < ritual.data.phases.length; i++) {
                if (elapsedSec < cumulativeDuration + ritual.data.phases[i].duration) {
                    newPhaseIndex = i;
                    break;
                }
                cumulativeDuration += ritual.data.phases[i].duration;
            }
             if (newPhaseIndex === -1) newPhaseIndex = ritual.data.phases.length -1;

            if (ritualPhaseIndex !== newPhaseIndex) {
                playBip(440, 'triangle');
                setRitualPhaseIndex(newPhaseIndex);
            }
            const phaseStart = cumulativeDuration;
            const phaseDuration = ritual.data.phases[newPhaseIndex].duration;
            const timeInPhase = elapsedSec - phaseStart;
            setPhaseTime({ current: timeInPhase, total: phaseDuration });
            if(phaseDuration > 0) currentPhaseProgress = Math.min(1, timeInPhase / phaseDuration);
        }

        setPhaseProgress(currentPhaseProgress);
        animationFrameRef.current = requestAnimationFrame(tick);
    }, [ritual, stop, isRunning, isBreathingGuidanceOn, breathingDirection, ritualPhaseIndex, bentoPhase, bentoTheme, dynamicInstruction, slideshowIndex, currentOrgan.index, showDonut, sagesseAgreementIndex, bentoReadyForPhase2, t]);

  useEffect(() => {
      if (isRunning && !isPaused) {
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = requestAnimationFrame(tick);
      }
       return () => {
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
  }, [isRunning, isPaused, tick]);
  
  const start = async () => {
    if (isPreStart) setIsPreStart(false);
    if (showBentoOptions) setShowBentoOptions(false);

    // --- Critical Section for User Gesture ---
    if ('wakeLock' in navigator) {
        try {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
            console.error(`Wake Lock failed: ${err}`);
        }
    }
    
    if (!audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("AudioContext not supported", e);
        }
    }
    if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
    }
    // --- End Critical Section ---

    startTimeRef.current = performance.now();
    accumulatedPauseRef.current = 0;
    
    if (ritual.playerType === 'audio-guide' && audioRef.current) {
        audioRef.current.play().catch(e => {
            console.error("Audio play failed", e);
            setAudioError(true);
        });
    }

    setIsRunning(true);
    setIsPaused(false);
  };
  
  const restartRitual = () => {
      setIsRunning(false);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (wakeLockRef.current) { wakeLockRef.current.release().catch(() => {}); wakeLockRef.current = null; }
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
  
      setIsComplete(false);
      setIsPreStart(true);
      setTimeLeft(ritual.dureeSec);
      setRitualPhaseIndex(0);
      setSagesseAgreementIndex(0);
      setSlideshowIndex(0);
      setCurrentOrgan({ index: -1, name: '', icon: '' });
      setDonutLabel(t('player_ready'));
      setAudioProgress(0);
      setPhaseProgress(0);
      setCustomIntention(null);
      if (ritual.playerType === 'sagesse-minute') generateNewQuote();
  };

  const pause = () => {
    if (!isRunning || isPaused) return;
    setIsPaused(true);
    pauseTimeRef.current = performance.now();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (ritual.playerType === 'audio-guide' && audioRef.current) audioRef.current.pause();
  };
  const resume = () => {
    if (!isRunning || !isPaused) return;
    accumulatedPauseRef.current += performance.now() - pauseTimeRef.current;
    setIsPaused(false);
    if (ritual.playerType === 'audio-guide' && audioRef.current) audioRef.current.play();
  };

  const handleBentoPhaseChange = () => {
    setBentoPhase('long');
    setBentoReadyForPhase2(false);
  };

  const handleRandomIntention = () => {
    const randomIndex = Math.floor(Math.random() * MORNING_INTENTIONS.length);
    setCustomIntention(MORNING_INTENTIONS[randomIndex]);
  };

  const handleAIGeneratedIntention = async () => {
      setIsGeneratingIntention(true);
      setCustomIntention(null);

      try {
        const summary = Object.entries(checkinData)
            .filter(([, value]) => value !== 0)
            .map(([key, value]) => `${t(`label_${key}_title`)}: ${t(LABELS[key as keyof typeof LABELS][(value as number)+2])}`)
            .join(', ');

        const prompt = `Basé sur ce bilan matinal d'un utilisateur : "${summary || 'Aucun bilan fourni, se baser sur une intention générale positive'}", propose une seule intention de journée, laïque, subtile et introspective (15 mots max). L'intention doit être une phrase affirmative à la première personne (Je...). Ne retourne que l'intention, sans aucune introduction.`;
        
        const intention = await generateGeminiText(prompt);
        setCustomIntention(intention.trim());

      } catch (error) {
        console.error("Gemini intention generation error:", error);
        setCustomIntention("Désolé, une erreur est survenue. Veuillez réessayer.");
      } finally {
        setIsGeneratingIntention(false);
      }
  };
  
  const renderPreStartContent = () => {
    if (ritual.preStartSteps && preStartStepIndex < ritual.preStartSteps.length) {
        const step = ritual.preStartSteps[preStartStepIndex];
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="relative z-10 text-center animate-fade-in-short font-display">
                    <div className="mb-6 text-lg" dangerouslySetInnerHTML={{ __html: t(step.text).replace(/\n/g, '<br />') }} />
                </div>
            </div>
        );
    }
    if (ritual.playerType === 'bento' && showBentoOptions) return renderBentoOptions();
    if (ritual.id === 'rit.nadi_shodhana_120' && !isRunning) return renderNadiShodhanaOptions();
    if (ritual.playerType === 'couleur') return renderCouleurOptions();
    if (ritual.playerType === 'intention') return renderIntentionOptions();

    const instructionHTML = ritual.immersiveInstructions ? t(ritual.immersiveInstructions) : t(ritual.modal.sections.conseils);

    if (instructionHTML) {
        return (
           <div className="w-full h-full flex items-center justify-center p-4">
               <div className="relative text-center z-10 animate-fade-in-short font-display">
                   <div className="font-semibold whitespace-pre-line text-lg" dangerouslySetInnerHTML={{ __html: instructionHTML.replace(/\n\n/g, '<br /><br />').replace(/\n/g, '<br />') }} />
               </div>
           </div>
       );
    }
    
    const fallbackInstruction = ritual.instructions ? t(ritual.instructions) : RITUAL_INSTRUCTIONS[ritual.id] ? t(RITUAL_INSTRUCTIONS[ritual.id]?.[0]?.text) : '';
    if (fallbackInstruction) {
        return <p className="text-lg text-muted whitespace-pre-line animate-fade-in font-display" dangerouslySetInnerHTML={{ __html: fallbackInstruction.replace(/\n/g, '<br />') }}></p>;
    }
    return null;
};

  const renderActiveContent = () => {
    if (ritual.id === 'rit.nadi_shodhana_120') {
      const defaultInfo = { url: 'https://www.magnetiseur-dax.fr/webapp/Aura/nasagra-mudra.jpg', caption: 'player_ready' };
      const donutPhaseKey = Object.keys(ritual.data.protocols[breathingDirection].imagesByPhase).find(key => t(key) === donutLabel);
      const phaseInfo = donutPhaseKey ? ritual.data.protocols[breathingDirection].imagesByPhase[donutPhaseKey] : null;
      const currentInfo = (isRunning && phaseInfo) ? phaseInfo : defaultInfo;

      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <img src={currentInfo.url} referrerPolicy="no-referrer" alt={t(currentInfo.caption)} className="max-w-full object-contain rounded-lg flex-1 min-h-0" />
          <p key={currentInfo.caption} className="text-xl font-bold text-fg mt-4 animate-fade-in-short">{t(currentInfo.caption)}</p>
        </div>
      );
    }

    if (showDonut) return <RingDonut label={donutLabel} ratio={phaseProgress} sessionProgressRatio={1 - (timeLeft / ritual.dureeSec)} />;
    
    if (ritual.playerType === 'phased-ritual' && ritual.data.phases[ritualPhaseIndex]) {
        const phase = ritual.data.phases[ritualPhaseIndex];
        if (phase.type === 'texte') {
          const isTextOnlyRitual = ritual.data.phases.every((p: any) => p.type === 'texte');
          const textClasses = isTextOnlyRitual 
              ? "text-3xl lg:text-4xl font-semibold leading-relaxed" 
              : "text-lg";
      
          return <div className={`${textClasses} whitespace-pre-line animate-fade-in p-4`} dangerouslySetInnerHTML={{__html: t(phase.instruction).replace(/\n/g, '<br /><br />')}}></div>;
        }
        if (phase.type === 'image') {
          return (
            <div className="flex-1 w-full min-h-0 flex items-center justify-center animate-fade-in">
                <img src={phase.imageUrl} alt={t('visual_instruction_alt')} referrerPolicy="no-referrer" className={`max-h-full max-w-full rounded-lg mx-auto ${phase.backgroundFill ? 'object-cover w-full h-full' : 'object-contain'}`} />
            </div>
          );
        }
        if (phase.type === 'video') {
            return (
              <div className="flex-1 w-full min-h-0 flex items-center justify-center animate-fade-in">
                  <video 
                      src={phase.videoUrl} 
                      autoPlay 
                      loop 
                      muted={!isVideoSoundOn} 
                      playsInline 
                      className="max-h-full max-w-full rounded-lg mx-auto object-contain"
                  />
              </div>
            );
          }
        if (phase.type === 'animation') {
          return (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 animate-fade-in">
              <div className="flex-1 w-full min-h-0 flex items-center justify-center">
                  <EyeMovementAnimation slow={ritual.id === 'rit.recyclage_eclair'} />
              </div>
            </div>
          );
        }
        if (phase.type === 'fixation') return <div className="w-12 h-12 rounded-full bg-black animate-pulse"></div>;
        if (phase.type === 'respiration') return <RingDonut label={donutLabel} ratio={phaseProgress} sessionProgressRatio={(phaseTime.current / phaseTime.total)} />;
    }
    if (ritual.playerType === 'texte-guide' && dynamicInstruction) return <div className="text-2xl font-bold whitespace-pre-line text-center" dangerouslySetInnerHTML={{ __html: t(dynamicInstruction).replace(/\n/g, '<br />') }}></div>;
    if (ritual.playerType === 'fixation') return <div className="w-12 h-12 rounded-full bg-black animate-pulse"></div>;
    if (ritual.playerType === 'intention' && customIntention) return <p className="text-2xl font-bold text-center italic">"{customIntention}"</p>;
    if (ritual.playerType === 'slideshow' && ritual.data?.images) {
        const currentImage = ritual.data.images[slideshowIndex];
        return (
            <div key={slideshowIndex} className="w-full h-full flex flex-col items-center justify-end animate-fade-in">
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000"
                    style={{ backgroundImage: `url(${currentImage.url})` }}
                />
                <div className="absolute inset-0 w-full h-full bg-black/40"></div>
                <div className="relative z-10 p-8 text-center text-white">
                    <p className="text-xl font-bold [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">{t(currentImage.caption)}</p>
                </div>
            </div>
        );
    }
    if (ritual.playerType === 'audio-guide') return <div className="flex flex-col items-center justify-center gap-4"><span className="text-5xl">🎧</span><p className="text-lg text-muted">{t('player_audio_guide_listen')}</p></div>;
    if (ritual.playerType === 'sagesse-minute' && currentQuote) {
        return <SagesseMinutePlayer quote={currentQuote} phaseIndex={sagesseAgreementIndex} />
    }
    if (ritual.playerType === 'organe-smile' && currentOrgan.videoUrl) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
              <div className="flex-1 w-full min-h-0 flex items-center justify-center rounded-lg overflow-hidden">
                <video 
                    key={currentOrgan.videoUrl}
                    src={currentOrgan.videoUrl} 
                    autoPlay 
                    loop 
                    muted={!isVideoSoundOn}
                    playsInline 
                    className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 p-3 text-center text-xl font-semibold animate-fade-in">
                  <p>{t('player_organe_smile_instruction', { organName: t(currentOrgan.name) })}</p>
              </div>
          </div>
      );
    }
    if (ritual.playerType === 'couleur') return <div className="w-full h-full rounded-lg animate-fade-in" style={{ backgroundColor: currentColor, boxShadow: `0 0 30px 10px ${currentColor}55` }}></div>
    
    const fallbackInstruction = t(instruction) || (RITUAL_INSTRUCTIONS[ritual.id]?.[0]?.text ? t(RITUAL_INSTRUCTIONS[ritual.id]?.[0]?.text) : '');
    if(fallbackInstruction) {
        return <p className="text-lg text-muted" dangerouslySetInnerHTML={{ __html: fallbackInstruction.replace(/\n/g, '<br />') }}></p>;
    }
    return <p className="text-lg text-muted">{t('follow_instructions')}</p>
  }
  
  const renderBentoOptions = () => (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
        <h3 className="text-lg font-bold">{t('player_bento_personalize')}</h3>
        <p className="text-sm text-muted">{t('player_bento_mantra_theme')}</p>
        <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(BENTO_MANTRAS).map(([key, value]) => (
                <Button key={key} variant={bentoTheme === key ? 'primary' : 'secondary'} onClick={() => setBentoTheme(key)}>
                    {t(value.name)}
                </Button>
            ))}
        </div>
    </div>
  );

  const renderNadiShodhanaOptions = () => (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
        <h3 className="text-lg font-bold">{t('player_nadi_choose_goal')}</h3>
        <div className="flex gap-4">
            <Button variant={breathingDirection === 'apaisant' ? 'primary' : 'secondary'} onClick={() => setBreathingDirection('apaisant')}>{t('player_nadi_apaisant')}</Button>
            <Button variant={breathingDirection === 'dynamisant' ? 'primary' : 'secondary'} onClick={() => setBreathingDirection('dynamisant')}>{t('player_nadi_dynamisant')}</Button>
        </div>
        <p className="text-sm text-muted max-w-xs">{breathingDirection === 'apaisant' ? t('player_nadi_apaisant_desc') : t('player_nadi_dynamisant_desc')}</p>
        <Button variant="ghost" onClick={() => setShowMudraModal(true)}>{t('player_nadi_finger_position')}</Button>
    </div>
  );

  const renderCouleurOptions = () => (
    <div className="flex flex-col items-center justify-center gap-4 animate-fade-in">
        <h3 className="text-lg font-bold">{t('player_couleur_choose_color')}</h3>
        <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(ritual.data.colors).map(([color, virtue]) => (
          <button key={color} onClick={() => setCurrentColor(color)} className="w-12 h-12 rounded-full transition-transform hover:scale-110" style={{ backgroundColor: color, border: currentColor === color ? '4px solid white' : '4px solid transparent' }} aria-label={t(virtue as string)}></button>
        ))}
        </div>
        <p className="font-bold text-lg" style={{ color: currentColor }}>{t(colorVirtue)}</p>
    </div>
  );

  const renderIntentionOptions = () => (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-in text-center">
        <div className="min-h-[6em] flex items-center justify-center">
            {isGeneratingIntention ? (
                <p className="text-muted animate-pulse">{t('loading_analysis')}</p>
            ) : (
                <p className="text-xl font-semibold italic">
                    {customIntention ? `"${customIntention}"` : t(ritual.instructions || '')}
                </p>
            )}
        </div>
        <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex flex-col items-center gap-2">
                <Button onClick={() => setShowIntentionsModal(true)} variant="secondary" className="!p-0 w-14 h-14 flex items-center justify-center rounded-full"><ListIcon /></Button>
                <span className="text-xs text-muted">Exemples</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Button onClick={handleRandomIntention} variant="secondary" className="!p-0 w-14 h-14 flex items-center justify-center rounded-full"><DiceIcon /></Button>
                <span className="text-xs text-muted">1 au hasard</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Button onClick={handleAIGeneratedIntention} disabled={isGeneratingIntention} variant="secondary" className="!p-0 w-14 h-14 flex items-center justify-center rounded-full"><SparkleIcon /></Button>
                <span className="text-xs text-muted">La plus adaptée !</span>
            </div>
        </div>
    </div>
);
  
  if (isComplete) { return <CongratsAndJournal ritual={ritual} onDone={(journalText) => onComplete(ritual.id, ritual.dureeSec, journalText, newlyUnlockedBadgeId)} onRestart={restartRitual} newlyUnlockedBadgeId={newlyUnlockedBadgeId} /> }

  const handlePreStartNext = () => {
      if (ritual.preStartSteps && preStartStepIndex < ritual.preStartSteps.length - 1) {
          setPreStartStepIndex(prev => prev + 1);
      } else {
          start();
      }
  };
  
  if (isPreStart && ritual.preStartSteps) {
      return (
          <Modal 
              show={true}
              title={`${ritual.modal.icon} ${t(ritual.label)} - ${t('preparation')}`}
              onClose={onBack}
              hideHeaderCloseButton={false}
              preStartNext={handlePreStartNext}
          >
              <div
                  className="w-full h-64 bg-cover bg-center rounded-lg mb-4"
                  style={{ backgroundImage: `url(${ritual.preStartSteps[preStartStepIndex].backgroundUrl})` }}
              />
              <div className="text-center">
                {renderPreStartContent()}
              </div>
          </Modal>
      );
  }

  const hasVideo = ritual.playerType === 'organe-smile' || 
                   (ritual.data?.phases && ritual.data.phases.some((p: any) => p.type === 'video'));

  let secondaryInstruction: string | null = null;
  if (isRunning && !isPaused && ritual.playerType === 'phased-ritual' && ritual.data.phases[ritualPhaseIndex]) {
    const phase = ritual.data.phases[ritualPhaseIndex];
    if ((phase.type === 'image' || phase.type === 'video' || phase.type === 'animation') && phase.instruction) {
      secondaryInstruction = t(phase.instruction);
    }
  }

  return (
    <div className="w-full h-[calc(100vh-2rem)] flex flex-col items-center text-center animate-fade-in">
        <header className="w-full p-4 pt-6">
            <h2 className="text-2xl font-bold">{t(ritual.label)}</h2>
            <p className="text-muted">
            {Math.floor(ritual.dureeSec / 60)} {t('unit_min')} {ritual.dureeSec % 60 > 0 ? `${ritual.dureeSec % 60}s` : ''}
            </p>
        </header>

        <main className="w-full flex-1 flex flex-col items-center justify-center p-4 min-h-0">
          {isPreStart ? renderPreStartContent() : renderActiveContent()}
        </main>
        
        <div className="w-full max-w-lg px-4 pb-4 space-y-3">
            <div className="min-h-[4rem] flex items-center justify-center">
                {secondaryInstruction && (
                    <div className="p-3 bg-card/80 backdrop-blur-sm rounded-lg text-center w-full animate-fade-in">
                    <p className="font-semibold text-fg" dangerouslySetInnerHTML={{ __html: secondaryInstruction.replace(/\n/g, '<br />') }}></p>
                    </div>
                )}
            </div>

            <div className="w-full max-w-sm px-4 mx-auto h-2">
                {isRunning && !isPaused && (
                    <>
                    {(ritual.options?.perPhaseProgress || ritual.playerType === 'phased-ritual' || ritual.playerType === 'slideshow' || ritual.playerType === 'organe-smile' || ritual.playerType === 'sagesse-minute' || (RITUAL_INSTRUCTIONS[ritual.id])) && !showDonut && (
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${phaseProgress * 100}%` }}></div>
                        </div>
                    )}
                    {ritual.playerType === 'audio-guide' && (
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${audioProgress * 100}%` }}></div>
                        </div>
                    )}
                    </>
                )}
            </div>
            
            <div className="text-sm text-muted">
                {t('player_remaining_time')}: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
            </div>

            <footer className="w-full flex justify-between items-center gap-4 pt-2">
                <div className="flex-1 flex justify-start">
                    <Button variant="ghost" size="small" onClick={() => stop(false)}>{t('player_stop')}</Button>
                </div>
                
                <div className="flex-shrink-0">
                    {!isRunning && <Button variant="primary" size="large" onClick={start} className="w-48">{t('start')}</Button>}
                    {isRunning && !isPaused && <Button variant="secondary" size="large" onClick={pause} className="w-48">{t('player_pause')}</Button>}
                    {isRunning && isPaused && <Button variant="primary" size="large" onClick={resume} className="w-48">{t('player_resume')}</Button>}
                </div>
                
                <div className="flex-1 flex justify-end">
                    {hasVideo && isRunning ? (
                        <button 
                            onClick={() => setIsVideoSoundOn(p => !p)} 
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-white/10 transition-colors" 
                            title={t('player_video_music')}
                            aria-label={t('player_toggle_music')}
                        >
                            {isVideoSoundOn ? <MusicOnIcon /> : <MusicOffIcon />}
                        </button>
                    ) : <div className="w-10 h-10"></div>}
                </div>
            </footer>

            {bentoReadyForPhase2 && (
                <div className="absolute bottom-24 z-20 animate-fade-in">
                    <Button variant="info" onClick={handleBentoPhaseChange}>{t('player_bento_extend_breath')}</Button>
                </div>
            )}
        </div>
        
        <Modal show={showInfo} title={`${ritual.modal.icon} ${t(ritual.modal.titre)}`} onClose={() => setShowInfo(false)}>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div><h4 className="font-bold text-accent">{t('why')}</h4><p className="text-muted" dangerouslySetInnerHTML={{ __html: t(ritual.modal.sections.pourquoi).replace(/\n/g, '<br />') }}></p></div>
            <div><h4 className="font-bold text-accent">{t('how')}</h4><p className="text-muted" dangerouslySetInnerHTML={{ __html: t(ritual.modal.sections.comment).replace(/\n/g, '<br />') }}></p></div>
            {ritual.modal.sections.enSavoirPlus && <div><h4 className="font-bold text-accent">{t('learn_more')}</h4><p className="text-muted" dangerouslySetInnerHTML={{ __html: t(ritual.modal.sections.enSavoirPlus).replace(/\n/g, '<br />') }}></p></div>}
          </div>
        </Modal>

        <Modal show={showMudraModal} title={t('player_nadi_finger_position_title')} onClose={() => setShowMudraModal(false)}>
            <img src="https://www.magnetiseur-dax.fr/webapp/Aura/nasagra-mudra.jpg" referrerPolicy="no-referrer" alt={t('player_nadi_finger_position_title')} className="w-full rounded-lg mb-4"/>
            <p className="text-muted">{t('player_nadi_finger_position_desc')}</p>
        </Modal>

        <Modal show={showIntentionsModal} title="Exemples d'intentions" onClose={() => setShowIntentionsModal(false)}>
            <ul className="space-y-2">
                {MORNING_INTENTIONS.map((intention, index) => (
                    <li key={index}>
                        <button 
                            onClick={() => { setCustomIntention(intention); setShowIntentionsModal(false); }} 
                            className="w-full text-left p-2 rounded-lg hover:bg-white/10"
                        >
                            {intention}
                        </button>
                    </li>
                ))}
            </ul>
        </Modal>

        {isAuroraTheme && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 -z-10"></div>}
        {ritual.playerType === 'audio-guide' && <audio ref={audioRef} src={ritual.data.audioUrl} preload="auto" onEnded={() => stop(true)} onError={() => setAudioError(true)} />}
        {audioError && <p className="text-bad text-xs">Erreur de chargement audio.</p>}
    </div>
  );
};
