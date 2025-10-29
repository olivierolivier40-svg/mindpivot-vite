import React from 'react';
import { useI18n } from '../hooks/useI18n.tsx';

interface SagesseMinutePlayerProps {
    quote: { q: string; a: string };
    phaseIndex: number;
}

export const SagesseMinutePlayer: React.FC<SagesseMinutePlayerProps> = ({ quote, phaseIndex }) => {
    const { t } = useI18n();
    
    const phases = [
        t('player_sagesse_phase_1'),
        t('player_sagesse_phase_2'),
        t('player_sagesse_phase_3'),
        t('player_sagesse_phase_4')
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
            {phaseIndex === 0 && (
                <div className="animate-fade-in">
                    <p className="text-sm text-muted mb-4">{phases[0]}</p>
                    <blockquote className="text-xl italic">
                        "{quote.q}"
                        <footer className="text-base not-italic text-muted mt-2">— {quote.a}</footer>
                    </blockquote>
                </div>
            )}
            {phaseIndex > 0 && (
                <div className="animate-fade-in">
                     <p className="text-lg font-semibold">{phases[phaseIndex]}</p>
                </div>
            )}
        </div>
    );
};
