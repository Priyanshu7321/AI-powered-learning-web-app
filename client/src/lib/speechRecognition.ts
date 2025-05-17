import { pipeline, env } from '@xenova/transformers';

// Configure the environment
env.localModelPath = '/models'; // Store models locally
env.allowLocalModels = true;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1; // Reduce thread count to prevent issues
env.allowRemoteModels = false; // Disable remote model loading
env.allowProgressCallback = true;

class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private transcriber: any = null;
  private isInitialized: boolean = false;
  private modelName = 'Xenova/wav2vec2-base-960h'; // Using wav2vec2 model
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private modelPath: string = '/models/wav2vec2-base-960h';

  private constructor() {}

  static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  private async checkModelFiles(): Promise<boolean> {
    try {
      const response = await fetch(`${this.modelPath}/config.json`);
      if (!response.ok) {
        console.error('Model config file not found');
        return false;
      }
      const config = await response.json();
      return !!config;
    } catch (error) {
      console.error('Error checking model files:', error);
      return false;
    }
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Starting to load speech recognition model...');
      
      // Check if model files exist locally
      const modelExists = await this.checkModelFiles();
      if (!modelExists) {
        throw new Error('Model files not found locally. Please ensure the model files are present in the /models directory.');
      }

      const options = {
        progress_callback: (progress: number) => {
          console.log(`Loading model: ${Math.round(progress * 100)}%`);
        },
        quantized: true,
        cache_dir: this.modelPath,
        revision: 'main',
        use_cache: true,
        model_type: 'wav2vec2',
        framework: 'onnx',
        local_files_only: true // Force using local files only
      };

      while (this.retryCount < this.maxRetries) {
        try {
          console.log('Attempting to load model...');
          this.transcriber = await pipeline(
            'automatic-speech-recognition',
            this.modelName,
            options
          );
          break;
        } catch (error) {
          this.retryCount++;
          console.warn(`Attempt ${this.retryCount} failed:`, error);
          
          if (this.retryCount === this.maxRetries) {
            throw new Error('Failed to load model after multiple attempts. Please check if the model files are properly downloaded and accessible.');
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, this.retryCount)));
        }
      }
      
      this.isInitialized = true;
      console.log('Speech recognition model loaded successfully');
    } catch (error) {
      console.error('Error loading speech recognition model:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('<!DOCTYPE')) {
          throw new Error('Network error: Could not reach the model server. Please ensure you have downloaded the model files locally.');
        } else if (error.message.includes('JSON')) {
          throw new Error('Model loading error: Invalid model files. Please ensure the model files are properly downloaded and not corrupted.');
        } else if (error.message.includes('CORS')) {
          throw new Error('CORS error: Please check your browser settings and ensure you have proper permissions.');
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