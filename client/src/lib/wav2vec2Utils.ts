
import { Tensor } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs';
import { pipeline } from '@xenova/transformers';

let speechRecognizer: any = null;

export async function initializeWav2vec2() {
  if (!speechRecognizer) {
    speechRecognizer = await pipeline('automatic-speech-recognition', 'facebook/wav2vec2-base-960h');
  }
  return speechRecognizer;
}

export async function transcribeAudio(audioData: Float32Array): Promise<string> {
  try {
    const recognizer = await initializeWav2vec2();
    const result = await recognizer(audioData, {
      chunk_length_s: 30,
      stride_length_s: 5
    });
    return result.text;
  } catch (error) {
    console.error('Wav2vec2 transcription error:', error);
    throw error;
  }
}
