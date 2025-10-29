import { useState, useEffect } from 'react';
import type { Ritual, BadgeId } from '../types.ts';
import { Button } from './Button.tsx';
import { BADGES } from '../constants.ts';
import { Card } from './Card.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface CongratsAndJournalProps {
  ritual: Ritual;
  onDone: (journalText: string) => void;
  onRestart: () => void;
  newlyUnlockedBadgeId: BadgeId | null;
}

interface FeelingState {
  id: string;
  icon: React.ReactNode;
  label: string;
  tags: string[];
}

const SereneIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path></svg>;
const EnergizedIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const FocusedIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const TiredIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const AgitatedIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3l3-9 3 18 3-9 3 9h3"/></svg>;

const FEELING_STATES: FeelingState[] = [
    { id: 'serene', icon: <SereneIcon />, label: 'congrats_feeling_serene', tags: ['serein', 'calme', 'détendu'] },
    { id: 'energized', icon: <EnergizedIcon />, label: 'congrats_feeling_energized', tags: ['énergisé', 'dynamique', 'vivifié'] },
    { id: 'focused', icon: <FocusedIcon />, label: 'congrats_feeling_focused', tags: ['concentré', 'clair', 'focalisé'] },
    { id: 'tired', icon: <TiredIcon />, label: 'congrats_feeling_tired', tags: ['fatigué', 'apaisé', 'reposé'] },
    { id: 'agitated', icon: <AgitatedIcon />, label: 'congrats_feeling_agitated', tags: ['agité', 'libéré', 'soulagé'] },
];

export const CongratsAndJournal = ({ ritual, onDone, onRestart, newlyUnlockedBadgeId }: CongratsAndJournalProps) => {
  const { t } = useI18n();
  const [journalText, setJournalText] = useState('');
  const [selectedFeelings, setSelectedFeelings] = useState<Set<string>>(new Set());
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false);

  useEffect(() => {
    if (newlyUnlockedBadgeId) {
      const timer = setTimeout(() => setShowBadgeAnimation(true), 500);
      return () => clearTimeout(timer);
    }
  }, [newlyUnlockedBadgeId]);

  const toggleFeeling = (feeling: FeelingState) => {
    setSelectedFeelings(prev => {
      const newFeelings = new Set(prev);
      if (newFeelings.has(feeling.id)) {
        newFeelings.delete(feeling.id);
      } else {
        newFeelings.add(feeling.id);
      }
      return newFeelings;
    });
  };

  const handleDone = () => {
    const feelingsText = Array.from(selectedFeelings)
      .map(id => {
        const feeling = FEELING_STATES.find(f => f.id === id);
        return feeling ? `#${t(feeling.label)}` : '';
      })
      .join(' ');

    const fullJournalText = `${journalText.trim()} ${feelingsText.trim()}`.trim();
    onDone(fullJournalText);
  };
  
  const unlockedBadge = newlyUnlockedBadgeId ? BADGES[newlyUnlockedBadgeId] : null;

  return (
    <div className="w-full h-[calc(100vh-2rem)] flex flex-col items-center justify-center p-4 text-center animate-fade-in">
        <Card className="w-full max-w-lg">
            {unlockedBadge && (
                <div className={`mb-6 p-4 bg-accent/10 rounded-lg border border-accent/30 transition-all duration-700 ease-out transform ${showBadgeAnimation ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <p className="font-bold text-sm text-accent">{t('congrats_badge_unlocked')}</p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <span className="text-4xl">{unlockedBadge.icon}</span>
                        <div>
                            <p className="font-bold text-lg">{t(unlockedBadge.name)}</p>
                            <p className="text-xs text-muted">{t(unlockedBadge.description)}</p>
                        </div>
                    </div>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-2">{t('congrats_title')}</h2>
            <p className="text-muted mb-6">{t('congrats_subtitle', { ritualName: t(ritual.label) })}</p>

            <div className="mb-6">
                <label htmlFor="journal" className="block text-sm font-medium text-muted mb-2">{t('congrats_journal_prompt')}</label>
                <textarea id="journal" value={journalText} onChange={e => setJournalText(e.target.value)} rows={3} placeholder={t('congrats_journal_placeholder')} className="w-full p-2 rounded-lg bg-white/10 border border-white/20 focus:ring-accent focus:border-accent" />
            </div>

            <div className="mb-6">
                <p className="text-sm font-medium text-muted mb-3">{t('congrats_feeling_prompt')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {FEELING_STATES.map(feeling => (
                        <button key={feeling.id} onClick={() => toggleFeeling(feeling)} className={`px-3 py-2 text-sm rounded-full flex items-center gap-2 transition-colors ${selectedFeelings.has(feeling.id) ? 'bg-accent text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                           <span className="w-5 h-5">{feeling.icon}</span>
                           {t(feeling.label)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" onClick={handleDone} className="flex-1">{t('congrats_done_button')}</Button>
                <Button variant="secondary" onClick={onRestart} className="flex-1">{t('congrats_restart_button')}</Button>
            </div>
        </Card>
    </div>
  );
};