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
import { transcribeAudio } from '../lib/wav2vec2Utils';

// Fallback to browser's SpeechRecognition if wav2vec2 fails
const BrowserSpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

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

    const setupAudio = async () => {
      const audioContext = new AudioContext();
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioContext.createMediaStreamSource(mediaStream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      const audioChunks: Float32Array[] = [];

    processor.onaudioprocess = async (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      audioChunks.push(new Float32Array(inputData));
      
      if (audioChunks.length > 10) { // Process every ~2 seconds
        const concatenated = concatenateFloat32Arrays(audioChunks);
        try {
          const transcription = await transcribeAudio(concatenated);
          setTranscript(transcription);
        } catch (error) {
          // Fallback to browser's SpeechRecognition
          const recognitionInstance = new BrowserSpeechRecognition();
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = true;
          recognitionInstance.lang = language === 'en' ? 'en-US' : 'hi-IN';
        }
        audioChunks.length = 0;
      }
    };
    
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
    
    setupAudio().catch(console.error);

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
