import React, { useState } from 'react';
import { Month } from '../../../shared/types';
import { ChevronDown, ChevronRight, BookOpen, ExternalLink } from 'lucide-react';
import { cn } from '../utils/cn';
import WeekBreakdown from './WeekBreakdown';
import ResourceList from './ResourceList';

interface MonthCardProps {
  month: Month;
}

const MonthCard: React.FC<MonthCardProps> = ({ month }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate month progress
  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    month.weeks?.forEach((week) => {
      week.days?.forEach((day) => {
        day.timeBlocks?.forEach((block) => {
          total++;
          if (block.completed) completed++;
        });
      });
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="text-gray-400" size={18} />
          ) : (
            <ChevronRight className="text-gray-400" size={18} />
          )}
          <h3 className="font-semibold">
            Month {month.number}: {month.title}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          {month.resources && month.resources.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <BookOpen size={16} />
              {month.resources.length}
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{progress}%</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {month.resources && month.resources.length > 0 && (
            <ResourceList resources={month.resources} />
          )}

          {month.weeks?.map((week) => (
            <WeekBreakdown key={week.id} week={week} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthCard;