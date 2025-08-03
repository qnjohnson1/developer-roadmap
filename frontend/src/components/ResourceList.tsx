import React from 'react';
import { Resource } from '../../../shared/types';
import { BookOpen, Video, Globe, Wrench, ExternalLink, Check, Clock, Circle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapApi } from '../services/api';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

interface ResourceListProps {
  resources: Resource[];
}

const ResourceList: React.FC<ResourceListProps> = ({ resources }) => {
  const queryClient = useQueryClient();

  const updateResourceMutation = useMutation({
    mutationFn: ({ resourceId, data }: { resourceId: string; data: Partial<Resource> }) =>
      roadmapApi.updateResource(resourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      toast.success('Resource updated');
    },
  });

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

  const handleStatusChange = (resourceId: string, newStatus: Resource['status']) => {
    updateResourceMutation.mutate({ resourceId, data: { status: newStatus } });
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-4">
      <h4 className="text-sm font-medium mb-3 text-purple-400">Resources</h4>
      <div className="space-y-2">
        {resources.map((resource) => {
          const Icon = getIcon(resource.type);
          
          return (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
            >
              <div className="flex items-center gap-3 flex-1">
                <Icon className="text-gray-400" size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{resource.title}</p>
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 inline-flex items-center gap-1"
                    >
                      Open <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStatusChange(resource.id, 'not_started')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    resource.status === 'not_started'
                      ? 'bg-gray-700 text-gray-300'
                      : 'hover:bg-gray-800 text-gray-500'
                  )}
                  title="Not Started"
                >
                  <Circle size={16} />
                </button>
                <button
                  onClick={() => handleStatusChange(resource.id, 'in_progress')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    resource.status === 'in_progress'
                      ? 'bg-yellow-600/20 text-yellow-400'
                      : 'hover:bg-gray-800 text-gray-500'
                  )}
                  title="In Progress"
                >
                  <Clock size={16} />
                </button>
                <button
                  onClick={() => handleStatusChange(resource.id, 'completed')}
                  className={cn(
                    'p-1 rounded transition-colors',
                    resource.status === 'completed'
                      ? 'bg-green-600/20 text-green-400'
                      : 'hover:bg-gray-800 text-gray-500'
                  )}
                  title="Completed"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceList;