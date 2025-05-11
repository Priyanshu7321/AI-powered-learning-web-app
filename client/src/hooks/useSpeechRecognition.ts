import { useState, useCallback } from 'react';
import { pipeline } from '@xenova/transformers';

interface SpeechRecognitionOptions {
  onResult: (result: { isCorrect: boolean; confidence: number; feedback: string }) => void;
  onError: (error: Error) => void;
  onVoiceDetected?: (isDetected: boolean) => void;
}

export function useSpeechRecognition({ onResult, onError, onVoiceDetected }: SpeechRecognitionOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [transcriber, setTranscriber] = useState<any>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [voiceCheckInterval, setVoiceCheckInterval] = useState<NodeJS.Timeout | null>(null);

  const initializeTranscriber = useCallback(async () => {
    try {
      const transcriber = await pipeline('automatic-speech-recognition', 'Xenova/wav2vec2-base-960h');
      setTranscriber(transcriber);
    } catch (error) {
      onError(error as Error);
    }
  }, [onError]);

  const checkVoiceActivity = useCallback(() => {
    if (!analyser || !onVoiceDetected) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate RMS (Root Mean Square) of the audio signal
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);

    // Lower threshold for better sensitivity
    const isVoiceDetected = rms > 5; // Adjusted threshold

    onVoiceDetected(isVoiceDetected);
  }, [analyser, onVoiceDetected]);

  const startRecording = useCallback(async () => {
    try {
      if (!transcriber) {
        await initializeTranscriber();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      const chunks: Blob[] = [];

      // Set up audio context and analyser for voice detection
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();
      analyserNode.fftSize = 2048;
      analyserNode.smoothingTimeConstant = 0.8;
      source.connect(analyserNode);

      setAudioContext(context);
      setAnalyser(analyserNode);

      // Start voice activity detection with more frequent checks
      const interval = setInterval(checkVoiceActivity, 50);
      setVoiceCheckInterval(interval);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (voiceCheckInterval) {
          clearInterval(voiceCheckInterval);
        }
        if (audioContext) {
          audioContext.close();
        }
        setAudioChunks(chunks);
      };

      recorder.start(100); // Collect data every 100ms
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      onError(error as Error);
    }
  }, [transcriber, initializeTranscriber, onError, checkVoiceActivity, voiceCheckInterval]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (onVoiceDetected) {
        onVoiceDetected(false);
      }
      if (voiceCheckInterval) {
        clearInterval(voiceCheckInterval);
      }
    }
  }, [mediaRecorder, onVoiceDetected, voiceCheckInterval]);

  const evaluatePhrase = useCallback(async (targetPhrase: string) => {
    try {
      if (!transcriber || audioChunks.length === 0) {
        throw new Error('No audio data available');
      }

      const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioData = new Float32Array(arrayBuffer);

      const result = await transcriber(audioData);
      const transcribedText = result.text.toLowerCase();
      const targetText = targetPhrase.toLowerCase();

      const isCorrect = transcribedText.includes(targetText);
      const confidence = result.confidence || 0;

      let feedback = '';
      if (isCorrect) {
        if (confidence > 0.8) {
          feedback = 'Excellent pronunciation!';
        } else if (confidence > 0.6) {
          feedback = 'Good job! Keep practicing.';
        } else {
          feedback = 'Almost there! Try speaking a bit more clearly.';
        }
      } else {
        feedback = 'Not quite right. Please try again.';
      }

      onResult({ isCorrect, confidence, feedback });
      setAudioChunks([]);
    } catch (error) {
      console.error('Error evaluating phrase:', error);
      onError(error as Error);
    }
  }, [transcriber, audioChunks, onResult, onError]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    evaluatePhrase
  };
} 