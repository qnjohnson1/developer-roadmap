import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { progressApi } from '../services/api';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  ArrowRight,
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: overview, isLoading } = useQuery({
    queryKey: ['progress-overview'],
    queryFn: progressApi.getOverview,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Track your learning progress and stay motivated</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Target className="text-purple-400" size={24} />
            </div>
            <span className="text-2xl font-bold">{overview?.overallProgress || 0}%</span>
          </div>
          <h3 className="text-gray-400 text-sm">Overall Progress</h3>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Clock className="text-blue-400" size={24} />
            </div>
            <span className="text-2xl font-bold">{overview?.totalHoursInvested || 0}h</span>
          </div>
          <h3 className="text-gray-400 text-sm">Time Invested</h3>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Zap className="text-green-400" size={24} />
            </div>
            <span className="text-2xl font-bold">{overview?.currentStreak || 0}</span>
          </div>
          <h3 className="text-gray-400 text-sm">Day Streak</h3>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <TrendingUp className="text-orange-400" size={24} />
            </div>
            <span className="text-2xl font-bold">
              {overview?.completedTimeBlocks || 0}/{overview?.totalTimeBlocks || 0}
            </span>
          </div>
          <h3 className="text-gray-400 text-sm">Tasks Completed</h3>
        </div>
      </div>

      {/* Phase Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Phase Progress</h2>
          <Link to="/roadmap" className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
            View Roadmap <ArrowRight size={16} />
          </Link>
        </div>

        <div className="space-y-4">
          {overview?.phaseProgress?.map((phase) => (
            <div key={phase.phaseId}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{phase.phaseTitle}</h3>
                <span className="text-sm text-gray-400">
                  {phase.completedBlocks}/{phase.totalBlocks} tasks
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${phase.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/roadmap" className="card hover:border-purple-600 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Continue Learning</h3>
              <p className="text-gray-400 text-sm">Pick up where you left off</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-purple-400 transition-colors" size={24} />
          </div>
        </Link>

        <Link to="/resources" className="card hover:border-purple-600 transition-colors group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Browse Resources</h3>
              <p className="text-gray-400 text-sm">Access learning materials</p>
            </div>
            <ArrowRight className="text-gray-400 group-hover:text-purple-400 transition-colors" size={24} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;