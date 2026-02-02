
import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n.tsx';
import { Button } from './Button.tsx';
import { SpeechMicButton } from './SpeechMicButton.tsx';
import { RITUELS, constructSazyPrompt } from '../constants.ts';
import { generateSazyChat } from '../services/geminiService.ts';
import type { Session } from '../types.ts';

interface SazyChatProps {
    onBack: () => void;
    checkinData: any;
    sessions: Session[];
    onStartRitual: (id: string) => void;
}

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

const SazyAvatar = ({ size = 'small' }: { size?: 'small' | 'large' }) => {
    const sizeClasses = size === 'small' ? 'w-10 h-10' : 'w-24 h-24';
    return (
        <div className={`${sizeClasses} relative rounded-full bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-400 flex flex-col items-center justify-center shadow-lg border border-white/20 overflow-hidden flex-shrink-0`}>
            {/* Visage Stylisé CSS */}
            <div className={`flex gap-${size === 'small' ? '1' : '3'} mt-1`}>
                <div className={`${size === 'small' ? 'w-0.5 h-1' : 'w-1.5 h-2.5'} bg-white rounded-full opacity-90`}></div>
                <div className={`${size === 'small' ? 'w-0.5 h-1' : 'w-1.5 h-2.5'} bg-white rounded-full opacity-90`}></div>
            </div>
            <div className={`${size === 'small' ? 'w-3 h-1.5' : 'w-8 h-4'} border-b ${size === 'small' ? 'border' : 'border-2'} border-white/80 rounded-b-full mt-0.5`}></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[1px]"></div>
        </div>
    );
};

export const SazyChat = ({ onBack, checkinData, sessions, onStartRitual }: SazyChatProps) => {
    const { t } = useI18n();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getBrowserLang = () => {
        if (typeof navigator === 'undefined') return 'fr';
        const lang = navigator.language.split('-')[0];
        return ['fr', 'en', 'es'].includes(lang) ? lang : 'fr';
    };

    useEffect(() => {
        const saved = localStorage.getItem('StopAndZenSazyHistory');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Erreur lecture historique Sazy", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('StopAndZenSazyHistory', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClearHistory = () => {
        if (confirm(t('sazy_chat_clear_confirm'))) {
            setMessages([]);
            localStorage.removeItem('StopAndZenSazyHistory');
        }
    };

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length;
        const moodContext = `[Data: Energie=${checkinData.energie}/4, Humeur=${checkinData.humeur}/4, Rituels aujourd'hui=${todaySessions}]`;

        try {
            const systemPrompt = typeof constructSazyPrompt === 'function' 
                ? constructSazyPrompt(RITUELS, getBrowserLang())
                : "Tu es un coach bien-être."; 
            
            const historyForAi = [...messages, newUserMsg].map(m => ({ role: m.role, text: m.text }));
            
            const responseText = await generateSazyChat(historyForAi, systemPrompt, moodContext);

            const newAiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, newAiMsg]);

        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Je n'arrive pas à me connecter. Vérifie que ta clé API est bien configurée dans le fichier .env (VITE_API_KEY).",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const parseRitualLinks = (text: string) => {
        if (!text) return null;
        const parts = text.split(/(\{\{rit\.[a-z0-9_]+\}\})/g);
        
        return parts.map((part, index) => {
            if (part.startsWith('{{') && part.endsWith('}}')) {
                const ritualId = part.replace('{{', '').replace('}}', '');
                const ritual = RITUELS.find(r => r.id === ritualId);
                
                if (ritual) {
                    return (
                        <div key={index} className="my-2 p-3 bg-card border border-accent/30 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in">
                            <span className="text-2xl">{ritual.modal.icon}</span>
                            <div className="flex-1 text-left">
                                <p className="font-bold text-sm">{t(ritual.label)}</p>
                                <p className="text-xs text-muted">{Math.floor(ritual.dureeSec/60)} min</p>
                            </div>
                            <Button size="small" variant="primary" onClick={() => onStartRitual(ritual.id)}>Lancer</Button>
                        </div>
                    );
                }
                return null;
            }
            return <span key={index} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
        });
    };

    const hasStarted = messages.length > 0;

    return (
        <div className="fixed inset-0 z-50 bg-bg flex flex-col animate-fade-in">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 p-4 flex items-center justify-between border-b border-white/10 bg-card/80 backdrop-blur-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="small" onClick={onBack} aria-label="Fermer" className="!p-1">
                        {/* Croix de fermeture */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                    <div className="relative">
                        <SazyAvatar size="small" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card"></span>
                    </div>
                    <div>
                        <h2 className="font-bold leading-none">{t('sazy_name')}</h2>
                        <p className="text-xs text-muted">{t('sazy_role')}</p>
                    </div>
                </div>
                <Button variant="ghost" size="small" onClick={handleClearHistory} className="text-muted hover:text-bad" title={t('sazy_chat_clear_button')}>🗑️</Button>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {!hasStarted && (
                    <div className="text-center text-muted mt-10 opacity-70 flex flex-col items-center justify-center h-full pb-20">
                        <div className="mb-6">
                             <SazyAvatar size="large" />
                        </div>
                        <p className="max-w-xs mx-auto mb-8">{t('sazy_welcome_subtitle')}</p>
                        <Button 
                            variant="primary" 
                            size="large"
                            className="pulse-animation shadow-accent/20 shadow-xl"
                            onClick={() => handleSendMessage("Bonjour Sazy")}
                        >
                            {t('sazy_welcome_start_button')}
                        </Button>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`max-w-[85%] rounded-2xl p-4 shadow-sm backdrop-blur-sm ${
                                msg.role === 'user' 
                                    ? 'bg-accent text-white rounded-tr-none' 
                                    : 'bg-white/10 border border-white/10 text-fg rounded-tl-none'
                            }`}
                        >
                            <div className="text-sm leading-relaxed">
                                {parseRitualLinks(msg.text)}
                            </div>
                            <p className="text-[10px] opacity-50 mt-1 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center">
                            <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {hasStarted && (
                <div className="p-4 bg-card/80 backdrop-blur-md border-t border-white/10 animate-fade-in-up">
                    <div className="flex items-end gap-2 max-w-2xl mx-auto">
                        <SpeechMicButton onTranscript={(text) => setInputValue(prev => prev + " " + text)} className="mb-1" />
                        <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 focus-within:border-accent/50 focus-within:bg-white/10 transition-colors">
                            <textarea 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(inputValue);
                                    }
                                }}
                                placeholder={t('sazy_chat_input_placeholder')}
                                className="w-full bg-transparent border-none focus:ring-0 p-3 max-h-32 min-h-[44px] resize-none text-sm"
                                rows={1}
                                style={{ height: 'auto', minHeight: '44px' }}
                                autoFocus
                            />
                        </div>
                        <Button 
                            variant="primary" 
                            size="small" 
                            className={`!h-11 !w-11 !rounded-full !p-0 flex-shrink-0 ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleSendMessage(inputValue)}
                            disabled={!inputValue.trim() || isTyping}
                        >
                            ➤
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
