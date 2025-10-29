import type { ChangeEvent, FC } from 'react';
import { Button } from './Button.tsx';
import { useI18n } from '../hooks/useI18n.tsx';

interface CheckinSliderProps {
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    labels: string[];
    helpId: string;
    onHelp: (id: string) => void;
}

export const CheckinSlider: FC<CheckinSliderProps> = ({ label, value, onChange, labels, helpId, onHelp }) => {
    const { t } = useI18n();
    return (
        <div className="py-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1">
                <h4 className="font-bold">{label}</h4>
                <button onClick={() => onHelp(helpId)} className="h-6 w-6 rounded-full bg-accent-info text-white hover:bg-opacity-90 text-sm font-bold flex items-center justify-center" aria-label={t('checkin_help_for', {label: label})}>?</button>
            </div>
            <span className="text-sm py-0.5 px-2.5 rounded-full bg-accent-soft text-accent font-bold">{labels[value+2]}</span>
          </div>
          <div className="flex items-center gap-2">
             <Button size="small" variant="secondary" className="w-10 h-10 !rounded-full" onClick={() => onChange({ target: { value: String(Math.max(-2, value - 1)) } } as any)}>-</Button>
             <input type="range" min="-2" max="2" step="1" value={value} onChange={onChange} className="w-full" />
             <Button size="small" variant="secondary" className="w-10 h-10 !rounded-full" onClick={() => onChange({ target: { value: String(Math.min(2, value + 1)) } } as any)}>+</Button>
          </div>
          <div className="flex justify-between text-xs text-muted mt-1 px-1">
            <span>{labels[0]}</span><span className="flex-1"></span><span>{labels[2]}</span><span className="flex-1"></span><span>{labels[4]}</span>
          </div>
        </div>
    );
}