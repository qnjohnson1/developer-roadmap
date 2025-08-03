import React from 'react';
import { TimeBlock as TimeBlockType } from '../../../shared/types';
import { Check, Clock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roadmapApi } from '../services/api';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

interface TimeBlockProps {
  block: TimeBlockType;
}

const TimeBlock: React.FC<TimeBlockProps> = ({ block }) => {
  const queryClient = useQueryClient();

  const updateTimeBlockMutation = useMutation({
    mutationFn: (completed: boolean) => roadmapApi.updateTimeBlock(block.id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      queryClient.invalidateQueries({ queryKey: ['progress-overview'] });
      toast.success(block.completed ? 'Marked as incomplete' : 'Great job! Task completed');
    },
  });

  const handleClick = () => {
    updateTimeBlockMutation.mutate(!block.completed);
  };

  const getTypeColor = () => {
    switch (block.type) {
      case 'theory':
        return 'from-pink-500 to-rose-500';
      case 'project':
        return 'from-blue-500 to-cyan-500';
      case 'practice':
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={updateTimeBlockMutation.isPending}
      className={cn(
        'relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
        'hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
        block.completed
          ? 'bg-green-600/20 text-green-400 border border-green-600/30'
          : `bg-gradient-to-r ${getTypeColor()} text-white`
      )}
      title={block.description}
    >
      <div className="flex items-center gap-1.5">
        {block.completed && <Check size={14} />}
        <span>{block.duration}</span>
        <span className="opacity-80">•</span>
        <span className="truncate max-w-[150px]">{block.description}</span>
      </div>
      
      {updateTimeBlockMutation.isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
          <Clock className="animate-spin" size={14} />
        </div>
      )}
    </button>
  );
};

export default TimeBlock;