import { useState, useEffect } from 'react';
import { Game } from '@shared/schema';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveGameSectionProps {
  game: Game;
  language: 'en' | 'hi';
  onComplete?: () => void;
}

export default function ActiveGameSection({ game, language, onComplete }: ActiveGameSectionProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isVoiceDetected, setIsVoiceDetected] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [skippedPhrases, setSkippedPhrases] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const saveGameProgress = async () => {
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
      const accuracy = (score / game.phrases.length) * 100;
      const starsEarned = Math.ceil((score / game.phrases.length) * 3);
      const token = localStorage.getItem('userToken');

      const response = await fetch('/api/game-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          gameId: game.id,
          completed: true,
          score: score,
          evaluation: `${score}/${game.phrases.length} correct (${accuracy.toFixed(1)}%)`,
          starsEarned: starsEarned,
          wordsLearned: score,
          timeSpent: timeSpent,
          attemptsCount: score + skippedPhrases.length,
          skippedCount: skippedPhrases.length,
          bestScore: score // This will be updated on the server if higher
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save game progress');
      }

      const data = await response.json();
      console.log('Game progress saved:', data);
    } catch (error) {
      console.error('Error saving game progress:', error);
      toast.error(language === 'en' ? 'Failed to save progress' : 'प्रगति सहेजने में विफल');
    }
  };

  const handleComplete = async () => {
    setIsCompleted(true);
    await saveGameProgress();
    if (onComplete) {
      onComplete();
    } else {
      toast.success(language === 'en' ? 'Game completed!' : 'खेल पूरा हुआ!');
    }
  };

  const handleResult = (result: { isCorrect: boolean; confidence: number; feedback: string }) => {
    if (result.isCorrect) {
      setScore(prev => prev + 1);
      setFeedback(result.feedback);
      setShowConfetti(true);
      toast.success(result.feedback);
      
      if (currentPhraseIndex < game.phrases.length - 1) {
        setCurrentPhraseIndex(prev => prev + 1);
      } else {
        handleComplete();
      }
    } else {
      setFeedback(result.feedback);
      toast.error(result.feedback);
    }
  };

  const handleError = (error: Error) => {
    console.error('Speech recognition error:', error);
    toast.error('Error with speech recognition. Please try again.');
  };

  const { isRecording, startRecording, stopRecording, evaluatePhrase } = useSpeechRecognition({
    onResult: handleResult,
    onError: handleError,
    onVoiceDetected: setIsVoiceDetected
  });

  useEffect(() => {
    setIsActive(true);
    setStartTime(Date.now());
    return () => setIsActive(false);
  }, [isActive]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const currentPhrase = game.phrases[currentPhraseIndex];
  const phraseToRecognize = language === 'en' ? currentPhrase.text : currentPhrase.textHi;

  const handleSpeak = async () => {
    if (isRecording) {
      stopRecording();
      await evaluatePhrase(phraseToRecognize);
    } else {
      startRecording();
    }
  };

  const handleSkip = async () => {
    setSkippedPhrases(prev => [...prev, currentPhraseIndex]);
    toast.info(language === 'en' ? 'Question skipped!' : 'प्रश्न छोड़ दिया गया!');
    
    if (currentPhraseIndex < game.phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1);
    } else {
      await handleComplete();
    }
  };

  if (isCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">
            {language === 'en' ? 'Game Completed!' : 'खेल पूरा हुआ!'}
          </h2>
          <div className="mb-4">
            <p className="text-lg">
              {language === 'en' ? 'Final Score: ' : 'अंतिम स्कोर: '}
              <span className="font-bold text-blue-600">{score} / {game.phrases.length}</span>
            </p>
            {skippedPhrases.length > 0 && (
              <p className="text-sm text-gray-500">
                {language === 'en' ? 'Skipped questions: ' : 'छोड़े गए प्रश्न: '}
                {skippedPhrases.length}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {language === 'en' ? 'Time spent: ' : 'समय बिताया: '}
              {Math.floor((Date.now() - startTime) / 1000)} seconds
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {language === 'en' ? 'Play Again' : 'फिर से खेलें'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {language === 'en' ? game.name : game.nameHi}
          </h2>
          <p className="text-gray-600">
            {language === 'en' ? game.description : game.descriptionHi}
          </p>
        </div>

        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: isVoiceDetected ? 1.1 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-3xl font-bold mb-4">{phraseToRecognize}</p>
          </motion.div>
          <p className="text-sm text-gray-500">
            {currentPhraseIndex + 1} of {game.phrases.length}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <Button
              onClick={handleSpeak}
              className={`${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
              } text-white text-lg py-6 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105`}
            >
              {isRecording ? '🎤 Stop' : '🎤 Start Speaking'}
            </Button>

            <Button
              onClick={handleSkip}
              className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg py-6 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              ⏭️ {language === 'en' ? 'Skip' : 'छोड़ें'}
            </Button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isVoiceDetected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-sm text-gray-600">
                {isVoiceDetected ? 'I can hear you!' : 'Waiting for your voice...'}
              </span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 text-center"
            >
              <p className={`text-lg font-semibold ${
                feedback.includes('Excellent') ? 'text-green-600' : 
                feedback.includes('Good') ? 'text-blue-600' : 'text-red-600'
              }`}>
                {feedback}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-2xl">🌟</span>
            <p className="text-lg font-semibold text-blue-600">
              Score: {score} / {game.phrases.length}
            </p>
          </div>
          {skippedPhrases.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              {language === 'en' ? 'Skipped questions: ' : 'छोड़े गए प्रश्न: '}
              {skippedPhrases.length}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showConfetti && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 pointer-events-none"
            >
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: window.innerHeight,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: 0,
                    rotate: Math.random() * 360,
                    opacity: 0
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    ease: "easeOut"
                  }}
                >
                  {['🎉', '🎊', '🌟', '✨'][Math.floor(Math.random() * 4)]}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
