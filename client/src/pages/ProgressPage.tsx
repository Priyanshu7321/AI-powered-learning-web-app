import { useState } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { UserProgress, GameProgress } from '@shared/schema';
import { games } from '@/lib/gameData';

export default function ProgressPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Fetch user progress from API
  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ['/api/progress'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch game progress for all games
  const { data: gameProgress = [], isLoading: gameProgressLoading } = useQuery<GameProgress[]>({
    queryKey: ['/api/game-progress/all'],
    staleTime: 60000, // 1 minute,
    select: (data) => Array.isArray(data) ? data : [],
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  const translations = {
    en: {
      title: "My Learning Progress",
      overview: "Overview",
      games: "Games",
      activities: "Activities",
      todayStars: "Today's Stars",
      totalStars: "Total Stars",
      streak: "Learning Streak",
      days: "days",
      wordsLearned: "Words Learned",
      gamesCompleted: "Games Completed",
      lastActive: "Last Active",
      backHome: "Back to Home",
      level: "Level",
      completed: "Completed",
      bestScore: "Best Score",
      noGames: "You haven't played any games yet. Start learning to see your progress!"
    },
    hi: {
      title: "मेरी सीखने की प्रगति",
      overview: "अवलोकन",
      games: "खेल",
      activities: "गतिविधियां",
      todayStars: "आज के सितारे",
      totalStars: "कुल सितारे",
      streak: "सीखने का क्रम",
      days: "दिन",
      wordsLearned: "सीखे गए शब्द",
      gamesCompleted: "पूरे किए गए खेल",
      lastActive: "अंतिम सक्रिय",
      backHome: "होम पर वापस जाएं",
      level: "स्तर",
      completed: "पूर्ण",
      bestScore: "सर्वश्रेष्ठ स्कोर",
      noGames: "आपने अभी तक कोई गेम नहीं खेला है। अपनी प्रगति देखने के लिए सीखना शुरू करें!"
    }
  };

  const t = translations[language];

  // Fallback data
  const userProgress = progress || {
    id: 1,
    userId: 1,
    todayStars: 0,
    streak: 0,
    wordsLearned: 0,
    gamesCompleted: 0,
    lastActive: new Date().toISOString()
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header
        language={language}
        onLanguageChange={setLanguage}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-dark font-comic">{t.title}</h1>
          <Link href="/">
            <Button className="bg-accent hover:bg-opacity-80 text-dark flex items-center gap-2">
              <i className="ri-home-line"></i>
              {t.backHome}
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="games">{t.games}</TabsTrigger>
            <TabsTrigger value="activities">{t.activities}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="bg-accent bg-opacity-10 pb-2">
                  <CardTitle className="flex items-center">
                    <i className="ri-star-fill text-accent mr-2"></i>
                    {t.todayStars}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-4xl font-bold text-primary">{userProgress.todayStars}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-secondary bg-opacity-10 pb-2">
                  <CardTitle className="flex items-center">
                    <i className="ri-fire-fill text-secondary mr-2"></i>
                    {t.streak}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-4xl font-bold text-secondary">{userProgress.streak} {t.days}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-purple bg-opacity-10 pb-2">
                  <CardTitle className="flex items-center">
                    <i className="ri-book-open-fill text-purple mr-2"></i>
                    {t.wordsLearned}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-4xl font-bold text-purple">{userProgress.wordsLearned}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-primary bg-opacity-10 pb-2">
                  <CardTitle className="flex items-center">
                    <i className="ri-gamepad-fill text-primary mr-2"></i>
                    {t.gamesCompleted}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-4xl font-bold text-primary">{userProgress.gamesCompleted}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-green bg-opacity-10 pb-2">
                  <CardTitle className="flex items-center">
                    <i className="ri-time-fill text-green mr-2"></i>
                    {t.lastActive}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-xl font-bold text-green">
                    {new Date(userProgress.lastActive).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="games">
            {!gameProgress || gameProgress.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-xl text-gray-500">{t.noGames}</p>
                  <Link href="/game/wordMatch">
                    <Button className="mt-4 bg-primary text-white">
                      <i className="ri-gamepad-fill mr-2"></i>
                      Start Playing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((game) => {
                  const progress = gameProgress?.find(p => p.gameId === game.id);
                  return (
                    <Card key={game.id}>
                      <CardHeader className="pb-2" style={{ backgroundColor: `${game.color}20` }}>
                        <CardTitle className="flex items-center justify-between">
                          <span>{language === 'en' ? game.name : game.nameHi}</span>
                          <span className="text-sm font-normal bg-accent rounded-full px-3 py-1">
                            {t.level} {game.level}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">{t.completed}:</span>
                          <span className="font-bold" style={{ color: game.color }}>
                            {progress?.timesCompleted || 0} times
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">{t.bestScore}:</span>
                          <span className="font-bold" style={{ color: game.color }}>
                            {progress?.bestScore || 0} points
                          </span>
                        </div>
                        {progress?.lastEvaluation && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Last Evaluation:</span>
                            <span className="font-bold" style={{ color: game.color }}>
                              {progress.lastEvaluation}
                            </span>
                          </div>
                        )}
                        {progress?.lastAttemptDate && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Last Attempt:</span>
                            <span className="font-bold" style={{ color: game.color }}>
                              {new Date(progress.lastAttemptDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <Link href={`/game/${game.id}`}>
                          <Button 
                            className="w-full mt-4 text-white"
                            style={{ backgroundColor: game.color }}
                          >
                            <i className="ri-play-fill mr-2"></i>
                            Play
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activities">
            <Card className="bg-white shadow-md">
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-xl font-medium mb-2">Coming Soon!</p>
                  <p className="text-gray-500">We're working on tracking all your learning activities.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
