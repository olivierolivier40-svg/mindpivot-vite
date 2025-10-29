import type { Program } from '../types.ts';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

export const ProgramCard = ({ program, onStart, onInfo, isLocked }: { program: Program; onStart: (id: string) => void; onInfo: (id: string) => void; isLocked: boolean }) => {
    const { t } = useI18n();
    return (
        <div className={`p-4 border border-white/10 rounded-xl bg-white/5 flex flex-col text-center gap-3 transition-all duration-200 hover:bg-white/[.08] ${isLocked ? 'opacity-60 grayscale-[50%]' : ''}`}>
            <div className="text-3xl">{program.icon}</div>
            <h4 className="font-bold text-lg leading-tight">{t(program.title)}</h4>
            <p className="text-sm text-muted flex-1">{t(program.description)}</p>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-info">{t('program_card_days', { durationDays: program.durationDays })}</span>
            <div className="flex flex-col gap-2 mt-2">
                <Button size="small" onClick={() => onStart(program.id)}>
                    {isLocked ? t('program_card_unlock') : t('program_card_start')}
                </Button>
                <Button size="small" variant="ghost" onClick={() => onInfo(program.id)}>
                    {t('program_card_more_info')}
                </Button>
            </div>
        </div>
    );
};