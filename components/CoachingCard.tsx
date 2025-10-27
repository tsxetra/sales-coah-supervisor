
import React from 'react';
import type { CoachingCardData } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';

interface CoachingCardProps {
  data: CoachingCardData;
}

const CoachingCard: React.FC<CoachingCardProps> = ({ data }) => {
  return (
    <div className="bg-dark-300 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">AI Coaching Card</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
            <CheckIcon className="w-6 h-6" />
            What Went Well
          </h3>
          <ul className="space-y-2 pl-4">
            {data.whatWentWell.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-400 mr-2 mt-1">&#10003;</span>
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
            <XIcon className="w-6 h-6" />
            Missed Opportunities
          </h3>
          <ul className="space-y-2 pl-4">
            {data.missedOpportunities.map((point, index) => (
               <li key={index} className="flex items-start">
                <span className="text-red-400 mr-2 mt-1">&#10007;</span>
                <span className="text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CoachingCard;
