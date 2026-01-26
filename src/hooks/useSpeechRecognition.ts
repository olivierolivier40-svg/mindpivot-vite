import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = (onResultCallback?: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // On utilise une Ref pour stocker la fonction de callback.
  // Cela permet d'appeler toujours la version la plus récente de la fonction "handleVoiceInput"
  // sans avoir à redémarrer la reconnaissance vocale à chaque frappe.
  const savedCallback = useRef(onResultCallback);

  useEffect(() => {
    savedCallback.current = onResultCallback;
  }, [onResultCallback]);

  useEffect(() => {
    // Vérification de la compatibilité du navigateur (Standard + Webkit pour iOS)
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; // Continue d'écouter
      recognition.interimResults = false; // On ne prend que les résultats finaux pour éviter les doublons
      recognition.lang = 'fr-FR';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript;
          }
        }
        // On envoie le texte directement au callback sans passer par un état intermédiaire
        if (currentTranscript && savedCallback.current) {
            savedCallback.current(currentTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        // Sur mobile, l'erreur 'no-speech' arrive souvent, on l'ignore silencieusement
        if (event.error !== 'no-speech') {
            console.error('Erreur reconnaissance vocale:', event.error);
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []); // Ce useEffect ne se lance qu'une seule fois au chargement

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Impossible de démarrer la reconnaissance", e);
      }
    } else if (!recognitionRef.current) {
        alert("La reconnaissance vocale n'est pas supportée par ce navigateur (essayez Chrome ou Safari).");
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return { 
    isListening, 
    toggleListening, 
    hasSupport: !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) 
  };
};