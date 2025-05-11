// No imports needed

import { Game, Phrase } from '@shared/schema';

export const games: Game[] = [
  {
    id: 'wordMatch',
    name: 'Word Match',
    nameHi: 'शब्द मिलान',
    description: 'Match words with their meanings',
    descriptionHi: 'शब्दों को उनके अर्थ से मिलाएं',
    level: 1,
    color: '#4CAF50',
    icon: 'ri-book-open-line',
    phrases: [
      { id: 1, text: "apple", textHi: "सेब" },
      { id: 2, text: "dog", textHi: "कुत्ता" },
      { id: 3, text: "cat", textHi: "बिल्ली" },
      { id: 4, text: "banana", textHi: "केला" },
      { id: 5, text: "book", textHi: "किताब" }
    ]
  },
  {
    id: 'sentenceBuilder',
    name: 'Sentence Builder',
    nameHi: 'वाक्य बनाना',
    description: 'Build sentences from given words',
    descriptionHi: 'दिए गए शब्दों से वाक्य बनाएं',
    level: 2,
    color: '#2196F3',
    icon: 'ri-file-text-line',
    phrases: [
      { id: 1, text: "I see a red apple", textHi: "मुझे एक लाल सेब दिखता है" },
      { id: 2, text: "The dog is running", textHi: "कुत्ता दौड़ रहा है" },
      { id: 3, text: "I like to read books", textHi: "मुझे किताबें पढ़ना पसंद है" },
      { id: 4, text: "The sky is blue", textHi: "आकाश नीला है" },
      { id: 5, text: "Good morning, how are you?", textHi: "सुप्रभात, आप कैसे हैं?" }
    ]
  },
  {
    id: 'speechPractice',
    name: 'Speech Practice',
    nameHi: 'बोलने का अभ्यास',
    description: 'Practice speaking words and phrases',
    descriptionHi: 'शब्दों और वाक्यांशों को बोलने का अभ्यास करें',
    level: 3,
    color: '#9C27B0',
    icon: 'ri-mic-line',
    phrases: [
      { id: 1, text: "Hello, my name is", textHi: "नमस्ते, मेरा नाम है" },
      { id: 2, text: "I am learning English", textHi: "मैं अंग्रेजी सीख रहा हूं" },
      { id: 3, text: "Today is a sunny day", textHi: "आज धूप का दिन है" },
      { id: 4, text: "I like to play games", textHi: "मुझे खेल खेलना पसंद है" },
      { id: 5, text: "Thank you for teaching me", textHi: "मुझे सिखाने के लिए धन्यवाद" }
    ]
  },
  // New Math Games
  {
    id: 'numberCounting',
    name: 'Number Counting',
    nameHi: 'संख्या गिनती',
    description: 'Learn to count numbers and basic addition',
    descriptionHi: 'संख्याओं को गिनना और बुनियादी जोड़ सीखें',
    level: 1,
    color: '#FF9800',
    icon: 'ri-numbers-line',
    phrases: [
      { id: 1, text: "one", textHi: "एक" },
      { id: 2, text: "two", textHi: "दो" },
      { id: 3, text: "three", textHi: "तीन" },
      { id: 4, text: "four", textHi: "चार" },
      { id: 5, text: "five", textHi: "पांच" }
    ]
  },
  {
    id: 'shapeMatch',
    name: 'Shape Match',
    nameHi: 'आकार मिलान',
    description: 'Match shapes and learn their names',
    descriptionHi: 'आकारों को मिलाएं और उनके नाम सीखें',
    level: 1,
    color: '#E91E63',
    icon: 'ri-shape-line',
    phrases: [
      { id: 1, text: "circle", textHi: "वृत्त" },
      { id: 2, text: "square", textHi: "वर्ग" },
      { id: 3, text: "triangle", textHi: "त्रिभुज" },
      { id: 4, text: "rectangle", textHi: "आयत" },
      { id: 5, text: "star", textHi: "तारा" }
    ]
  },
  {
    id: 'simpleAddition',
    name: 'Simple Addition',
    nameHi: 'सरल जोड़',
    description: 'Practice basic addition with visual aids',
    descriptionHi: 'दृश्य सहायता के साथ बुनियादी जोड़ का अभ्यास करें',
    level: 2,
    color: '#FF5722',
    icon: 'ri-add-line',
    phrases: [
      { id: 1, text: "one plus one equals two", textHi: "एक जमा एक बराबर दो" },
      { id: 2, text: "two plus two equals four", textHi: "दो जमा दो बराबर चार" },
      { id: 3, text: "three plus one equals four", textHi: "तीन जमा एक बराबर चार" },
      { id: 4, text: "two plus three equals five", textHi: "दो जमा तीन बराबर पांच" },
      { id: 5, text: "one plus four equals five", textHi: "एक जमा चार बराबर पांच" }
    ]
  },
  // New EVS Games
  {
    id: 'animalSounds',
    name: 'Animal Sounds',
    nameHi: 'पशु ध्वनियां',
    description: 'Learn animal names and their sounds',
    descriptionHi: 'पशुओं के नाम और उनकी ध्वनियां सीखें',
    level: 1,
    color: '#795548',
    icon: 'ri-volume-up-line',
    phrases: [
      { id: 1, text: "dog barks", textHi: "कुत्ता भौंकता है" },
      { id: 2, text: "cat meows", textHi: "बिल्ली म्याऊं करती है" },
      { id: 3, text: "cow moos", textHi: "गाय रंभाती है" },
      { id: 4, text: "lion roars", textHi: "शेर दहाड़ता है" },
      { id: 5, text: "bird chirps", textHi: "पक्षी चहकता है" }
    ]
  },
  {
    id: 'plantParts',
    name: 'Plant Parts',
    nameHi: 'पौधों के भाग',
    description: 'Learn about different parts of plants',
    descriptionHi: 'पौधों के विभिन्न भागों के बारे में जानें',
    level: 2,
    color: '#8BC34A',
    icon: 'ri-plant-line',
    phrases: [
      { id: 1, text: "root", textHi: "जड़" },
      { id: 2, text: "stem", textHi: "तना" },
      { id: 3, text: "leaf", textHi: "पत्ता" },
      { id: 4, text: "flower", textHi: "फूल" },
      { id: 5, text: "fruit", textHi: "फल" }
    ]
  },
  {
    id: 'weatherMatch',
    name: 'Weather Match',
    nameHi: 'मौसम मिलान',
    description: 'Learn about different weather conditions',
    descriptionHi: 'विभिन्न मौसम की स्थितियों के बारे में जानें',
    level: 2,
    color: '#03A9F4',
    icon: 'ri-sun-line',
    phrases: [
      { id: 1, text: "sunny day", textHi: "धूप का दिन" },
      { id: 2, text: "rainy day", textHi: "बारिश का दिन" },
      { id: 3, text: "cloudy day", textHi: "बादलों का दिन" },
      { id: 4, text: "windy day", textHi: "हवादार दिन" },
      { id: 5, text: "snowy day", textHi: "बर्फीला दिन" }
    ]
  },
  // New Picture Recognition Games
  {
    id: 'pictureSpeak',
    name: 'Picture Speak',
    nameHi: 'चित्र बोलना',
    description: 'Speak the names of objects in pictures',
    descriptionHi: 'चित्रों में वस्तुओं के नाम बोलें',
    level: 1,
    color: '#673AB7',
    icon: 'ri-image-line',
    phrases: [
      { id: 1, text: "ball", textHi: "गेंद" },
      { id: 2, text: "house", textHi: "घर" },
      { id: 3, text: "tree", textHi: "पेड़" },
      { id: 4, text: "car", textHi: "कार" },
      { id: 5, text: "sun", textHi: "सूरज" }
    ]
  },
  {
    id: 'colorMatch',
    name: 'Color Match',
    nameHi: 'रंग मिलान',
    description: 'Learn colors by matching objects',
    descriptionHi: 'वस्तुओं को मिलाकर रंग सीखें',
    level: 1,
    color: '#F44336',
    icon: 'ri-palette-line',
    phrases: [
      { id: 1, text: "red", textHi: "लाल" },
      { id: 2, text: "blue", textHi: "नीला" },
      { id: 3, text: "green", textHi: "हरा" },
      { id: 4, text: "yellow", textHi: "पीला" },
      { id: 5, text: "purple", textHi: "बैंगनी" }
    ]
  },
  {
    id: 'objectSort',
    name: 'Object Sort',
    nameHi: 'वस्तु छांटना',
    description: 'Sort objects by their categories',
    descriptionHi: 'वस्तुओं को उनकी श्रेणियों के अनुसार छांटें',
    level: 2,
    color: '#009688',
    icon: 'ri-layout-grid-line',
    phrases: [
      { id: 1, text: "fruits", textHi: "फल" },
      { id: 2, text: "vegetables", textHi: "सब्जियां" },
      { id: 3, text: "animals", textHi: "जानवर" },
      { id: 4, text: "vehicles", textHi: "वाहन" },
      { id: 5, text: "clothes", textHi: "कपड़े" }
    ]
  }
];

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};
