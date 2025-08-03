import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roadmapApi } from '../services/api';
import { Resource } from '../../../shared/types';
import { BookOpen, Video, Globe, Wrench, ExternalLink, Check, Clock, Circle } from 'lucide-react';
import { cn } from '../utils/cn';

const Resources: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  
  const { data: phases, isLoading } = useQuery({
    queryKey: ['roadmap'],
    queryFn: roadmapApi.getRoadmap,
  });

  // Extract all resources from phases
  const allResources = React.useMemo(() => {
    const resources: Array<Resource & { monthTitle: string; phaseTitle: string }> = [];
    
    phases?.forEach((phase) => {
      phase.months?.forEach((month) => {
        month.resources?.forEach((resource) => {
          resources.push({
            ...resource,
            monthTitle: month.title,
            phaseTitle: phase.title,
          });
        });
      });
    });
    
    return resources;
  }, [phases]);

  // Filter resources
  const filteredResources = React.useMemo(() => {
    if (filter === 'all') return allResources;
    return allResources.filter((resource) => resource.status === filter);
  }, [allResources, filter]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'book':
        return BookOpen;
      case 'video':
        return Video;
      case 'website':
        return Globe;
      case 'tool':
        return Wrench;
      default:
        return BookOpen;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-400" size={16} />;
      case 'in_progress':
        return <Clock className="text-yellow-400" size={16} />;
      default:
        return <Circle className="text-gray-400" size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
        <p className="text-gray-400">All your learning materials in one place</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'not_started', 'in_progress', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              filter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            )}
          >
            {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = getIcon(resource.type);
          
          return (
            <div key={resource.id} className="card hover:border-purple-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Icon className="text-purple-400" size={20} />
                </div>
                {getStatusIcon(resource.status)}
              </div>
              
              <h3 className="font-semibold mb-2">{resource.title}</h3>
              
              <div className="text-sm text-gray-400 mb-4">
                <p>{resource.phaseTitle}</p>
                <p>{resource.monthTitle}</p>
              </div>
              
              {resource.notes && (
                <p className="text-sm text-gray-500 mb-4">{resource.notes}</p>
              )}
              
              {resource.url && (
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
                >
                  Open Resource <ExternalLink size={16} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No resources found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default Resources;