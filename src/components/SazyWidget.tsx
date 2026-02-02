
import { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';

interface SazyWidgetProps {
    onClick: () => void;
}

export const SazyWidget = ({ onClick }: SazyWidgetProps) => {
    const { t } = useI18n();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div 
            className="fixed bottom-[90px] left-4 z-40 flex items-end gap-3 pointer-events-none"
            style={{ maxWidth: '90%' }}
        >
            {/* Avatar Sazy (Emoji Femme Blonde) */}
            <div 
                className={`transition-all duration-700 ease-out cursor-pointer pointer-events-auto group transform ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
                onClick={onClick}
            >
                <div className="relative w-16 h-16">
                    {/* Halo */}
                    <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-pulse"></div>
                    
                    {/* Cercle Gradient */}
                    <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-400 shadow-lg border-2 border-white/20 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                        <span className="text-4xl filter drop-shadow-md pt-1">👱‍♀️</span>
                    </div>
                </div>
            </div>

            {/* Bulle de dialogue (à droite du visage) */}
            <div 
                className={`pointer-events-auto transition-all duration-700 delay-300 ease-out transform origin-bottom-left ${
                    isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-4'
                }`}
            >
                <button 
                    onClick={onClick}
                    className="bg-white/90 backdrop-blur-md text-slate-800 px-3 py-2 rounded-2xl rounded-bl-none shadow-lg border border-white/50 text-xs font-semibold flex items-center gap-1 hover:bg-white transition-colors mb-2"
                >
                    <span>💬</span>
                    {t('sazy_teaser_message')}
                </button>
            </div>
        </div>
    );
};
