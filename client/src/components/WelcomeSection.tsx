import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import OwlMascot from "./OwlMascot";

interface WelcomeSectionProps {
  userName: string;
  language: 'en' | 'hi';
}

export default function WelcomeSection({ userName, language }: WelcomeSectionProps) {
  const welcomeMessages = {
    en: {
      welcome: `Hi ${userName}! Ready to learn today?`,
      subtitle: "Let's practice some new words and play fun games!",
      startButton: "Start Today's Activities",
      progressButton: "My Progress"
    },
    hi: {
      welcome: `नमस्ते ${userName}! आज सीखने के लिए तैयार हैं?`,
      subtitle: "आइए कुछ नए शब्द अभ्यास करें और मज़ेदार गेम खेलें!",
      startButton: "आज की गतिविधियां शुरू करें",
      progressButton: "मेरी प्रगति"
    }
  };

  const message = welcomeMessages[language];

  return (
    <section className="mb-10 relative">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-white rounded-2xl p-6 shadow-lg">
        <div className="relative flex-shrink-0">
          <OwlMascot size="medium" withAudio={true} />
        </div>
        <div className="flex-grow">
          <div className="speech-bubble bg-white rounded-2xl p-5 shadow-md mb-6">
            <h2 className="text-3xl font-bold text-purple mb-2 font-comic">{message.welcome}</h2>
            <p className="text-xl text-dark opacity-80 font-quicksand">{message.subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
            <Link href="/game/wordMatch">
              <Button className="bg-accent hover:bg-opacity-80 transition text-dark font-bold py-4 px-8 rounded-full text-xl shadow-md flex items-center gap-2 h-auto">
                <i className="ri-play-circle-line text-2xl"></i>
                <span>{message.startButton}</span>
              </Button>
            </Link>
            <Link href="/progress">
              <Button className="bg-white border-2 border-secondary hover:bg-secondary hover:text-white transition text-secondary font-bold py-4 px-8 rounded-full text-xl shadow-md flex items-center gap-2 h-auto">
                <i className="ri-medal-line text-2xl"></i>
                <span>{message.progressButton}</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
