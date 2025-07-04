'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Task } from '@/types';
import { SearchIcon } from 'lucide-react';

interface NavigationSidebarProps {
  tasks: Task[];
  allTasks: Task[];
  selectedTaskId: string;
  searchTerm: string;
  onTaskSelect: (taskId: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  tasks,
  allTasks,
  selectedTaskId,
  searchTerm,
  onTaskSelect,
  onSearchChange,
}) => {

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons = {
      'done': '✅',
      'in-progress': '🔄',
      'pending': '⏳',
      'cancelled': '❌',
      'review': '👀',
      'deferred': '⏸️',
    };
    return icons[status as keyof typeof icons] || '⚪';
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'done': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'review': 'bg-purple-100 text-purple-800 border-purple-200',
      'deferred': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="h-full bg-white flex flex-col min-h-0">
      {/* Fixed header and search */}
      <div className="p-4 flex-shrink-0 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
          All Tasks ({allTasks.length})
        </h3>
        
        {/* Search box - always visible */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full bg-white"
          />
        </div>
      </div>
      
      {/* Scrollable task list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4">
          {/* Task list or empty state */}
          {allTasks.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No tasks available. Please select a JSON file to view tasks.
            </div>
          ) : tasks.length === 0 && searchTerm ? (
            <div className="text-gray-500 text-center py-8">
              <div className="mb-2">🔍 No tasks match &quot;{searchTerm}&quot;</div>
              <div className="text-sm">Try a different search term or clear the search.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => {
              const isCurrentTask = task.id.toString() === selectedTaskId;
              
              return (
                <div
                  key={task.id}
                  onClick={() => onTaskSelect(task.id.toString())}
                  className={`
                    cursor-pointer rounded-lg p-3 border transition-all duration-200
                    ${isCurrentTask 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }
                  `}
                >
                                  <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getStatusIcon(task.status)}</span>
                  <span className={`font-medium text-sm ${isCurrentTask ? 'text-blue-900' : 'text-gray-900'}`}>
                    {task.id}.
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadgeColor(task.status)}`}>
                    {task.status}
                  </span>
                  {/* Priority indicator - moved to header */}
                  {task.priority && task.priority !== 'medium' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </span>
                  )}
                </div>
                
                <p className={`text-sm line-clamp-2 ${isCurrentTask ? 'text-blue-800' : 'text-gray-700'}`}>
                  {task.title}
                </p>
                
                {/* Progress indicator for tasks with subtasks */}
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {task.subtasks.filter(s => s.status === 'done').length}/{task.subtasks.length} subtasks
                  </div>
                )}
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar; 