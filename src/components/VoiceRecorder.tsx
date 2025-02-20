import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { processVoiceWithGoogleCloud, processVoiceWithDeepseek } from '../lib/voice';

interface VoiceRecorderProps {
  onTranscriptionResult: (text: string) => void;
  onRecordingStart: () => void;
  onRecordingEnd: () => void;
  onError: (error: string) => void;
}

export function VoiceRecorder({
  onTranscriptionResult,
  onRecordingStart,
  onRecordingEnd,
  onError,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recording = useRef<Audio.Recording | null>(null);

  // Animation setup
  const pulseAnim = useAnimatedStyle(() => {
    if (!isRecording) return {};
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.2, { duration: 1000 }),
              withTiming(1, { duration: 1000 })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  const glowAnim = useAnimatedStyle(() => {
    if (!isRecording) return { opacity: 0 };
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.2, { duration: 1000 })
        ),
        -1,
        true
      ),
    };
  });

  useEffect(() => {
    async function setupAudio() {
      try {
        if (Platform.OS === 'web') {
          onError('Voice recording is not supported on web platforms.');
          return;
        }

        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          onError('Microphone permission not granted');
          return;
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (e) {
        console.error('Failed to initialize Audio:', e);
        onError('Audio initialization failed. Please check your device settings.');
      }
    }

    setupAudio();
    return () => {
      if (recording.current) {
        recording.current.stopAndUnloadAsync();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (Platform.OS === 'web') {
        onError('Voice recording is not supported on web platforms.');
        return;
      }

      setIsRecording(true);
      onRecordingStart();

      recording.current = new Audio.Recording();
      await recording.current.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.WAVE,
        },
        ios: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.wav,
        },
      });
      await recording.current.startAsync();
    } catch (err) {
      console.error('Failed to start recording:', err);
      onError('Failed to start recording. Please check your microphone permissions.');
      stopRecording();
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      onRecordingEnd();

      if (recording.current) {
        await recording.current.stopAndUnloadAsync();
        const uri = recording.current.getURI();
        recording.current = null;

        if (uri) {
          try {
            // Convert audio to base64
            const response = await fetch(uri);
            const blob = await response.blob();
            const reader = new FileReader();
            
            reader.onloadend = async () => {
              try {
                const base64Audio = reader.result as string;
                
                // First try Google Cloud Speech-to-Text
                try {
                  const googleResult = await processVoiceWithGoogleCloud(base64Audio);
                  onTranscriptionResult(googleResult.text);
                  setIsProcessing(false);
                  return;
                } catch (googleError) {
                  console.error('Google Cloud processing failed, falling back to Deepseek:', googleError);
                  
                  // Fallback to Deepseek if Google Cloud fails
                  const deepseekResult = await processVoiceWithDeepseek(base64Audio);
                  onTranscriptionResult(deepseekResult.text);
                }
              } catch (error) {
                onError(error instanceof Error ? error.message : 'Failed to process voice recording');
              } finally {
                setIsProcessing(false);
              }
            };

            reader.onerror = () => {
              setIsProcessing(false);
              onError('Failed to read audio file');
            };

            reader.readAsDataURL(blob);
          } catch (error) {
            setIsProcessing(false);
            onError('Failed to process audio file');
          }
        } else {
          setIsProcessing(false);
          onError('No audio recording found');
        }
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setIsProcessing(false);
      onError('Failed to stop recording.');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glowEffect, glowAnim]} />
      <Animated.View style={[styles.buttonWrapper, pulseAnim]}>
        <TouchableOpacity
          style={[
            styles.recordButton,
            isRecording && styles.recordingActive,
            isProcessing && styles.processingActive,
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}>
          <Ionicons
            name={isProcessing ? 'sync' : isRecording ? 'stop' : 'mic'}
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.recordingText}>
        {isProcessing
          ? 'Processing audio...'
          : isRecording
          ? 'Tap to stop recording'
          : 'Tap to start recording'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  buttonWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#00E5FF',
  },
  recordingActive: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  processingActive: {
    backgroundColor: '#00E5FF',
    borderColor: '#00E5FF',
  },
  glowEffect: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00E5FF',
    opacity: 0.3,
  },
  recordingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
  },
});