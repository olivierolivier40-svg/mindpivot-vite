
import { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';

interface SazyWidgetProps {
    onClick: () => void;
}

export const SazyWidget = ({ onClick }: SazyWidgetProps) => {
    const { t } = useI18n();
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div 
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-sm flex justify-center pointer-events-none"
            style={{ height: '160px' }}
        >
            {/* Bulle de dialogue */}
            <div 
                className={`absolute top-4 pointer-events-auto transition-all duration-500 ease-out transform ${
                    isHovered || isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
                }`}
                style={{ zIndex: 10 }}
            >
                <button 
                    onClick={onClick}
                    className="bg-white/90 backdrop-blur-md text-slate-800 px-4 py-2 rounded-2xl rounded-bl-none shadow-lg border border-white/50 text-sm font-semibold flex items-center gap-2 hover:bg-white transition-colors"
                >
                    <span>💬</span>
                    {t('sazy_teaser_message')}
                </button>
            </div>

            {/* Avatar Sazy CSS (Ne dépend pas d'une image externe) */}
            <div 
                className={`absolute bottom-[-20px] transition-transform duration-700 ease-in-out cursor-pointer pointer-events-auto group ${
                    isVisible ? 'translate-y-0' : 'translate-y-[120%]'
                } hover:translate-y-[-10px]`}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative w-32 h-32">
                    {/* Halo lumineux */}
                    <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full animate-pulse"></div>
                    
                    {/* Cercle principal */}
                    <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-400 p-1 shadow-xl overflow-hidden border-4 border-white/20">
                        <div className="w-full h-full bg-indigo-950/20 backdrop-blur-sm flex items-center justify-center rounded-full">
                            <span className="text-6xl filter drop-shadow-lg transform transition-transform group-hover:scale-110 duration-300">🌸</span>
                        </div>
                        
                        {/* Reflet brillant */}
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-full blur-[2px]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
