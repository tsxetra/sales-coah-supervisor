
import React, { useState, useCallback } from 'react';
import type { AnalysisResult } from './types';
import { analyzeCallTranscript } from './services/geminiService';
import AudioInput from './components/AudioInput';
import Dashboard from './components/Dashboard';
import { sampleTranscript } from './constants';
import { SpinnerIcon } from './components/icons/SpinnerIcon';

type View = 'input' | 'dashboard';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('input');

  const handleAnalysis = useCallback(async (transcript: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeCallTranscript(transcript);
      setAnalysisResult(result);
      setView('dashboard');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
      setView('input'); 
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDemoAnalysis = useCallback(() => {
    handleAnalysis(sampleTranscript);
  }, [handleAnalysis]);

  const resetView = () => {
    setView('input');
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-dark-200 text-dark-content font-sans">
      <header className="bg-dark-300/50 backdrop-blur-sm p-4 border-b border-dark-300 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-brand-secondary">
            Sales Coach <span className="text-white">AI</span>
          </h1>
          {view === 'dashboard' && (
            <button
              onClick={resetView}
              className="px-4 py-2 bg-brand-secondary text-white rounded-lg hover:bg-blue-500 transition-colors duration-300"
            >
              Analyze New Call
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
            <SpinnerIcon className="w-16 h-16 text-brand-secondary" />
            <p className="text-xl mt-4 text-white">AI is analyzing your call...</p>
            <p className="text-gray-400 mt-1">This may take a moment.</p>
          </div>
        )}
        {view === 'input' && <AudioInput onAnalyze={handleAnalysis} onAnalyzeDemo={handleDemoAnalysis} error={error} />}
        {view === 'dashboard' && analysisResult && <Dashboard data={analysisResult} />}
      </main>
    </div>
  );
};

export default App;
