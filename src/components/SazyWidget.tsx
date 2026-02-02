
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
        // Petit délai pour l'animation d'entrée
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div 
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-sm flex justify-center pointer-events-none"
            style={{ height: '180px' }} // Zone réservée
        >
            {/* Bulle de dialogue (Teaser) */}
            <div 
                className={`absolute top-0 pointer-events-auto transition-all duration-500 ease-out transform ${
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

            {/* Image Sazy */}
            <div 
                className={`absolute bottom-[-10px] transition-transform duration-700 ease-in-out cursor-pointer pointer-events-auto group ${
                    isVisible ? 'translate-y-[45%]' : 'translate-y-[100%]'
                } hover:translate-y-[35%]`}
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ width: '220px' }}
            >
                <img 
                    src="https://magnetiseur-dax.fr/webapp/Aura/Sazy-home.png" 
                    alt="Sazy"
                    className="w-full h-auto drop-shadow-[0_-5px_15px_rgba(255,255,255,0.3)]"
                />
                
                {/* Effet de respiration */}
                <div className="absolute inset-0 animate-subtle-pulse opacity-0 group-hover:opacity-100 bg-gradient-to-t from-accent/20 to-transparent rounded-full blur-xl transition-opacity duration-500" />
            </div>
        </div>
    );
};
