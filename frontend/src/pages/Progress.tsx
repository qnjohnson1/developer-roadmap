import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../services/api';
import { 
  TrendingUp, 
  Calendar,
  Clock,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

const Progress: React.FC = () => {
  const { data: overview } = useQuery({
    queryKey: ['progress-overview'],
    queryFn: progressApi.getOverview,
  });

  const { data: logsData } = useQuery({
    queryKey: ['progress-logs'],
    queryFn: () => progressApi.getLogs(20, 0),
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
        <p className="text-gray-400">Monitor your learning journey and achievements</p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Target className="text-purple-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview?.overallProgress || 0}%</p>
              <p className="text-sm text-gray-400">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overview?.overallProgress || 0}%` }}
            />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Clock className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview?.totalHoursInvested || 0}h</p>
              <p className="text-sm text-gray-400">Time Invested</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Activity className="text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">{overview?.currentStreak || 0}</p>
              <p className="text-sm text-gray-400">Day Streak</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <BarChart3 className="text-orange-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {overview?.completedTimeBlocks || 0}
              </p>
              <p className="text-sm text-gray-400">Tasks Done</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Breakdown */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Progress by Phase</h2>
        <div className="space-y-6">
          {overview?.phaseProgress?.map((phase) => (
            <div key={phase.phaseId}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-medium">{phase.phaseTitle}</h3>
                  <p className="text-sm text-gray-400">
                    {phase.completedBlocks} of {phase.totalBlocks} tasks completed
                  </p>
                </div>
                <span className="text-lg font-semibold">{phase.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        {logsData?.logs && logsData.logs.length > 0 ? (
          <div className="space-y-4">
            {logsData.logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-4 pb-4 border-b border-gray-800 last:border-0">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <Calendar className="text-gray-400" size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{log.timeBlock.description}</p>
                  <p className="text-sm text-gray-400">
                    {format(new Date(log.date), 'MMM d, yyyy')} • {formatDuration(log.actualDuration)}
                  </p>
                  {log.notes && (
                    <p className="text-sm text-gray-500 mt-1">{log.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">
            No activity logged yet. Start tracking your progress!
          </p>
        )}
      </div>
    </div>
  );
};

export default Progress;