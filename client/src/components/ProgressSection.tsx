import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { UserProgress } from "@shared/schema";

interface ProgressSectionProps {
  progress: UserProgress;
  language: 'en' | 'hi';
}

export default function ProgressSection({ progress, language }: ProgressSectionProps) {
  const translations = {
    en: {
      title: "Your Progress",
      seeAll: "See All",
      todayStars: "Today's Stars",
      doingGreat: "You're doing great today!",
      learningStreak: "Learning Streak",
      keepItUp: "Keep it up!",
      wordsLearned: "Words Learned",
      buildingVocabulary: "You're building vocabulary!",
      days: "days",
    },
    hi: {
      title: "आपकी प्रगति",
      seeAll: "सभी देखें",
      todayStars: "आज के सितारे",
      doingGreat: "आप आज अच्छा कर रहे हैं!",
      learningStreak: "सीखने का क्रम",
      keepItUp: "ऐसे ही करते रहें!",
      wordsLearned: "सीखे गए शब्द",
      buildingVocabulary: "आप शब्दावली बना रहे हैं!",
      days: "दिन",
    }
  };

  const t = translations[language];

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-dark font-comic flex items-center">
          <i className="ri-bar-chart-box-line text-purple mr-3"></i>
          {t.title}
        </h2>
        <Link href="/progress">
          <Button className="text-purple hover:underline font-bold flex items-center bg-transparent" variant="link">
            {t.seeAll}
            <i className="ri-arrow-right-line ml-1"></i>
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-dark">{t.todayStars}</h3>
            <div className="bg-accent rounded-full w-10 h-10 flex items-center justify-center">
              <i className="ri-star-fill text-dark text-xl"></i>
            </div>
          </div>
          <p className="text-4xl font-bold text-primary mb-2">{progress.todayStars}</p>
          <p className="text-dark opacity-70">{t.doingGreat}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-dark">{t.learningStreak}</h3>
            <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center">
              <i className="ri-fire-fill text-white text-xl"></i>
            </div>
          </div>
          <p className="text-4xl font-bold text-secondary mb-2">{progress.streak} {t.days}</p>
          <p className="text-dark opacity-70">{t.keepItUp}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-xl text-dark">{t.wordsLearned}</h3>
            <div className="bg-purple rounded-full w-10 h-10 flex items-center justify-center">
              <i className="ri-book-open-fill text-white text-xl"></i>
            </div>
          </div>
          <p className="text-4xl font-bold text-purple mb-2">{progress.wordsLearned}</p>
          <p className="text-dark opacity-70">{t.buildingVocabulary}</p>
        </div>
      </div>
    </section>
  );
}
