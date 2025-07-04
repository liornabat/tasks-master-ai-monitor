'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task, Subtask } from '@/types';
import Markdown from '@/components/ui/markdown';

interface TaskPanelProps {
  task?: Task;
  selectedSubtask?: Subtask | null;
  onSubtaskSelect?: (subtask: Subtask | null) => void;
  onTaskNavigate?: (taskId: string) => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({ task, selectedSubtask, onSubtaskSelect, onTaskNavigate }) => {
  if (!task) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="bg-white border-gray-200">
          <CardContent className="text-center p-12">
            <h2 className="text-xl font-bold mb-2 text-gray-700">⏸️ No Active Task</h2>
            <p className="text-gray-500">Please select a task to view details</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine what to display - selected subtask or main task
  const displayItem = selectedSubtask || task;
  const isSubtaskView = !!selectedSubtask;

  // Get appropriate status badge color
  const getStatusBadge = (status: string) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'done': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'review': 'bg-purple-100 text-purple-800 border-purple-200',
      'deferred': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get priority badge color
  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-orange-100 text-orange-800 border-orange-200',
      'low': 'bg-green-100 text-green-800 border-green-200',
    };
    return priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Calculate progress based on subtasks (only for main task)
  const calculateProgress = () => {
    if (isSubtaskView || !task.subtasks || task.subtasks.length === 0) {
      return task.status === 'done' ? 100 : 0;
    }
    
    const completedSubtasks = task.subtasks.filter(subtask => subtask.status === 'done').length;
    return Math.round((completedSubtasks / task.subtasks.length) * 100);
  };



  const progress = calculateProgress();

  // Get status icon for subtasks
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

  return (
    <div className="h-full flex gap-4 min-h-0">
      {/* Main content area - 80% */}
      <div className="flex-1 min-h-0" style={{ flexBasis: '80%' }}>
        <Card className="bg-white border-gray-200 h-full flex flex-col min-h-0">
          <CardHeader className="border-b border-gray-200 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Back button for subtask view */}
                {isSubtaskView && onSubtaskSelect && (
                  <button
                    onClick={() => onSubtaskSelect(null)}
                    className="text-sm text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
                  >
                    ← Back to main task
                  </button>
                )}
                
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {isSubtaskView 
                    ? `${task.id}.${selectedSubtask.id} ${selectedSubtask.title}`
                    : `${task.id}. ${task.title}`
                  }
                </CardTitle>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getStatusBadge(displayItem.status)}>
                    {displayItem.status}
                  </Badge>
                  {(displayItem as Task).priority && (
                    <Badge className={getPriorityBadge((displayItem as Task).priority)}>
                      {(displayItem as Task).priority} priority
                    </Badge>
                  )}
                </div>

                {/* Dependencies row - only for main task */}
                {!isSubtaskView && task.dependencies && task.dependencies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {task.dependencies.map((depId) => (
                      <Badge 
                        key={depId} 
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 border-gray-300 text-gray-700 transition-colors"
                        onClick={() => onTaskNavigate?.(depId.toString())}
                      >
                        {depId}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Progress indicator - only for main task with subtasks */}
            {!isSubtaskView && task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-600">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="text-xs text-gray-500">
                  {task.subtasks.filter(s => s.status === 'done').length} of {task.subtasks.length} subtasks completed
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Description</h3>
              <Markdown content={displayItem.description} />
            </div>

            {/* Implementation Details */}
            {displayItem.details && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 Implementation Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <Markdown content={displayItem.details} />
                </div>
              </div>
            )}

            {/* Test Strategy */}
            {displayItem.testStrategy && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🧪 Test Strategy</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Markdown content={displayItem.testStrategy} />
                </div>
              </div>
            )}


          </CardContent>
        </Card>
      </div>

      {/* Subtasks sidebar - 20% */}
      <div className="w-1/5 min-h-0" style={{ flexBasis: '20%' }}>
        {task.subtasks && task.subtasks.length > 0 ? (
          <Card className="bg-white border-gray-200 h-full flex flex-col min-h-0">
            <CardHeader className="border-b border-gray-200 pb-3 flex-shrink-0">
              <CardTitle className="text-sm font-semibold text-gray-900">
                Subtasks ({task.subtasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 overflow-y-auto flex-1 min-h-0">
              <div className="space-y-2">
                {task.subtasks.map((subtask) => {
                  const isSelected = selectedSubtask?.id === subtask.id;
                  
                  return (
                    <div
                      key={subtask.id}
                      onClick={() => onSubtaskSelect?.(subtask)}
                      className={`
                        cursor-pointer rounded-lg p-3 border transition-all duration-200
                        ${isSelected 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{getStatusIcon(subtask.status)}</span>
                        <span className={`font-medium text-xs ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {task.id}.{subtask.id}
                        </span>
                      </div>
                      
                      <p className={`text-xs line-clamp-2 mb-1 ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                        {subtask.title}
                      </p>
                      
                      <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getStatusBadge(subtask.status)}`}>
                        {subtask.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border-gray-200 h-full">
            <CardContent className="p-6 text-center flex items-center justify-center h-full">
              <div className="text-gray-500">
                <p className="text-sm">No subtasks</p>
                <p className="text-xs">This task has no subtasks</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskPanel; 