import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActiveGameSection from '@/components/ActiveGameSection';
import { getGameById } from '@/lib/gameData';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { GameProgress } from '@shared/schema';

export default function GamePage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [location, setLocation] = useLocation();
  const { gameId } = useParams();
  
  const game = getGameById(gameId);
  
  // If game doesn't exist, redirect to home
  useEffect(() => {
    if (!game) {
      setLocation('/');
    }
  }, [game, setLocation]);
  
  // Fetch game progress
  const { data: gameProgress, isLoading } = useQuery<GameProgress>({
    queryKey: ['/api/game-progress', gameId],
    staleTime: 30000, // 30 seconds
  });
  
  // Update progress mutation
  const { mutate: updateProgress } = useMutation({
    mutationFn: (progress: Partial<GameProgress>) => 
      apiRequest('POST', '/api/game-progress', { gameId, ...progress }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/game-progress', gameId] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    }
  });
  
  const handleCloseGame = () => {
    // Invalidate queries to refresh progress data
    queryClient.invalidateQueries({ queryKey: ['/api/game-progress'] });
    queryClient.invalidateQueries({ queryKey: ['/api/game-progress/all'] });
    queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    setLocation('/');
  };
  
  if (!game) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <ActiveGameSection 
          game={game}
          onClose={handleCloseGame}
          language={language}
        />
      </main>
      
      <Footer />
    </div>
  );
}
