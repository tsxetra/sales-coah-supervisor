
export interface DiarizedTranscriptEntry {
  speaker: string;
  text: string;
}

export interface SentimentDataPoint {
  time: number; // Percentage of call duration
  engagement: number; // Score from 1-10
}

export interface CoachingCardData {
  whatWentWell: string[];
  missedOpportunities: string[];
}

export interface AnalysisResult {
  diarizedTranscript: DiarizedTranscriptEntry[];
  sentimentAnalysis: SentimentDataPoint[];
  coachingCard: CoachingCardData;
}
