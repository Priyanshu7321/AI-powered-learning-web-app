import { useState } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { UserProgress, GameProgress } from '@shared/schema';

export default function ParentDashboard() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Fetch user progress
  const { data: progress } = useQuery<UserProgress>({
    queryKey: ['/api/progress'],
    staleTime: 60000, // 1 minute
  });

  // Fetch game progress for all games
  const { data: gameProgress = [], isLoading: gameProgressLoading } = useQuery<GameProgress[]>({
    queryKey: ['/api/game-progress/all'],
    staleTime: 60000, // 1 minute
    select: (data) => Array.isArray(data) ? data : [data]
  });

  // Calculate total learning time (assuming each game takes 5 minutes)
  const totalLearningTime = Array.isArray(gameProgress) 
    ? gameProgress.reduce((total, game) => total + (game.timesPlayed || 0) * 5, 0)
    : 0;

  // Calculate weekly progress
  const weeklyProgress = Array(7).fill(0).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
      minutes: 0 // Initialize with 0 instead of random data
    };
  }).reverse();

  const translations = {
    en: {
      title: "Parent Dashboard",
      overview: "Overview",
      settings: "Settings",
      activity: "Activity",
      childProgress: "Child's Progress",
      learningTime: "Learning Time",
      thisWeek: "This Week",
      topSkills: "Top Skills",
      weakAreas: "Areas to Improve",
      weeklyReport: "Weekly Report",
      backToApp: "Back to App",
      minutes: "minutes today",
      downloadReport: "Download Report",
      changeSettings: "Change Settings"
    },
    hi: {
      title: "अभिभावक डैशबोर्ड",
      overview: "अवलोकन",
      settings: "सेटिंग्स",
      activity: "गतिविधि",
      childProgress: "बच्चे की प्रगति",
      learningTime: "सीखने का समय",
      thisWeek: "इस सप्ताह",
      topSkills: "शीर्ष कौशल",
      weakAreas: "सुधार के क्षेत्र",
      weeklyReport: "साप्ताहिक रिपोर्ट",
      backToApp: "ऐप पर वापस जाएं",
      minutes: "मिनट आज",
      downloadReport: "रिपोर्ट डाउनलोड करें",
      changeSettings: "सेटिंग्स बदलें"
    }
  };

  const t = translations[language];

  // Fallback data with all values set to 0
  const defaultProgress: UserProgress = {
    id: 1,
    userId: 1,
    todayStars: 0,
    streak: 0,
    wordsLearned: 0,
    gamesCompleted: 0,
    lastActive: new Date()
  };

  const userProgress = progress || defaultProgress;
  
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
              <i className="ri-arrow-left-line"></i>
              {t.backToApp}
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">{t.overview}</TabsTrigger>
            <TabsTrigger value="activity">{t.activity}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader className="bg-primary bg-opacity-10 pb-2">
                  <CardTitle>{t.childProgress}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Stars Earned:</span>
                    <span className="font-bold text-primary">{userProgress.todayStars}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Learning Streak:</span>
                    <span className="font-bold text-secondary">{userProgress.streak} days</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Words Learned:</span>
                    <span className="font-bold text-purple">{userProgress.wordsLearned}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Active:</span>
                    <span className="font-bold text-green">
                      {userProgress.lastActive?.toLocaleDateString() || 'Never'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-secondary bg-opacity-10 pb-2">
                  <CardTitle>{t.learningTime}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-secondary">
                        {totalLearningTime}
                      </p>
                      <p className="text-lg text-gray-600">
                        {language === 'en' ? 'minutes' : 'मिनट'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{t.thisWeek}:</p>
                    <div className="flex justify-between mt-2">
                      {weeklyProgress.map((day, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-secondary" 
                            style={{ height: `${(day.minutes / 30) * 100}px` }}
                          ></div>
                          <span className="text-xs mt-1">{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="bg-accent bg-opacity-10 pb-2">
                  <CardTitle>{t.topSkills}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Animal Names</span>
                      <span className="font-bold text-accent">☆☆☆☆☆</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Colors</span>
                      <span className="font-bold text-accent">☆☆☆☆☆</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Numbers</span>
                      <span className="font-bold text-accent">☆☆☆☆☆</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="bg-primary bg-opacity-10 pb-2">
                  <CardTitle>{t.weakAreas}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Complex Sentences</span>
                      <span className="font-bold text-primary">☆☆☆☆☆</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Pronouns</span>
                      <span className="font-bold text-primary">☆☆☆☆☆</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader className="bg-purple bg-opacity-10 pb-2">
                  <CardTitle>{t.weeklyReport}</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600 mb-4">
                    No progress data available yet. Start learning to see your progress!
                  </p>
                  <Button className="bg-purple text-white">
                    <i className="ri-download-line mr-2"></i>
                    {t.downloadReport}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Activity Tracking</h3>
                <p className="text-gray-500 mb-4">
                  No activity data available yet. Start learning to track your progress!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Account Settings</h3>
                <p className="text-gray-500 mb-4">
                  Here you can customize your child's learning experience, set daily limits, and configure notifications.
                </p>
                <Button className="bg-secondary text-white">
                  <i className="ri-settings-3-line mr-2"></i>
                  {t.changeSettings}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
