
import { useState, useEffect } from 'react';
import type { Ritual, BadgeId, SoundSettings } from '../types.ts';
import { Button } from './Button.tsx';
import { BADGES, SOUND_OPTIONS } from '../constants.ts';
import { Card } from './Card.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface CongratsAndJournalProps {
  ritual: Ritual;
  onDone: (journalText: string) => void;
  onRestart: () => void;
  newlyUnlockedBadgeId: BadgeId | null;
  soundSettings?: SoundSettings;
}

export const CongratsAndJournal = ({ ritual, onDone, onRestart, newlyUnlockedBadgeId, soundSettings }: CongratsAndJournalProps) => {
  const { t } = useI18n();
  const [journalText, setJournalText] = useState('');
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  useEffect(() => {
    if (newlyUnlockedBadgeId) {
      const timer = setTimeout(() => setShowBadgeAnimation(true), 300);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedBadgeId]);

  useEffect(() => {
    if (soundSettings && soundSettings.enabled && soundSettings.selectedSound !== 'none') {
      const soundUrl = SOUND_OPTIONS[soundSettings.selectedSound].url;
      const audio = new Audio(soundUrl);
      audio.volume = soundSettings.volume;
      audio.play().catch(e => console.error("Erreur lecture son fin:", e));
    }
  }, [soundSettings]);

  const unlockedBadge = newlyUnlockedBadgeId ? BADGES[newlyUnlockedBadgeId] : null;

  return (
    <div className="w-full min-h-[calc(100vh-2rem)] flex flex-col items-center justify-start py-4 px-4 text-center animate-fade-in overflow-y-auto">
        <Card className="w-full max-w-lg">
            {unlockedBadge && (
                <div className={`mb-6 p-4 bg-accent/10 rounded-lg border border-accent/30 transition-all duration-500 ease-out transform ${showBadgeAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <p className="font-bold text-sm text-accent">{t('congrats_new_badge')}</p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <span className="text-4xl animate-subtle-pulse">{unlockedBadge.icon}</span>
                        <div>
                            <p className="font-bold text-lg">{t(unlockedBadge.name)}</p>
                            <p className="text-xs text-muted">{t(unlockedBadge.description)}</p>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{t('congrats_title')}</h2>
            <p className="text-muted mb-2">{t('congrats_completed_ritual', { ritualLabel: t(ritual.label) })}</p>
            <p className="font-semibold mb-6">💧 <strong>{t('congrats_drink_water')}</strong></p>


            <div className="mb-6">
                <label htmlFor="journal" className="block text-sm font-medium text-muted mb-2">{t('congrats_journal_prompt_ia')}</label>
                <textarea id="journal" value={journalText} onChange={e => setJournalText(e.target.value)} rows={4} placeholder={t('congrats_notes_placeholder')} className="w-full p-2 rounded-lg bg-white/10 border border-white/20 focus:ring-accent focus:border-accent" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" onClick={() => onDone(journalText)} className="flex-1">{t('congrats_finish_and_save')}</Button>
                <Button variant="secondary" onClick={onRestart} className="flex-1">{t('congrats_restart')}</Button>
            </div>
        </Card>
    </div>
  );
};
