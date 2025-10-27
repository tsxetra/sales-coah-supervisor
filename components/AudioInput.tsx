
import React, { useState } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { UploadIcon } from './icons/UploadIcon';

interface AudioInputProps {
  onAnalyze: (transcript: string) => void;
  onAnalyzeDemo: () => void;
  error: string | null;
}

type InputMode = 'record' | 'upload';

const AudioInput: React.FC<AudioInputProps> = ({ onAnalyze, onAnalyzeDemo, error }) => {
  const [mode, setMode] = useState<InputMode>('record');
  const [recordedTranscript, setRecordedTranscript] = useState<string | null>(null);

  const handleRecordingStop = (fullTranscript: string) => {
    setRecordedTranscript(fullTranscript);
  };
  
  const { isRecording, transcript, startRecording, stopRecording } = useAudioRecorder(handleRecordingStop);

  const handleAnalyzeRecording = () => {
    if (recordedTranscript) {
      onAnalyze(recordedTranscript);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-dark-300 rounded-2xl shadow-2xl p-8">
      <div className="flex border-b border-dark-200 mb-6">
        <TabButton
          icon={<MicrophoneIcon />}
          label="Record Live"
          isActive={mode === 'record'}
          onClick={() => setMode('record')}
        />
        <TabButton
          icon={<UploadIcon />}
          label="Upload File (Demo)"
          isActive={mode === 'upload'}
          onClick={() => setMode('upload')}
        />
      </div>

      {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-6">{error}</div>}

      {mode === 'record' && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-center">Live Call Analysis</h2>
          <p className="text-gray-400 text-center mb-6">Record audio from your microphone for real-time transcription and analysis.</p>
          <div className="flex justify-center items-center my-8">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
                isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-secondary hover:bg-blue-500'
              } text-white shadow-lg`}
            >
              <MicrophoneIcon className="w-10 h-10" />
              {isRecording && <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>}
            </button>
          </div>
          <p className="text-center text-lg font-medium">{isRecording ? "Recording..." : "Ready to record"}</p>
          
          {(transcript || recordedTranscript) && (
             <div className="mt-6 p-4 bg-dark-200 rounded-lg max-h-40 overflow-y-auto border border-dark-100">
               <p className="text-gray-300 whitespace-pre-wrap">{transcript || recordedTranscript}</p>
             </div>
          )}

          {recordedTranscript && !isRecording && (
            <div className="mt-6 text-center">
              <button onClick={handleAnalyzeRecording} className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Analyze Recording
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'upload' && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-center">File Upload (Demonstration)</h2>
          <p className="text-gray-400 text-center mb-6">
            Since direct audio file processing is complex, this option uses a pre-written sample transcript to demonstrate the AI's analysis capabilities.
          </p>
          <div className="flex flex-col items-center p-8 border-2 border-dashed border-dark-200 rounded-lg bg-dark-100/50">
            <UploadIcon className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400 mb-4">Click below to analyze the sample call.</p>
            <button
              onClick={onAnalyzeDemo}
              className="px-6 py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors"
            >
              Analyze Sample Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface TabButtonProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
        isActive ? 'border-b-2 border-brand-secondary text-brand-secondary' : 'text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
)

export default AudioInput;
