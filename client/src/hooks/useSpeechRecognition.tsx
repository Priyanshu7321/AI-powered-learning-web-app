import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionOptions {
  language: 'en' | 'hi';
}

interface UseSpeechRecognitionReturn {
  transcript: string;
  listening: boolean;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

// Define the SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: (event: Event) => void;
  onerror: (event: Event) => void;
  onstart: (event: Event) => void;
  start(): void;
  stop(): void;
  abort(): void;
}

// Get the browser's SpeechRecognition constructor
const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function useSpeechRecognition({ 
  language = 'en'
}: SpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [browserSupport, setBrowserSupport] = useState(!!SpeechRecognition);

  useEffect(() => {
    if (!SpeechRecognition) {
      setBrowserSupport(false);
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language === 'en' ? 'en-US' : 'hi-IN';
    
    recognitionInstance.onstart = () => {
      setListening(true);
    };
    
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }
      
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };
    
    recognitionInstance.onend = () => {
      setListening(false);
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event);
      setListening(false);
    };
    
    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance && listening) {
        recognitionInstance.stop();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript("");
      recognition.start();
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition: browserSupport
  };
}
