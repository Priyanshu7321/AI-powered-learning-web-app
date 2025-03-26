// No imports needed

export interface Phrase {
  id: number;
  text: string;  // English text
  textHi: string;  // Hindi text
  audioUrl?: string;
}

export interface Game {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  level: number;
  duration: number;
  color: string;
  phrases: Phrase[];
}

export const games: Game[] = [
  {
    id: "wordMatch",
    name: "Word Match",
    nameHi: "शब्द मिलान",
    description: "Listen to the word and select the matching picture!",
    descriptionHi: "शब्द सुनें और मिलती हुई तस्वीर चुनें!",
    icon: "FileText",
    level: 2,
    duration: 5,
    color: "#FF6B6B",
    phrases: [
      { id: 1, text: "apple", textHi: "सेब" },
      { id: 2, text: "dog", textHi: "कुत्ता" },
      { id: 3, text: "cat", textHi: "बिल्ली" },
      { id: 4, text: "banana", textHi: "केला" },
      { id: 5, text: "book", textHi: "किताब" }
    ]
  },
  {
    id: "speakRepeat",
    name: "Speak & Repeat",
    nameHi: "बोलो और दोहराओ",
    description: "Listen to the phrase and try to repeat it correctly!",
    descriptionHi: "वाक्यांश सुनें और इसे सही ढंग से दोहराने का प्रयास करें!",
    icon: "Mic",
    level: 1,
    duration: 8,
    color: "#4ECDC4",
    phrases: [
      { id: 1, text: "I see a red apple", textHi: "मुझे एक लाल सेब दिखता है" },
      { id: 2, text: "The dog is running", textHi: "कुत्ता दौड़ रहा है" },
      { id: 3, text: "I like to read books", textHi: "मुझे किताबें पढ़ना पसंद है" },
      { id: 4, text: "The sky is blue", textHi: "आकाश नीला है" },
      { id: 5, text: "Good morning, how are you?", textHi: "सुप्रभात, आप कैसे हैं?" }
    ]
  },
  {
    id: "storyTime",
    name: "Story Time",
    nameHi: "कहानी का समय",
    description: "Listen to a story and answer questions with your voice!",
    descriptionHi: "एक कहानी सुनें और अपनी आवाज से प्रश्नों के उत्तर दें!",
    icon: "BookOpen",
    level: 3,
    duration: 10,
    color: "#6A2C70",
    phrases: [
      { id: 1, text: "Once upon a time, there was a little rabbit", textHi: "एक समय की बात है, एक छोटा खरगोश था" },
      { id: 2, text: "The rabbit liked to hop and play", textHi: "खरगोश कूदना और खेलना पसंद करता था" },
      { id: 3, text: "One day, he met a friendly turtle", textHi: "एक दिन, वह एक मित्रवत कछुए से मिला" },
      { id: 4, text: "They became good friends", textHi: "वे अच्छे दोस्त बन गए" },
      { id: 5, text: "They played together every day", textHi: "वे हर दिन साथ खेलते थे" }
    ]
  }
];

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};
