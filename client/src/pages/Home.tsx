import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WelcomeSection from '@/components/WelcomeSection';
import LearningActivities from '@/components/LearningActivities';
import ProgressSection from '@/components/ProgressSection';
import { games } from '@/lib/gameData';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { UserProgress } from '@shared/schema';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [userName, setUserName] = useState('Lily');

  // Fetch user progress from API
  const { data: progress, isLoading } = useQuery<UserProgress>({
    queryKey: ['/api/progress'],
    staleTime: 60000, // 1 minute
  });

  // Fallback progress data in case the API call hasn't completed yet
  const defaultProgress: UserProgress = {
    id: 1,
    userId: 1,
    todayStars: 15,
    streak: 7,
    wordsLearned: 32,
    gamesCompleted: 12,
    lastActive: new Date().toISOString()
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        userName={userName}
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <WelcomeSection 
          userName={userName} 
          language={language} 
        />
        
        <LearningActivities 
          games={games} 
          language={language} 
        />
        
        <ProgressSection 
          progress={progress || defaultProgress}
          language={language}
        />
      </main>
      
      <Footer />
    </div>
  );
}
