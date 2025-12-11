
import type { Program } from '../types.ts';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

export const ProgramCard = ({ program, onStart, onInfo, isLocked }: { program: Program; onStart: (id: string) => void; onInfo: (id: string) => void; isLocked: boolean }) => {
    const { t } = useI18n();
    
    return (
        <div className={`w-full h-full max-w-sm mx-auto p-5 bg-card rounded-xl shadow-lg border border-white/10 flex flex-col text-center gap-4 transition-all duration-300 ease-in-out hover:shadow-accent/20 hover:shadow-xl hover:-translate-y-1 ${isLocked ? 'opacity-60 grayscale-[50%]' : ''}`}>
            
            {/* Header: Lock status & Duration Badge */}
            <div className="flex gap-2 items-center justify-center text-sm">
                {isLocked && <span className="text-amber-400 text-lg" aria-label="Programme Premium">🔒</span>}
                <span className="py-1 px-3 rounded-full bg-accent-tertiary/10 text-accent-tertiary border border-accent-tertiary/20 font-bold uppercase tracking-wider text-xs">
                    {t('program_card_days', { durationDays: program.durationDays })}
                </span>
            </div>

            {/* Content: Icon, Title, Description */}
            <div className="flex-1 flex flex-col items-center gap-2">
                <div className="text-5xl mb-2 drop-shadow-md filter">{program.icon}</div>
                <h4 className="font-bold text-xl leading-tight text-fg">{t(program.title)}</h4>
                <p className="text-sm text-muted-darker line-clamp-4 leading-relaxed px-2">
                    {t(program.description)}
                </p>
            </div>

            {/* Actions Footer */}
            <div className="flex gap-3 justify-center items-center mt-2 pt-4 border-t border-white/5 w-full">
                <Button size="small" variant="primary" onClick={() => onStart(program.id)} className="flex-1">
                    {isLocked ? t('program_card_unlock') : t('program_card_start')}
                </Button>
                <Button size="small" variant="info" onClick={() => onInfo(program.id)} className="w-12 !px-0 flex items-center justify-center" aria-label={t('program_card_more_info')}>
                    Info
                </Button>
            </div>
        </div>
    );
};
