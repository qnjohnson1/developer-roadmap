import React from 'react';
import { Week } from '../../../shared/types';
import { Calendar } from 'lucide-react';
import TimeBlock from './TimeBlock';

interface WeekBreakdownProps {
  week: Week;
}

const WeekBreakdown: React.FC<WeekBreakdownProps> = ({ week }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="text-purple-400" size={16} />
        <h4 className="font-medium text-sm">
          Week {week.number}: {week.title}
        </h4>
      </div>
      
      {week.focus && (
        <p className="text-xs text-gray-400 mb-3">Focus: {week.focus}</p>
      )}

      <div className="space-y-3">
        {week.days?.map((day) => (
          <div key={day.id} className="space-y-2">
            <h5 className="text-sm font-medium text-gray-300">{day.dayName}</h5>
            <div className="flex flex-wrap gap-2">
              {day.timeBlocks?.map((block) => (
                <TimeBlock key={block.id} block={block} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekBreakdown;