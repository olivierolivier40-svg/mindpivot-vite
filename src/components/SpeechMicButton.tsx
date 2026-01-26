import { useSpeechRecognition } from '../hooks/useSpeechRecognition.ts';
import { Button } from './Button.tsx';

interface SpeechMicButtonProps {
    onTranscript: (text: string) => void;
    className?: string;
}

const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" /><path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" /></svg>;

export const SpeechMicButton = ({ onTranscript, className }: SpeechMicButtonProps) => {
    // On passe directement la fonction de réception au hook.
    // Plus besoin de useEffect ici, ce qui évite les boucles de rendu.
    const { isListening, toggleListening, hasSupport } = useSpeechRecognition(onTranscript);

    if (!hasSupport) return null;

    return (
        <Button 
            type="button"
            variant={isListening ? "primary" : "secondary"} 
            size="small" 
            onClick={toggleListening}
            className={`!rounded-full w-10 h-10 !p-0 flex items-center justify-center transition-all ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse ring-2 ring-red-400 ring-offset-2 ring-offset-bg' : ''} ${className}`}
            title={isListening ? "Arrêter la dictée" : "Dicter"}
        >
            {isListening ? <StopIcon /> : <MicIcon />}
        </Button>
    );
};