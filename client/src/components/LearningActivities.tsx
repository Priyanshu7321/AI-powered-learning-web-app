import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Game } from "@/lib/gameData";
import { 
  FileText, Mic, BookOpen, 
  FileTextIcon, MicIcon, BookOpenIcon 
} from "lucide-react";

interface LearningActivitiesProps {
  games: Game[];
  language: 'en' | 'hi';
}

export default function LearningActivities({ games, language }: LearningActivitiesProps) {
  const translations = {
    en: {
      title: "Learning Games",
      minutes: "min",
      playButton: "Play"
    },
    hi: {
      title: "सीखने वाले खेल",
      minutes: "मिनट",
      playButton: "खेलें"
    }
  };

  const t = translations[language];

  return (
    <section className="mb-10">
      <h2 className="text-3xl font-bold text-dark mb-6 font-comic flex items-center">
        <i className="ri-game-line text-primary mr-3"></i>
        {t.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="game-card bg-white rounded-2xl overflow-hidden shadow-lg border-t-8" style={{ borderColor: game.color }}>
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                {game.icon === "FileText" && <FileText className="w-24 h-24 text-gray-400" />}
                {game.icon === "Mic" && <Mic className="w-24 h-24 text-gray-400" />}
                {game.icon === "BookOpen" && <BookOpen className="w-24 h-24 text-gray-400" />}
              </div>
              <div className="absolute top-2 right-2 bg-accent rounded-full px-3 py-1 text-dark font-bold text-sm">
                <i className="ri-star-fill mr-1"></i>
                <span>{language === 'en' ? `Level ${game.level}` : `स्तर ${game.level}`}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2 font-comic" style={{ color: game.color }}>
                {language === 'en' ? game.name : game.nameHi}
              </h3>
              <p className="text-dark opacity-70 mb-4">
                {language === 'en' ? game.description : game.descriptionHi}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex">
                  <i className="ri-time-line mr-1 text-purple"></i>
                  <span className="text-sm text-purple font-medium">{game.duration} {t.minutes}</span>
                </div>
                <Link href={`/game/${game.id}`}>
                  <Button 
                    className="text-white font-bold py-3 px-6 rounded-full text-lg shadow flex items-center gap-2 h-auto" 
                    style={{ backgroundColor: game.color }}
                  >
                    <i className="ri-play-fill"></i>
                    {t.playButton}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
