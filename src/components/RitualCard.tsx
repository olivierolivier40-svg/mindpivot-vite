import type { CSSProperties } from 'react';
import type { Ritual } from '../types.ts';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface RitualCardProps {
    ritual: Ritual;
    onStart: (id: string, from: string) => void;
    onInfo: (id: string) => void;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    isPremiumUser: boolean;
    className?: string;
    style?: CSSProperties;
}

export const RitualCard = ({ ritual, onStart, onInfo, isFavorite, onToggleFavorite, isPremiumUser, className, style }: RitualCardProps) => {
    const { t } = useI18n();
    const cleanPourquoi = t(ritual.modal.sections.pourquoi).replace(/<[^>]+>/g, '');
    const isLocked = ritual.isPremium && !isPremiumUser;
    
    return (
      <div className={`w-full h-full max-w-sm p-4 bg-card rounded-xl shadow-lg border border-white/10 flex flex-col text-center gap-3 transition-all duration-300 ease-in-out hover:shadow-accent/20 hover:shadow-xl hover:-translate-y-1 ${isLocked ? 'opacity-60 grayscale-[50%]' : ''} ${className}`} style={style}>
        <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-2 items-baseline justify-center">
                {isLocked && <span className="text-amber-400" aria-label="Rituel premium">🔒</span>}
                <span className="text-sm py-0.5 px-2 rounded-full bg-accent-soft text-accent font-bold uppercase tracking-wider">{t(`stats_category_${ritual.category}`)}</span>
            </div>
            <h4 className="font-bold text-lg leading-tight">{t(ritual.label)}</h4>
            <p className="text-sm text-muted-darker text-left line-clamp-5">{cleanPourquoi}</p>
        </div>
        <div className="flex gap-2 justify-center items-center mt-2">
          <Button size="small" variant="primary" onClick={() => onStart(ritual.id, 'all')} aria-label={`${isLocked ? t('program_card_unlock') : t('start')} ${t('the_ritual')} ${t(ritual.label)}`}>
            {isLocked ? t('program_card_unlock') : t('start')}
          </Button>
          <Button size="small" variant="info" onClick={() => onInfo(ritual.id)} aria-label={`${t('program_card_more_info')} ${t(ritual.label)}`}>Info</Button>
          <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(ritual.id); }}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${isFavorite ? 'text-amber-400' : 'text-muted hover:text-white'}`}
              aria-label={isFavorite ? t('remove_from_favorites') : t('add_to_favorites')}
            >
              {/* FIX: Completed the truncated SVG element */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </button>
        </div>
      </div>
    );
};