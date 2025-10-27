
import React from 'react';
import type { DiarizedTranscriptEntry } from '../types';

interface TranscriptViewProps {
  transcript: DiarizedTranscriptEntry[];
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  return (
    <div className="bg-dark-300 rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold mb-4 text-white">Call Transcript</h2>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {transcript.map((entry, index) => {
          const isSalesperson = entry.speaker.toLowerCase() === 'salesperson';
          return (
            <div
              key={index}
              className={`flex flex-col ${isSalesperson ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-md p-3 rounded-xl ${
                  isSalesperson ? 'bg-blue-900/50 rounded-bl-none' : 'bg-gray-700/50 rounded-br-none'
                }`}
              >
                <p className="text-sm font-bold mb-1 text-gray-300">{entry.speaker}</p>
                <p className="text-gray-100">{entry.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptView;
