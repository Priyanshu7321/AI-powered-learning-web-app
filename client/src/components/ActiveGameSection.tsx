import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import OwlMascot from "./OwlMascot";
import SpeechWave from "./SpeechWave";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { playAudio } from "@/lib/audioUtils";
import { Game, Phrase } from "@/lib/gameData";
import { Link } from 'wouter';

interface ActiveGameSectionProps {
  game: Game;
  onClose: () => void;
  language: 'en' | 'hi';
}

export default function ActiveGameSection({ game, onClose, language }: ActiveGameSectionProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [correctPhrases, setCorrectPhrases] = useState<number[]>([]);
  const [skippedPhrases, setSkippedPhrases] = useState<number[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(time => time + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);
  
  const currentPhrase = game.phrases[currentPhraseIndex];
  const phraseToRecognize = language === 'en' ? currentPhrase.text : currentPhrase.textHi;
  
  const { 
    transcript, 
    listening, 
    startListening, 
    stopListening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ language });

  const handleSpeechResult = () => {
    if (!transcript) return;
    
    // Simple matching logic - can be enhanced with more sophisticated algorithms
    const normalizedTranscript = transcript.toLowerCase().trim();
    const normalizedPhrase = phraseToRecognize.toLowerCase().trim();
    
    const isCorrect = normalizedTranscript.includes(normalizedPhrase) || 
                      normalizedPhrase.includes(normalizedTranscript) ||
                      // Calculate similarity - this is a very basic implementation
                      (normalizedTranscript.length > 0 && 
                       normalizedPhrase.length > 0 && 
                       normalizedTranscript.split(' ').some(word => 
                         normalizedPhrase.includes(word) && word.length > 3));
    
    if (isCorrect) {
      setShowSuccess(true);
      setCorrectPhrases(prev => [...prev, currentPhraseIndex]);
      
      // Move to next phrase after a delay
      setTimeout(() => {
        setShowSuccess(false);
        if (currentPhraseIndex < game.phrases.length - 1) {
          setCurrentPhraseIndex(currentPhraseIndex + 1);
        }
      }, 2000);
    } else {
      setShowTryAgain(true);
      setTimeout(() => {
        setShowTryAgain(false);
      }, 2000);
      
      // Check if this was the last phrase
      if (currentPhraseIndex === game.phrases.length - 1) {
        // Update game progress
        fetch('/api/game-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            gameId: game.id,
            completed: true,
            score: correctPhrases.length,
            evaluation: `${correctPhrases.length}/${game.phrases.length} phrases correct`,
            starsEarned: Math.ceil((correctPhrases.length / game.phrases.length) * 3),
            wordsLearned: correctPhrases.length
          })
        });
        
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (!listening && transcript) {
      handleSpeechResult();
    }
  }, [listening, transcript]);

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const playCurrentPhrase = () => {
    // In a real implementation, we would play the audio file for the current phrase
    playAudio("phrase_audio");
  };

  const skipPhrase = () => {
    setSkippedPhrases(prev => [...prev, currentPhraseIndex]);
    if (currentPhraseIndex < game.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
    }
  };

  const endGame = async () => {
    setIsActive(false);
    
    // Calculate stats
    const attemptsCount = correctPhrases.length + skippedPhrases.length;
    const accuracy = (correctPhrases.length / game.phrases.length) * 100;
    
    // Update game progress
    await fetch('/api/game-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameId: game.id,
        completed: true,
        score: correctPhrases.length,
        evaluation: `${correctPhrases.length}/${game.phrases.length} correct (${accuracy.toFixed(1)}%)`,
        starsEarned: Math.ceil((correctPhrases.length / game.phrases.length) * 3),
        wordsLearned: correctPhrases.length,
        timeSpent,
        attemptsCount,
        skippedCount: skippedPhrases.length
      })
    });
    
    onClose();
  };

  const translations = {
    en: {
      hearAgain: "Hear Again",
      skip: "Skip This One",
      great: "Great job!",
      correct: "You said it correctly! Let's try another one.",
      tryAgain: "Let's try again!",
      close: "That was close! Give it another try.",
      yourProgress: "Your Progress",
      completed: "Completed",
      speakPrompt: "Click the microphone button and say the phrase!"
    },
    hi: {
      hearAgain: "फिर से सुनें",
      skip: "इसे छोड़ें",
      great: "शाबाश!",
      correct: "आपने सही कहा! आइए एक और प्रयास करें।",
      tryAgain: "फिर से प्रयास करें!",
      close: "वह करीब था! एक और कोशिश करो।",
      yourProgress: "आपकी प्रगति",
      completed: "पूर्ण",
      speakPrompt: "माइक्रोफ़ोन बटन पर क्लिक करें और वाक्यांश कहें!"
    }
  };

  const t = translations[language];

  if (!browserSupportsSpeechRecognition) {
    return (
      <section className="mb-10">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Speech Recognition Not Supported</h2>
          <p className="mb-4">Your browser doesn't support speech recognition. Please try a different browser like Chrome.</p>
          <Button onClick={onClose}>Go Back</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10" id="activeGameSection">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-secondary py-4 px-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white font-comic flex items-center">
            <i className="ri-mic-line mr-3"></i>
            {language === 'en' ? game.name : game.nameHi}
          </h2>
          <Button 
            className="bg-white text-secondary rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 transition p-0" 
            aria-label="Close game" 
            onClick={onClose}
          >
            <i className="ri-close-line text-xl"></i>
          </Button>
        </div>
        
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <OwlMascot size="small" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-dark mb-3 font-comic">
              {language === 'en' ? `Repeat after me: "${currentPhrase.text}"` : 
                `मेरे बाद दोहराएं: "${currentPhrase.textHi}"`}
            </h3>
            <p className="text-lg text-dark opacity-70 mb-6">{t.speakPrompt}</p>
            
            <div className="flex justify-center mb-6">
              <Button 
                id="speakButton"
                className={`font-bold rounded-full w-24 h-24 flex items-center justify-center shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50 p-0 ${
                  listening ? 'bg-red-500 animate-pulse' : 'bg-primary'
                }`}
                onClick={toggleListening}
              >
                <i className="ri-mic-line text-4xl text-white"></i>
              </Button>
            </div>
            
            <SpeechWave isActive={listening} />
            
            <div className={`mb-8 p-6 rounded-xl animate-pulse-slow ${!showSuccess && !showTryAgain ? 'hidden' : ''}`}>
              {showSuccess && (
                <div className="bg-green bg-opacity-20 p-6 rounded-xl">
                  <i className="ri-check-double-line text-green text-5xl mb-3"></i>
                  <h4 className="text-2xl font-bold text-green mb-2">{t.great}</h4>
                  <p className="text-dark">{t.correct}</p>
                </div>
              )}
              
              {showTryAgain && (
                <div className="bg-primary bg-opacity-20 p-6 rounded-xl">
                  <i className="ri-refresh-line text-primary text-5xl mb-3 animate-spin"></i>
                  <h4 className="text-2xl font-bold text-primary mb-2">{t.tryAgain}</h4>
                  <p className="text-dark">{t.close}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="w-full text-center mb-4">
                <span className="text-xl font-bold">
                  Time: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Button 
                className="bg-accent hover:bg-opacity-80 transition text-dark font-bold py-3 px-6 rounded-full text-lg shadow flex items-center gap-2 h-auto"
                onClick={playCurrentPhrase}
              >
                <i className="ri-volume-up-line text-xl"></i>
                {t.hearAgain}
              </Button>
              <Button 
                className="bg-white border-2 border-secondary hover:bg-secondary hover:text-white transition text-secondary font-bold py-3 px-6 rounded-full text-lg shadow flex items-center gap-2 h-auto"
                onClick={skipPhrase}
              >
                <i className="ri-skip-forward-line text-xl"></i>
                {t.skip}
              </Button>
              <Button 
                className="bg-red-500 hover:bg-red-600 transition text-white font-bold py-3 px-6 rounded-full text-lg shadow flex items-center gap-2 h-auto"
                onClick={endGame}
              >
                <i className="ri-stop-circle-line text-xl"></i>
                End Task
              </Button>
            </div>
          </div>
          
          <div className="bg-accent bg-opacity-10 rounded-xl p-6">
            <h4 className="font-bold text-xl text-dark mb-4 flex items-center">
              <i className="ri-trophy-line text-accent mr-2"></i>
              {t.yourProgress}
            </h4>
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {game.phrases.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-8 h-8 rounded-full ${
                      correctPhrases.includes(index) 
                        ? 'bg-accent text-dark' 
                        : 'bg-white border-2 border-accent text-accent'
                    } flex items-center justify-center font-bold`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              <div className="text-dark font-bold text-lg">
                {correctPhrases.length} / {game.phrases.length} {t.completed}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
