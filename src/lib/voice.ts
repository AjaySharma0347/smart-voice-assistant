import { Platform } from 'react-native';

interface VoiceRecognitionResult {
  text: string;
  confidence: number;
}

export async function processVoiceWithGoogleCloud(audioData: string): Promise<VoiceRecognitionResult> {
  if (!process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY) {
    throw new Error('Google Cloud API key is not configured. Please add EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY to your .env file.');
  }

  try {
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    const formattedAudioData = audioData.startsWith('data:audio')
      ? audioData.split('base64,')[1]
      : audioData;

    // Using Google Cloud Speech-to-Text API with API key in query parameter
    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000,
          languageCode: 'en-US',
          model: 'default',
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: formattedAudioData,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Details:', errorData);
      throw new Error(
        `API request failed: ${response.status} - ${
          errorData?.error?.message || 'Unknown error'
        }`
      );
    }

    const data = await response.json();
    
    if (!data.results?.[0]?.alternatives?.[0]) {
      console.error('Unexpected API response:', data);
      throw new Error('No transcription received from the API');
    }

    const result = data.results[0].alternatives[0];

    return {
      text: result.transcript,
      confidence: result.confidence || 1.0,
    };
  } catch (error) {
    console.error('Error processing voice with Google Cloud:', error);
    if (error instanceof Error) {
      throw new Error(`Voice processing failed: ${error.message}`);
    }
    throw new Error('Failed to process voice input. Please try again.');
  }
}

export async function processVoiceWithDeepseek(audioData: string): Promise<VoiceRecognitionResult> {
  if (!process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY) {
    throw new Error('Deepseek API key is not configured. Please add EXPO_PUBLIC_DEEPSEEK_API_KEY to your .env file.');
  }

  try {
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    // Extract the base64 data if it's a data URL
    const formattedAudioData = audioData.startsWith('data:audio')
      ? audioData.split('base64,')[1]
      : audioData;

    // Create form data for the audio file
    const formData = new FormData();
    
    // Create a Blob from the base64 string directly
    const audioBlob = await fetch(`data:audio/wav;base64,${formattedAudioData}`).then(res => res.blob());
    
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    formData.append('language', 'en');

    // Using the Deepseek API endpoint with proper authentication and form data
    const response = await fetch('https://api.deepseek.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API Error Details:', errorData);
      throw new Error(
        `API request failed: ${response.status} - ${
          errorData?.error?.message || errorData?.message || 'Unknown error'
        }`
      );
    }

    const data = await response.json();
    
    if (!data.text) {
      console.error('Unexpected API response:', data);
      throw new Error('No transcription received from the API');
    }

    return {
      text: data.text,
      confidence: data.confidence || 1.0,
    };
  } catch (error) {
    console.error('Error processing voice with Deepseek:', error);
    if (error instanceof Error) {
      throw new Error(`Voice processing failed: ${error.message}`);
    }
    throw new Error('Failed to process voice input. Please try again.');
  }
}