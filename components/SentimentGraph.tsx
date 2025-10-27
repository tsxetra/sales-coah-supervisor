
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SentimentDataPoint } from '../types';

interface SentimentGraphProps {
  data: SentimentDataPoint[];
}

const SentimentGraph: React.FC<SentimentGraphProps> = ({ data }) => {
  return (
    <div className="bg-dark-300 rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Prospect Engagement</h2>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis dataKey="time" stroke="#9ca3af" tickFormatter={(tick) => `${tick}%`} />
            <YAxis stroke="#9ca3af" domain={[0, 10]} />
            <Tooltip
                contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#f9fafb' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="engagement"
              name="Engagement Score"
              stroke="#3b82f6"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentGraph;
