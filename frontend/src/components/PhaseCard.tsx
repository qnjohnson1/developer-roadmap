import React from 'react';
import { Phase } from '../../../shared/types';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';
import MonthCard from './MonthCard';

interface PhaseCardProps {
  phase: Phase;
  isExpanded: boolean;
  onToggle: () => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ phase, isExpanded, onToggle }) => {
  // Calculate phase progress
  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    phase.months?.forEach((month) => {
      month.weeks?.forEach((week) => {
        week.days?.forEach((day) => {
          day.timeBlocks?.forEach((block) => {
            total++;
            if (block.completed) completed++;
          });
        });
      });
    });

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <div className="card">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronDown className="text-gray-400" size={20} />
              ) : (
                <ChevronRight className="text-gray-400" size={20} />
              )}
              <h2 className="text-xl font-semibold">
                Phase {phase.number}: {phase.title}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-400">{progress}%</span>
            </div>
          </div>
          <p className="text-gray-400 mt-1">{phase.goal}</p>
        </div>
      </div>

      {isExpanded && phase.months && (
        <div className="mt-6 space-y-4">
          {phase.months.map((month) => (
            <MonthCard key={month.id} month={month} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PhaseCard;