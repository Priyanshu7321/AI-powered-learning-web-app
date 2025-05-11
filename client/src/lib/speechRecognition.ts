import { pipeline } from '@xenova/transformers';

class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private transcriber: any = null;
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load the wav2vec2 model
      this.transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/wav2vec2-base-960h'
      );
      this.isInitialized = true;
      console.log('Speech recognition model loaded successfully');
    } catch (error) {
      console.error('Error loading speech recognition model:', error);
      throw error;
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      // Transcribe the audio
      const result = await this.transcriber(arrayBuffer, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false
      });

      return result.text.toLowerCase().trim();
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }

  async evaluateSpeech(userSpeech: string, targetPhrase: string): Promise<{
    isCorrect: boolean;
    confidence: number;
    feedback: string;
  }> {
    // Simple string matching for now
    // You can implement more sophisticated matching logic here
    const normalizedUserSpeech = userSpeech.toLowerCase().trim();
    const normalizedTargetPhrase = targetPhrase.toLowerCase().trim();
    
    const isCorrect = normalizedUserSpeech === normalizedTargetPhrase;
    const confidence = isCorrect ? 1.0 : 0.0;
    
    let feedback = '';
    if (isCorrect) {
      feedback = 'Excellent pronunciation!';
    } else {
      feedback = 'Try again. Listen carefully to the pronunciation.';
    }

    return {
      isCorrect,
      confidence,
      feedback
    };
  }
}

export const speechRecognition = SpeechRecognitionService.getInstance(); 