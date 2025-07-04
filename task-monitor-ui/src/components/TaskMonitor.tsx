'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TaskData, Task, Subtask, Source, CreateSourceRequest } from '@/types';
import Header from './Header';
import TaskPanel from './TaskPanel';
import NavigationSidebar from './NavigationSidebar';
import SourceManager from './SourceManager';
import CreateSourceModal from './CreateSourceModal';

const TaskMonitor: React.FC = () => {
  const [data, setData] = useState<TaskData | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedSubtask, setSelectedSubtask] = useState<Subtask | null>(null);
  const [selectedContext, setSelectedContext] = useState<string>('master');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<Source | undefined>(undefined);
  const [showSourceManager, setShowSourceManager] = useState(false);
  const [showCreateSource, setShowCreateSource] = useState(false);

  // Auto-migrate existing tasks if needed
  const checkAndMigrate = useCallback(async () => {
    try {
      const response = await fetch('/api/sources/migrate', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.migrated) {
        console.log('Successfully migrated existing tasks.json');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Migration check failed:', error);
      return false;
    }
  }, []);

  // Fetch sources function
  const fetchSources = useCallback(async () => {
    try {
      const response = await fetch('/api/sources');
      if (response.ok) {
        const sourcesData = await response.json();
        setSources(sourcesData.sources);
        
        // Auto-select first source if none selected and sources exist
        if (!selectedSourceId && sourcesData.sources.length > 0) {
          const firstSource = sourcesData.sources[0];
          setSelectedSourceId(firstSource.id);
          setSelectedSource(firstSource);
        }
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  }, [selectedSourceId]);

  // Fetch task data function
  const fetchData = useCallback(async () => {
    if (!selectedSourceId) {
      setConnectionStatus('disconnected');
      return;
    }

    try {
      const response = await fetch(`/api/tasks?source=${selectedSourceId}`);
      if (response.ok) {
        const taskData = await response.json();
        setData(taskData);
        setSelectedSource(taskData.source);
        setConnectionStatus('connected');
        
        // Auto-select first task if none selected and tasks exist
        if (!selectedTaskId && taskData.tags[selectedContext]?.tasks?.length > 0) {
          setSelectedTaskId(taskData.tags[selectedContext].tasks[0].id.toString());
          setSelectedSubtask(null); // Reset subtask selection when auto-selecting task
        }
        
        // Reset subtask selection if selected task changed  
        if (selectedSubtask && parseInt(selectedTaskId) !== taskData.tags[selectedContext]?.tasks?.find((t: Task) => t.subtasks?.some(s => s.id === selectedSubtask.id))?.id) {
          setSelectedSubtask(null);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error fetching task data:', error);
      setConnectionStatus('error');
    }
  }, [selectedTaskId, selectedContext, selectedSubtask, selectedSourceId]);

  // Initial setup - check migration and fetch sources
  useEffect(() => {
    const initializeApp = async () => {
      await checkAndMigrate();
      fetchSources(); // Don't await this to avoid dependency issues
    };
    
    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only once

  // Fetch data when source or context changes
  useEffect(() => {
    fetchData();
  }, [selectedSourceId, selectedContext, fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!isAutoRefresh || !selectedSourceId) return;
    
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [isAutoRefresh, selectedSourceId, selectedContext, fetchData]);

  // Handle source change
  const handleSourceChange = (sourceId: string) => {
    if (sourceId === '__manage__') {
      setShowSourceManager(true);
      return;
    }
    
    setSelectedSourceId(sourceId);
    const source = sources.find(s => s.id === sourceId);
    setSelectedSource(source);
    
    // Reset task and subtask selection when changing source
    setSelectedTaskId('');
    setSelectedSubtask(null);
    setSelectedContext('master'); // Reset to master context
  };

  // Handle create source
  const handleCreateSource = async (data: CreateSourceRequest) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('file', data.file);

    try {
      const response = await fetch('/api/sources', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log('Source created successfully:', result.message);
        await fetchSources(); // Refresh sources list
        
        // Auto-select the new source
        setSelectedSourceId(result.source.id);
        setSelectedSource(result.source);
        
        // Reset selections
        setSelectedTaskId('');
        setSelectedSubtask(null);
        setSelectedContext('master');
      } else {
        console.error('Source creation failed:', result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Source creation error:', error);
      throw error;
    }
  };

  // Handle delete source
  const handleDeleteSource = async (sourceId: string) => {
    try {
      const response = await fetch(`/api/sources/${sourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Source deleted successfully');
        await fetchSources(); // Refresh sources list
        
        // If deleted source was selected, clear selection
        if (selectedSourceId === sourceId) {
          setSelectedSourceId(null);
          setSelectedSource(undefined);
          setData(null);
          setSelectedTaskId('');
          setSelectedSubtask(null);
          setConnectionStatus('disconnected');
        }
      } else {
        const result = await response.json();
        console.error('Source deletion failed:', result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Source deletion error:', error);
      throw error;
    }
  };

  // Handle manage sources
  const handleManageSources = () => {
    setShowSourceManager(true);
  };

  // Handle show create source modal
  const handleShowCreateSource = () => {
    setShowSourceManager(false);
    setShowCreateSource(true);
  };

  // Get available contexts
  const availableContexts = data ? Object.keys(data.tags) : [];

  // Get current context tasks
  const currentTasks = data?.tags[selectedContext]?.tasks || [];

  // Get current task
  const currentTask = currentTasks.find(task => task.id === parseInt(selectedTaskId));

  // Handle task selection
  const handleTaskSelect = (taskId: string) => {
    setSelectedTaskId(taskId);
    setSelectedSubtask(null); // Reset subtask selection when changing tasks
  };

  // Handle subtask selection
  const handleSubtaskSelect = (subtask: Subtask | null) => {
    setSelectedSubtask(subtask);
  };

  // Handle task navigation (for dependencies)
  const handleTaskNavigate = (taskId: string) => {
    setSelectedTaskId(taskId);
    setSelectedSubtask(null); // Reset subtask selection when navigating to a new task
  };

  // Handle context change
  const handleContextChange = (context: string) => {
    setSelectedContext(context);
    setSelectedTaskId('');
    setSelectedSubtask(null); // Reset subtask selection when changing context
  };

  // Get filtered tasks for search - searches all text fields in tasks and subtasks
  const getFilteredTasks = () => {
    if (!searchTerm) return currentTasks;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Helper function to search text fields safely
    const searchInText = (text: string | undefined | null): boolean => {
      return text ? text.toLowerCase().includes(lowerSearchTerm) : false;
    };
    
    // Helper function to search in task fields
    const searchInTaskFields = (task: Task): boolean => {
      // Search in dependencies
      const dependencyMatches = task.dependencies && task.dependencies.length > 0 
        ? task.dependencies.some(dep => dep.toString().includes(searchTerm))
        : false;
      
      return (
        searchInText(task.title) ||
        searchInText(task.description) ||
        searchInText(task.details) ||
        searchInText(task.testStrategy) ||
        searchInText(task.status) ||
        searchInText(task.priority) ||
        task.id.toString().includes(searchTerm) ||
        dependencyMatches
      );
    };
    
    // Helper function to search in subtask fields
    const searchInSubtaskFields = (subtask: Subtask): boolean => {
      // Search in dependencies
      const dependencyMatches = subtask.dependencies && subtask.dependencies.length > 0
        ? subtask.dependencies.some(dep => dep.toString().includes(searchTerm))
        : false;
      
      // Search in parent task ID
      const parentMatches = subtask.parentTaskId 
        ? subtask.parentTaskId.toString().includes(searchTerm)
        : false;
      
      return (
        searchInText(subtask.title) ||
        searchInText(subtask.description) ||
        searchInText(subtask.details) ||
        searchInText(subtask.testStrategy) ||
        searchInText(subtask.status) ||
        subtask.id.toString().includes(searchTerm) ||
        dependencyMatches ||
        parentMatches
      );
    };
    
    // Helper function to search in subtasks
    const searchInSubtasks = (subtasks: Subtask[] | undefined): boolean => {
      if (!subtasks) return false;
      return subtasks.some(subtask => searchInSubtaskFields(subtask));
    };
    
    return currentTasks.filter(task => {
      // Search in main task fields
      const taskMatches = searchInTaskFields(task);
      
      // Search in subtasks
      const subtaskMatches = searchInSubtasks(task.subtasks);
      
      // Include task if either the task itself or any of its subtasks match
      return taskMatches || subtaskMatches;
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header
          connectionStatus={connectionStatus}
          isAutoRefresh={isAutoRefresh}
          onAutoRefreshToggle={() => setIsAutoRefresh(!isAutoRefresh)}
          availableContexts={availableContexts}
          selectedContext={selectedContext}
          onContextChange={handleContextChange}
          sources={sources}
          selectedSourceId={selectedSourceId}
          onSourceChange={handleSourceChange}
          onManageSources={handleManageSources}
          selectedSource={selectedSource}
        />
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white flex-shrink-0 min-h-0">
          <NavigationSidebar
            tasks={getFilteredTasks()}
            allTasks={currentTasks}
            selectedTaskId={selectedTaskId}
            searchTerm={searchTerm}
            onTaskSelect={handleTaskSelect}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Task Panel */}
          <div className="flex-1 p-6 overflow-auto min-h-0">
            <TaskPanel 
              task={currentTask} 
              selectedSubtask={selectedSubtask}
              onSubtaskSelect={handleSubtaskSelect}
              onTaskNavigate={handleTaskNavigate}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SourceManager
        isOpen={showSourceManager}
        onClose={() => setShowSourceManager(false)}
        sources={sources}
        onCreateNew={handleShowCreateSource}
        onDeleteSource={handleDeleteSource}
      />

      <CreateSourceModal
        isOpen={showCreateSource}
        onClose={() => setShowCreateSource(false)}
        onSubmit={handleCreateSource}
      />
    </div>
  );
};

export default TaskMonitor; 