
import React from 'react';
import type { AnalysisResult } from '../types';
import TranscriptView from './TranscriptView';
import SentimentGraph from './SentimentGraph';
import CoachingCard from './CoachingCard';

interface DashboardProps {
  data: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
      <div className="lg:col-span-3">
        <TranscriptView transcript={data.diarizedTranscript} />
      </div>
      <div className="lg:col-span-2 flex flex-col gap-8">
        <SentimentGraph data={data.sentimentAnalysis} />
        <CoachingCard data={data.coachingCard} />
      </div>
    </div>
  );
};

export default Dashboard;
