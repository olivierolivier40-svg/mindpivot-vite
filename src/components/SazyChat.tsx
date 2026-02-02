
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

export const SazyChat = ({ onBack, checkinData, sessions, onStartRitual }: SazyChatProps) => {
    const { t } = useI18n();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Détection de la langue du navigateur (fr, en, es) - par défaut 'fr'
    const getBrowserLang = () => {
        if (typeof navigator === 'undefined') return 'fr';
        const lang = navigator.language.split('-')[0];
        return ['fr', 'en', 'es'].includes(lang) ? lang : 'fr';
    };

    // Charger l'historique
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

    // Sauvegarder l'historique
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

        // Préparation du contexte intelligent
        const todaySessions = sessions.filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString()).length;
        const moodContext = `[Data: Energie=${checkinData.energie}/4, Humeur=${checkinData.humeur}/4, Rituels aujourd'hui=${todaySessions}]`;

        try {
            // Utilisation de la langue du navigateur pour le prompt système
            // NOTE: Si constants.ts n'est pas à jour avec constructSazyPrompt, cela peut causer une erreur.
            // Assurez-vous que constants.ts exporte bien cette fonction.
            const systemPrompt = typeof constructSazyPrompt === 'function' 
                ? constructSazyPrompt(RITUELS, getBrowserLang())
                : "Tu es un coach bien-être."; 
            
            // On envoie l'historique complet pour la mémoire + le nouveau message
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
                text: "Désolé, je ne parviens pas à réfléchir pour le moment. Vérifie ta connexion ou les clés API.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const parseRitualLinks = (text: string) => {
        if (!text) return null;
        // Regex pour trouver {{rit.id}}
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
            // Rendu du texte normal avec sauts de ligne
            return <span key={index} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />;
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-bg flex flex-col animate-fade-in">
            {/* Header */}
            <header className="p-4 flex items-center justify-between border-b border-white/10 bg-card/50 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="small" onClick={onBack}>←</Button>
                    <div className="relative">
                        <img src="https://magnetiseur-dax.fr/webapp/Aura/Sazy-home.png" alt="Sazy" className="w-10 h-10 rounded-full border border-white/20 object-cover object-top bg-indigo-900" />
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
                {messages.length === 0 && (
                    <div className="text-center text-muted mt-10 opacity-70">
                        <div className="text-6xl mb-4">🌸</div>
                        <p>{t('sazy_welcome_subtitle')}</p>
                        <Button variant="secondary" className="mt-4" onClick={() => handleSendMessage("Bonjour Sazy")}>{t('sazy_welcome_start_button')}</Button>
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
            <div className="p-4 bg-card/80 backdrop-blur-md border-t border-white/10">
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
        </div>
    );
};
