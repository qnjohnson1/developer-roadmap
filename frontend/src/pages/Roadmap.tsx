import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roadmapApi } from '../services/api';
import PhaseCard from '../components/PhaseCard';
import { Loader2 } from 'lucide-react';

const Roadmap: React.FC = () => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const { data: phases, isLoading, error } = useQuery({
    queryKey: ['roadmap'],
    queryFn: roadmapApi.getRoadmap,
  });

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId);
      } else {
        newSet.add(phaseId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-400" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Failed to load roadmap</p>
      </div>
    );
  }

  if (!phases || phases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No roadmap data available yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Your roadmap will appear here once it's set up.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Developer Roadmap</h1>
        <p className="text-gray-400">Your personalized learning path</p>
      </div>

      <div className="space-y-6">
        {phases.map((phase) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isExpanded={expandedPhases.has(phase.id)}
            onToggle={() => togglePhase(phase.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Roadmap;