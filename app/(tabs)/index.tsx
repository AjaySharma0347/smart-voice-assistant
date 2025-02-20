import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { VoiceRecorder } from '../../src/components/VoiceRecorder';
import { ActionSummary } from '../../src/components/ActionSummary';
import { ProcessingIndicator } from '../../src/components/ProcessingIndicator';
import { ErrorMessage } from '../../src/components/ErrorMessage';
import { ActionEditor } from '../../src/components/ActionEditor';
import { extractActionsFromText } from '../../src/lib/nlp';
import { shareAction, saveAction } from '../../src/lib/actions';
import type { Action } from '../../src/lib/nlp';

export default function RecordScreen() {
  const [transcript, setTranscript] = useState('');
  const [extractedActions, setExtractedActions] = useState<Action[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingAction, setEditingAction] = useState<Action | null>(null);

  const handleTranscriptionResult = async (text: string) => {
    try {
      setTranscript(text);
      setIsProcessing(true);
      setError(null);

      const actions = await extractActionsFromText(text);
      setExtractedActions(actions);
    } catch (err) {
      console.error('Error processing transcript:', err);
      setError('Failed to process transcript. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingStart = () => {
    setTranscript('');
    setExtractedActions([]);
    setError(null);
  };

  const handleRecordingEnd = () => {
    // Optional: Add any cleanup or state reset logic here
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleShareAction = async (action: Action) => {
    try {
      await shareAction(action);
    } catch (err) {
      setError('Failed to share action. Please try again.');
    }
  };

  const handleSaveAction = async (action: Action) => {
    try {
      await saveAction(action);
      setExtractedActions(prev => prev.filter(a => a.id !== action.id));
    } catch (err) {
      setError('Failed to save action. Please try again.');
    }
  };

  const handleUpdateAction = async (updatedAction: Action) => {
    try {
      setExtractedActions(prev =>
        prev.map(a => (a.id === updatedAction.id ? updatedAction : a))
      );
      setEditingAction(null);
    } catch (err) {
      setError('Failed to update action. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <VoiceRecorder
        onTranscriptionResult={handleTranscriptionResult}
        onRecordingStart={handleRecordingStart}
        onRecordingEnd={handleRecordingEnd}
        onError={handleError}
      />

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
          }}
        />
      )}

      {isProcessing && (
        <ProcessingIndicator status="processing" />
      )}

      {editingAction ? (
        <ActionEditor
          action={editingAction}
          onSave={handleUpdateAction}
          onCancel={() => setEditingAction(null)}
        />
      ) : (
        extractedActions.length > 0 && (
          <ActionSummary
            actions={extractedActions}
            onShare={handleShareAction}
            onEdit={setEditingAction}
            onSave={handleSaveAction}
          />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});