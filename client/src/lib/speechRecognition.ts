import { pipeline, env } from '@xenova/transformers';

// Configure the environment
env.localModelPath = '/models'; // Store models locally
env.allowLocalModels = true;
env.useBrowserCache = true;

class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private transcriber: any = null;
  private isInitialized: boolean = false;
  private modelName = 'Xenova/whisper-small.en'; // Using a more reliable model

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
      console.log('Starting to load speech recognition model...');
      
      // Configure the pipeline with more options
      const options = {
        progress_callback: (progress: number) => {
          console.log(`Loading model: ${Math.round(progress * 100)}%`);
        },
        quantized: true, // Use quantized model for faster loading
        cache_dir: '/models', // Specify cache directory
        revision: 'main', // Use main branch
        use_cache: true // Enable caching
      };

      // Load the model
      this.transcriber = await pipeline(
        'automatic-speech-recognition',
        this.modelName,
        options
      );
      
      this.isInitialized = true;
      console.log('Speech recognition model loaded successfully');
    } catch (error) {
      console.error('Error loading speech recognition model:', error);
      // Try to provide more helpful error message
      if (error instanceof Error) {
        if (error.message.includes('<!DOCTYPE')) {
          console.error('Network error: Could not reach the model server. Please check your internet connection and try again.');
          console.error('If the problem persists, try clearing your browser cache and refreshing the page.');
        } else if (error.message.includes('JSON')) {
          console.error('Model loading error: Invalid response from server. Please try refreshing the page.');
          console.error('If the problem persists, try using a different browser or clearing your browser cache.');
        }
      }
      throw error;
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    if (!this.isInitialized) {
      console.log('Model not initialized, initializing now...');
      await this.initialize();
    }

    try {
      console.log('Converting audio blob to array buffer...');
      // Convert blob to array buffer
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      console.log('Starting transcription...');
      // Transcribe the audio
      const result = await this.transcriber(arrayBuffer, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: false
      });
      console.log('Transcription result:', result);

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