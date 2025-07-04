# Task Execution Monitor - UI Design & Technical Architecture

## Overview
Real-time task monitoring interface for tracking individual task execution with deep-dive capabilities, live logging, and performance metrics.

## UI Layout Design

### Main Interface Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 🎯 Task Execution Monitor              [📁 Select File] [🔄 Auto 5s] [⚙️] [🔴] │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Context Selector                                                                │
│ ┌─────────────────┐ ┌─────────────────┐                                        │
│ │ 📂 Master (4)   │ │ 🟡 Coverage (30)│  ⚡ 2 Active │ 🔴 Live              │
│ │ ✅ 4/4 Complete │ │ ⚡ 3/30 Running │                                        │
│ └─────────────────┘ └─────────────────┘                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Task Navigation Bar                                                             │
│ [◀️ Prev] [Task 3.3: Map Risks] [▶️ Next] │ 📋 All Tasks ▼ │ 🔍 Search...     │
├─────────────────────────────────────────────────────────────────────────────────┤
│ Current Task Details (70% width)          │ Task Navigation & Info (30% width) │
│                                           │                                     │
│ 🎯 VIEWING: Map Risks (ID: 3.3) | 🟡 IN PROGRESS │ 📂 TASK HIERARCHY           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━ 85%                      │ ┌─────────────────────────────────┐ │
│                                                    │ │ 📋 3. Document Security Vulns  │ │
│ 📊 TASK DETAILS                                   │ │ ├─ ✅ 3.1 Generate Reports      │ │
│ ┌──────────────────────────────────────────────────┐ │ ├─ ✅ 3.2 Identify Functions    │ │
│ │ 📝 TITLE: Document Current Security              │ │ ├─ 🟡 3.3 Map Risks ← VIEWING   │ │
│ │    Vulnerabilities                               │ │ └─ ⏳ 3.4 Compile Report       │ │
│ │                                                  │ └─────────────────────────────────┘ │
│ │ 📋 DESCRIPTION:                                  │                                     │
│ │ Analyze and document all security functions     │ 🔗 DEPENDENCIES                    │
│ │ with 0% coverage to establish baseline risk     │ ┌─────────────────────────────────┐ │
│ │ assessment                                       │ │ ✅ Task 3.2: Identify Functions│ │
│ │                                                  │ │ └─ Click to navigate ➡️        │ │
│ │ 📜 IMPLEMENTATION DETAILS:                       │ │                                 │ │
│ │ Use go-cover v1.4+ to generate detailed         │ │ ⏭️ DEPENDENTS                   │ │
│ │ coverage reports. Document all functions in     │ │ ⏳ Task 4: Audit System Tests  │ │
│ │ audit.go, metrics.go with 0% coverage.          │ │ └─ Click to navigate ➡️        │ │
│ │ Create security risk matrix mapping uncovered   │ └─────────────────────────────────┘ │
│ │ functions to potential vulnerabilities.         │                                     │
│ │ Generate baseline report using govulncheck.     │                                     │
│ │                                                  │                                     │
│ │ 🧪 TEST STRATEGY:                               │                                     │
│ │ Validate documentation accuracy by              │                                     │
│ │ cross-referencing with actual coverage          │                                     │
│ │ reports and security audit findings             │                                     │
│ │                                                  │                                     │
│ │                                                  │                                     │
│ └──────────────────────────────────────────────────┘                                     │
└─────────────────────────────────────────────────────┴─────────────────────────────────────┘
```

## Simplified Navigation Features

### 1. Task Navigation System
- **Previous/Next Navigation**: Arrow buttons to cycle through tasks in the current context
- **Task Selector Dropdown**: Quick access to all tasks with search functionality
- **Jump to Task ID**: Direct navigation by entering specific task IDs
- **Breadcrumb Navigation**: Shows current task path (Context > Task > Subtask)

### 2. Status Display
- **Status in Header**: Current task status prominently displayed in title header (Pending, In Progress, Done, Cancelled)
- **Color-coded Status Badges**: Visual status indicators for quick recognition
- **Progress Bar**: Simple progress indicator showing task completion percentage

### 3. Dependency Navigation
- **Clickable Dependencies**: Click dependency links to navigate to specific tasks
- **Dependents List**: Shows which tasks depend on current task (with navigation)

### 4. Simplified Sidebar Features
- **Task Hierarchy Panel**: Tree view of current context with navigation
- **Dependencies Navigation**: Click to navigate to dependent tasks

## Component Specifications

### 1. Header Bar
- **Brand/Title**: "🎯 Task Execution Monitor"
- **File Selection**: "📁 Select File" button to choose JSON data source
- **Auto-Refresh Toggle**: "🔄 Auto 5s" button to enable/disable automatic file monitoring
- **Settings**: "⚙️" button for configuration options
- **Status Indicator**: Live connection status (🔴 Live, 🟡 Connecting, ⚫ Offline)

### 1. Header Bar Component
```html
<div class="header-bar">
  <h1 class="title">🎯 Task Execution Monitor</h1>
  <div class="header-controls">
    <button class="file-select-btn" onclick="openFileDialog()">📁 Select File</button>
    <input type="file" id="json-file-input" accept=".json" style="display: none;" onchange="handleFileSelection(event)" />
    <span class="current-file-indicator" id="current-file">No file selected</span>
    <button class="auto-refresh-btn active" id="auto-refresh-toggle" onclick="toggleAutoRefresh()">🔄 Auto 5s</button>
    <button class="settings-btn" onclick="openSettings()">⚙️</button>
    <div class="status-indicator live" id="connection-status">🔴 Live</div>
  </div>
</div>
```

### 2. Task Navigation Bar
```html
<div class="task-navigation-bar">
  <div class="navigation-controls">
    <button class="nav-btn prev" onclick="navigateToPrevious()">◀️ Prev</button>
    <div class="current-task-selector">
      <select class="task-dropdown" onchange="navigateToTask(this.value)">
        <option value="3.3" selected>Task 3.3: Map Risks</option>
        <option value="3.1">Task 3.1: Generate Reports</option>
        <option value="3.2">Task 3.2: Identify Functions</option>
        <option value="3.4">Task 3.4: Compile Report</option>
      </select>
    </div>
    <button class="nav-btn next" onclick="navigateToNext()">▶️ Next</button>
  </div>
  
  <div class="quick-access">
    <button class="all-tasks-btn">📋 All Tasks ▼</button>
    <input type="text" class="task-search" placeholder="🔍 Search tasks..." />
  </div>
</div>
```

### 3. Context Selector
```html
<div class="context-selector">
  <div class="context-card active" data-context="coverage">
    <h3>🟡 Coverage Context</h3>
    <div class="progress-bar">
      <div class="fill" style="width: 10%"></div>
    </div>
    <span class="stats">3/30 tasks • 2 active</span>
  </div>
  <div class="context-card" data-context="master">
    <h3>📂 Master Context</h3>
    <div class="progress-bar">
      <div class="fill complete" style="width: 100%"></div>
    </div>
    <span class="stats">4/4 tasks • complete</span>
  </div>
</div>
```

### 4. Simplified Current Task Panel
```html
<div class="current-task-panel">
  <div class="task-header">
    <h2>🎯 VIEWING: <span id="current-task-title">Map Risks</span> (ID: <span id="task-id">3.3</span>) | <span class="status-badge in-progress">🟡 IN PROGRESS</span></h2>
    <div class="breadcrumb-nav">
      <span class="breadcrumb">Coverage Context > Task 3 > Subtask 3.3</span>
    </div>
    <div class="progress-bar-large">
      <div class="fill" id="task-progress" style="width: 85%"></div>
      <span class="percentage">85%</span>
    </div>
  </div>
  
  <div class="task-details-section">
    <div class="task-info">
      <h4>📝 TITLE</h4>
      <p id="task-title-full">Document Current Security Vulnerabilities</p>
      
      <h4>📋 DESCRIPTION</h4>
      <p id="task-description">
        Analyze and document all security functions with 0% coverage to establish 
        baseline risk assessment
      </p>
      
      <h4>📜 IMPLEMENTATION DETAILS</h4>
      <p id="implementation-details">
        Use go-cover v1.4+ to generate detailed coverage reports. Document all 
        functions in audit.go, metrics.go with 0% coverage. Create security risk 
        matrix mapping uncovered functions to potential vulnerabilities. 
        Generate baseline report using govulncheck v1.0+.
      </p>
      
      <h4>🧪 TEST STRATEGY</h4>
      <p id="test-strategy">
        Validate documentation accuracy by cross-referencing with actual coverage 
        reports and security audit findings
      </p>
    </div>
  </div>
</div>
```

### 4. Live Execution Log
```html
<div class="execution-log">
  <div class="log-header">
    <h4>📜 LIVE EXECUTION LOG</h4>
    <div class="log-controls">
      <button class="auto-scroll active">📡 Auto-scroll</button>
      <button class="clear-log">🗑️ Clear</button>
      <button class="export-log">📁 Export</button>
    </div>
  </div>
  <div class="log-container" id="log-stream">
    <!-- Real-time log entries -->
  </div>
</div>
```

### 5. Simplified Navigation Sidebar
```html
<div class="sidebar">
  <div class="task-hierarchy">
    <h4>📂 TASK HIERARCHY</h4>
    <div class="hierarchy-tree">
      <div class="task-node parent">
        <span class="task-icon">📋</span>
        <span class="task-name clickable" onclick="navigateToTask('3')">3. Document Security Vulns</span>
        <div class="subtask-list">
          <div class="subtask-node completed clickable" onclick="navigateToTask('3.1')">
            <span class="status-icon">✅</span>
            <span class="subtask-name">3.1 Generate Reports</span>
          </div>
          <div class="subtask-node completed clickable" onclick="navigateToTask('3.2')">
            <span class="status-icon">✅</span>
            <span class="subtask-name">3.2 Identify Functions</span>
          </div>
          <div class="subtask-node current">
            <span class="status-icon">🟡</span>
            <span class="subtask-name">3.3 Map Risks ← VIEWING</span>
          </div>
          <div class="subtask-node pending clickable" onclick="navigateToTask('3.4')">
            <span class="status-icon">⏳</span>
            <span class="subtask-name">3.4 Compile Report</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="dependencies-panel">
    <h4>🔗 DEPENDENCIES</h4>
    <div class="dependency-item clickable" onclick="navigateToTask('2')">
      <span class="status-icon">✅</span>
      <span class="dependency-name">Task 2: Setup Test Environment</span>
      <span class="nav-arrow">📍 ➡️</span>
    </div>
    
    <h4>⏭️ DEPENDENTS</h4>
    <div class="dependent-item clickable" onclick="navigateToTask('4')">
      <span class="status-icon">⏳</span>
      <span class="dependent-name">Task 4: Audit System Tests</span>
      <span class="nav-arrow">📍 ➡️</span>
    </div>
  </div>
</div>
```

## Technical Architecture (SIMPLIFIED)

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js Full Stack App                      │
├─────────────────────────────────────────────────────────────────┤
│ Frontend (React + shadcn/ui + Tailwind):                       │
│ • TaskMonitor.tsx - Main container                             │
│ • TaskPanel.tsx - Task details                                 │
│ • NavigationSidebar.tsx - Task hierarchy                       │
│ • Header.tsx - File selection & controls                       │
├─────────────────────────────────────────────────────────────────┤
│ Backend (Next.js API Routes):                                  │
│ • /api/tasks - Read & parse tasks.json                         │
│ • /api/upload - Handle file upload                             │
│ • Simple file operations only                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Source                                  │
├─────────────────────────────────────────────────────────────────┤
│ • tasks.json file (uploaded by user)                           │
│ • Stored in /uploads/ directory                                │
│ • No database, no caching, no file watching                    │
└─────────────────────────────────────────────────────────────────┘
```

### Simple Data Flow

```
User Uploads JSON File
         │
         ▼
Store in /uploads/ folder
         │
         ▼
Frontend polls /api/tasks every 5s
         │
         ▼
API reads & returns JSON
         │
         ▼
React state update
         │
         ▼
UI re-renders
```

## Implementation Specifications

### 1. Next.js API Routes (Backend)

#### Upload JSON File Endpoint
```javascript
// /pages/api/upload.js
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = new IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'uploads');
  form.keepExtensions = true;

  try {
    const [fields, files] = await form.parse(req);
    const file = files.tasks[0];
    
    // Validate JSON
    const content = fs.readFileSync(file.filepath, 'utf8');
    JSON.parse(content); // Will throw if invalid
    
    // Save with standard name
    const finalPath = path.join(form.uploadDir, 'tasks.json');
    fs.copyFileSync(file.filepath, finalPath);
    fs.unlinkSync(file.filepath); // Clean up temp file
    
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid JSON file' });
  }
}
```

#### Get Tasks Data Endpoint
```javascript
// /pages/api/tasks.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'uploads', 'tasks.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'No tasks file found' });
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error reading tasks file' });
  }
}
```

### 2. Frontend Implementation (Next.js + shadcn/ui + Tailwind)

#### Main Task Monitor Component
```tsx
// /components/TaskMonitor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileIcon, RefreshCwIcon, SettingsIcon } from 'lucide-react';
import TaskPanel from './TaskPanel';
import NavigationSidebar from './NavigationSidebar';

interface TaskData {
  [context: string]: {
    tasks: Task[];
    metadata: {
      created: string;
      updated: string;
      description: string;
    };
  };
}

const TaskMonitor = () => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [currentContext, setCurrentContext] = useState('master');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [selectedFile, setSelectedFile] = useState<string>('No file selected');

  // Polling for data updates
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTaskData(data);
          setConnectionStatus('live');
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        setConnectionStatus('error');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('tasks', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSelectedFile(file.name);
        setConnectionStatus('live');
        // Immediately fetch the data
        const tasksResponse = await fetch('/api/tasks');
        if (tasksResponse.ok) {
          const data = await tasksResponse.json();
          setTaskData(data);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      setConnectionStatus('error');
    }
  };

  const currentTasks = taskData?.[currentContext]?.tasks || [];
  const currentTask = currentTasks[currentTaskIndex];

  const getStatusBadge = (status: string) => {
    const variants = {
      done: 'bg-blue-500',
      'in-progress': 'bg-green-500',
      pending: 'bg-yellow-500',
    };
    return variants[status] || 'bg-gray-500';
  };

  const getConnectionBadge = () => {
    const variants = {
      live: '🔴 Live',
      offline: '⚫ Offline',
      error: '🟠 Error',
    };
    return variants[connectionStatus] || '⚫ Offline';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-400">🎯 Task Execution Monitor</h1>
          
          <div className="flex items-center gap-4">
            {/* File Upload */}
            <div>
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button
                onClick={() => document.getElementById('file-upload')?.click()}
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                <FileIcon className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </div>

            {/* File Indicator */}
            <span className="text-sm text-gray-400 max-w-[200px] truncate">
              {selectedFile}
            </span>

            {/* Auto Refresh Toggle */}
            <Button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              variant={isAutoRefresh ? "default" : "outline"}
              className={isAutoRefresh ? "bg-green-600" : ""}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              {isAutoRefresh ? 'Auto 5s' : 'Off'}
            </Button>

            {/* Settings */}
            <Button variant="outline">
              <SettingsIcon className="h-4 w-4" />
            </Button>

            {/* Connection Status */}
            <Badge variant="outline">{getConnectionBadge()}</Badge>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="border-b border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Previous/Next */}
            <Button
              onClick={() => setCurrentTaskIndex(Math.max(0, currentTaskIndex - 1))}
              disabled={currentTaskIndex === 0}
              variant="outline"
            >
              ◀️ Prev
            </Button>

            {/* Task Selector */}
            <Select
              value={currentTaskIndex.toString()}
              onValueChange={(value) => setCurrentTaskIndex(parseInt(value))}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentTasks.map((task, index) => (
                  <SelectItem key={task.id} value={index.toString()}>
                    Task {task.id}: {task.title.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => setCurrentTaskIndex(Math.min(currentTasks.length - 1, currentTaskIndex + 1))}
              disabled={currentTaskIndex >= currentTasks.length - 1}
              variant="outline"
            >
              ▶️ Next
            </Button>
          </div>

          {/* Search */}
          <Input
            placeholder="🔍 Search tasks..."
            className="w-[200px]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Main Panel */}
        <div className="flex-1 p-6">
          <TaskPanel task={currentTask} />
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-700 bg-gray-800 p-6">
          <NavigationSidebar
            tasks={currentTasks}
            currentTaskIndex={currentTaskIndex}
            onTaskSelect={setCurrentTaskIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskMonitor;
```

#### Task Panel Component
```tsx
// /components/TaskPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: number;
  title: string;
  description: string;
  details: string;
  testStrategy: string;
  status: string;
  priority: string;
  dependencies: number[];
  subtasks?: Subtask[];
}

const TaskPanel = ({ task }: { task?: Task }) => {
  if (!task) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2">⏸️ No Active Tasks</h2>
          <p className="text-gray-400">Please select a JSON file to view tasks</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      done: 'bg-blue-500',
      'in-progress': 'bg-green-500', 
      pending: 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const completedSubtasks = task.subtasks?.filter(s => s.status === 'done').length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            🎯 Task {task.id}: {task.title}
          </CardTitle>
          <Badge className={getStatusColor(task.status)}>
            {task.status.toUpperCase()}
          </Badge>
        </div>
        
        {totalSubtasks > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-semibold text-gray-300 uppercase text-sm mb-2">📋 Description</h4>
          <p className="text-gray-200 leading-relaxed">{task.description}</p>
        </div>

        {/* Implementation Details */}
        <div>
          <h4 className="font-semibold text-gray-300 uppercase text-sm mb-2">📜 Implementation Details</h4>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-300">{task.details}</pre>
          </div>
        </div>

        {/* Test Strategy */}
        <div>
          <h4 className="font-semibold text-gray-300 uppercase text-sm mb-2">🧪 Test Strategy</h4>
          <div className="bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-300">{task.testStrategy}</pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskPanel;
```

  return (
    <div className="current-task-panel">
      <div className="task-header">
        <h2>🎯 ACTIVE: {task.title} (ID: {task.id})</h2>
        <div className="progress-bar-large">
          <div 
            className="fill" 
            style={{ width: `${task.progress || 0}%` }}
          ></div>
          <span className="percentage">{task.progress || 0}%</span>
        </div>
      </div>
      
      <div className="execution-status">
        <div className="status-grid">
          <div className="status-item">
            <label>Status:</label>
            <span className={`badge ${task.status.toLowerCase().replace(' ', '-')}`}>
              {task.status}
            </span>
          </div>
          <div className="status-item">
            <label>Started:</label>
            <span>{formatStartTime(task.startTime)}</span>
          </div>
          <div className="status-item">
            <label>Last Update:</label>
            <span>{formatTimestamp(task.lastUpdate)}</span>
          </div>
          <div className="status-item">
            <label>ETA:</label>
            <span>{calculateETA(task)}</span>
          </div>
        </div>
      </div>
      
      <TaskMetrics metrics={task.metrics} />
    </div>
  );
};
```

#### Simple File Management (Next.js/React)
```tsx
// Simplified polling-based approach - no file watching needed
const TaskMonitor = () => {
  const [taskData, setTaskData] = useState<TaskData | null>(null);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('offline');
  const [selectedFile, setSelectedFile] = useState('No file selected');

  // Simple polling every 5 seconds
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data = await response.json();
          setTaskData(data);
          setConnectionStatus('live');
        } else if (response.status === 404) {
          setConnectionStatus('offline'); // No file uploaded yet
        } else {
          setConnectionStatus('error');
        }
      } catch (error) {
        setConnectionStatus('error');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('tasks', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSelectedFile(file.name);
        setConnectionStatus('live');
        
        // Immediately fetch the uploaded data
        const tasksResponse = await fetch('/api/tasks');
        if (tasksResponse.ok) {
          const data = await tasksResponse.json();
          setTaskData(data);
        }
      } else {
        setConnectionStatus('error');
        alert('Error uploading file. Please ensure it\'s a valid JSON file.');
      }
    } catch (error) {
      setConnectionStatus('error');
      alert('Error uploading file.');
    }
  };

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
  };

  // Get connection status display
  const getConnectionBadge = () => {
    const variants = {
      live: '🔴 Live',
      offline: '⚫ Offline', 
      error: '🟠 Error',
    };
    return variants[connectionStatus] || '⚫ Offline';
  };

  return (
    // ... UI components using state values above
  );
};
```

#### Navigation Functions (JavaScript)
```javascript
// Core navigation functions for task management
const NavigationController = {
  
  // Navigate to a specific task by ID
  navigateToTask: function(taskId) {
    const task = this.findTaskById(taskId);
    if (task) {
      this.setCurrentTask(task);
      this.addToHistory(taskId);
      this.updateURL(taskId);
      this.loadTaskDetails(taskId);
    }
  },

  // Navigate to task dependencies
  navigateToDependency: function(dependencyId) {
    this.navigateToTask(dependencyId);
    this.highlightDependencyChain(dependencyId);
  },

  // Drill down into subtasks
  drillDownToSubtask: function(subtaskId) {
    const subtask = this.findSubtaskById(subtaskId);
    if (subtask) {
      this.showSubtaskModal(subtask);
      this.loadSubtaskDetails(subtaskId);
    }
  },

  // Navigate within subtask hierarchy
  navigateToParentTask: function() {
    const currentTask = this.getCurrentTask();
    if (currentTask.parentId) {
      this.navigateToTask(currentTask.parentId);
    }
  },

  // Search and filter functions
  searchTasks: function(query) {
    const results = this.getAllTasks().filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  },

  // Task history management
  addToHistory: function(taskId) {
    let history = JSON.parse(localStorage.getItem('taskHistory') || '[]');
    history = [taskId, ...history.filter(id => id !== taskId)];
    localStorage.setItem('taskHistory', JSON.stringify(history.slice(0, 10)));
    this.updateHistoryUI(history);
  },

  getTaskHistory: function() {
    return JSON.parse(localStorage.getItem('taskHistory') || '[]');
  },

  // URL management for deep linking
  updateURL: function(taskId) {
    const url = new URL(window.location);
    url.searchParams.set('task', taskId);
    window.history.pushState(null, '', url);
  },

  // Load task from URL on page load
  loadTaskFromURL: function() {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get('task');
    if (taskId) {
      this.navigateToTask(taskId);
    }
  },

  // Helper functions
  findTaskById: function(taskId) {
    // Implementation to search through all tasks and subtasks
    return window.taskData.findTask(taskId);
  },

  findSubtaskById: function(subtaskId) {
    const [parentId, subId] = subtaskId.split('.');
    const parentTask = this.findTaskById(parentId);
    return parentTask?.subtasks?.find(sub => sub.id === parseInt(subId));
  }
};

// Keyboard shortcuts for navigation
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        NavigationController.navigateToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        NavigationController.navigateToNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        NavigationController.navigateToParentTask();
        break;
      case 'f':
        e.preventDefault();
        document.querySelector('.task-search').focus();
        break;
    }
  }
});
```

### 3. Styling (CSS)

```css
/* Main Layout */
.task-monitor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  background: #1a1a1a;
  color: #e0e0e0;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2d2d2d;
  border-bottom: 2px solid #3a3a3a;
}

.monitor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.main-panel {
  flex: 0.7;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

/* Current Task Panel */
.current-task-panel {
  background: #2a2a2a;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #3a3a3a;
}

.progress-bar-large {
  position: relative;
  height: 12px;
  background: #3a3a3a;
  border-radius: 6px;
  margin: 1rem 0;
}

.progress-bar-large .fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.percentage {
  position: absolute;
  right: 8px;
  top: -25px;
  font-size: 0.9rem;
  font-weight: bold;
}

/* Status Grid */
.status-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.status-item label {
  font-size: 0.8rem;
  color: #888;
  text-transform: uppercase;
}

/* Status Badges */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
  width: fit-content;
}

.badge.in-progress {
  background: #ff9800;
  color: #000;
}

.badge.done {
  background: #4CAF50;
  color: #fff;
}

.badge.pending {
  background: #666;
  color: #fff;
}

/* Execution Log */
.execution-log {
  flex: 1;
  background: #1e1e1e;
  border-radius: 8px;
  border: 1px solid #3a3a3a;
  display: flex;
  flex-direction: column;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  font-family: 'Monaco', monospace;
  font-size: 0.9rem;
}

.log-entry {
  padding: 0.5rem 0;
  border-bottom: 1px solid #2a2a2a;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Sidebar */
.sidebar {
  flex: 0.3;
  padding: 1rem;
  background: #252525;
  border-left: 2px solid #3a3a3a;
  overflow-y: auto;
}

/* Connection Status */
.connection-status.connected {
  color: #4CAF50;
}

.connection-status.disconnected {
  color: #f44336;
}

/* Header Bar Styles */
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1a1a1a;
  border-bottom: 1px solid #3a3a3a;
}

.header-bar .title {
  margin: 0;
  font-size: 1.5rem;
  color: #4CAF50;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* File Selection Button */
.file-select-btn {
  background: #4CAF50;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}

.file-select-btn:hover {
  background: #45a049;
}

/* File Indicator */
.current-file-indicator {
  font-size: 0.9rem;
  color: #ccc;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.25rem 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
  border: 1px solid #4a4a4a;
}

/* Auto-Refresh Button */
.auto-refresh-btn {
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.auto-refresh-btn.active {
  background: #4CAF50;
  color: #fff;
  border-color: #4CAF50;
}

.auto-refresh-btn:hover {
  background: #4a4a4a;
}

.auto-refresh-btn.active:hover {
  background: #45a049;
}

/* Settings Button */
.settings-btn {
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.settings-btn:hover {
  background: #4a4a4a;
}

/* Status Indicator */
.status-indicator {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.status-indicator.live {
  background: #4CAF50;
  color: #fff;
}

.status-indicator.offline {
  background: #666;
  color: #fff;
}

.status-indicator.error {
  background: #f44336;
  color: #fff;
}

/* Task Navigation Bar */
.task-navigation-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: #2a2a2a;
  border-bottom: 1px solid #3a3a3a;
}

.navigation-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-btn:hover {
  background: #4a4a4a;
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-dropdown {
  background: #2a2a2a;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  padding: 0.5rem;
  border-radius: 4px;
  min-width: 200px;
}

.quick-access {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.task-search {
  background: #2a2a2a;
  border: 1px solid #4a4a4a;
  color: #e0e0e0;
  padding: 0.5rem;
  border-radius: 4px;
  width: 200px;
}



/* Breadcrumb Navigation */
.breadcrumb-nav {
  margin: 0.5rem 0;
}

.breadcrumb {
  color: #888;
  font-size: 0.9rem;
}

/* Status Badge in Header */
.status-badge {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.status-badge.pending {
  background: #ffa726;
  color: #000;
}

.status-badge.in-progress {
  background: #4CAF50;
  color: #fff;
}

.status-badge.done {
  background: #2196F3;
  color: #fff;
}

.status-badge.cancelled {
  background: #f44336;
  color: #fff;
}

/* Enhanced Task Details */
.task-details-section {
  margin: 1rem 0;
}

.task-info h4 {
  margin: 1rem 0 0.5rem 0;
  color: #ccc;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.task-info p {
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

/* Dependencies */
.dependencies-list {
  margin: 0.5rem 0;
}

.dependency-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 4px;
  margin: 0.25rem 0;
  cursor: pointer;
  transition: background 0.2s;
}

.dependency-item:hover {
  background: #3a3a3a;
}

.dependency-item.clickable {
  cursor: pointer;
}

.nav-arrow {
  font-size: 0.8rem;
  color: #4CAF50;
}



/* Sidebar Navigation */
.task-hierarchy {
  margin-bottom: 1.5rem;
}

.hierarchy-tree {
  font-family: monospace;
}

.task-node {
  margin: 0.5rem 0;
}

.task-name {
  color: #e0e0e0;
  cursor: pointer;
}

.task-name:hover {
  color: #4CAF50;
}

.subtask-list {
  margin-left: 1rem;
  border-left: 2px solid #3a3a3a;
  padding-left: 0.5rem;
}

.subtask-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  cursor: pointer;
}

.subtask-node:hover {
  background: #2a2a2a;
}

.subtask-node.current {
  background: #3a3a3a;
  font-weight: bold;
}

/* Dependencies Panel */
.dependencies-panel {
  margin-bottom: 1.5rem;
}

.dependency-item,
.dependent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  background: #2a2a2a;
  border-radius: 4px;
  margin: 0.25rem 0;
  cursor: pointer;
}

.dependency-item:hover,
.dependent-item:hover {
  background: #3a3a3a;
}







/* Responsive Design */
@media (max-width: 768px) {
  .monitor-content {
    flex-direction: column;
  }
  
  .main-panel {
    flex: none;
    height: 60vh;
  }
  
  .sidebar {
    flex: none;
    height: 40vh;
  }

  .task-navigation-bar {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .navigation-controls {
    order: 2;
  }

  .quick-access {
    order: 1;
  }

  .jump-to-task {
    order: 3;
  }

  .task-dropdown {
    min-width: 150px;
  }
}
```

### 4. Configuration

#### Environment Variables
```bash
# Backend
PORT=3001
WEBSOCKET_PORT=3002
TASK_FILE_PATH=.taskmaster/tasks/tasks.json
UPDATE_INTERVAL=5000
LOG_LEVEL=info

# Frontend
REACT_APP_WEBSOCKET_URL=ws://localhost:3002
REACT_APP_API_URL=http://localhost:3001
REACT_APP_REFRESH_INTERVAL=5000
```

#### Package Dependencies
```json
// package.json (Next.js Full Stack)
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "formidable": "^3.5.1",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/formidable": "^3.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 3. shadcn/ui Setup
```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add card
npx shadcn-ui@latest add select
npx shadcn-ui@latest add progress
```

## Performance Considerations

### Optimization Strategies
1. **Polling Optimization**: Configurable 5-second intervals (no real-time overhead)
2. **React Optimization**: Use React.memo and useMemo for task components
3. **File Handling**: Simple file upload with basic validation
4. **Memory Management**: Minimal state management, no persistent storage
5. **Static Generation**: Use Next.js static optimization where possible

### Monitoring Metrics
- **API Response Time**: < 200ms for file operations
- **Memory Usage**: Minimal with no caching or persistent connections
- **Update Frequency**: Simple 5-second polling intervals
- **Error Rates**: Basic error handling for file operations

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Simple Deployment                           │
├─────────────────────────────────────────────────────────────────┤
│ Next.js App: Deployed on Vercel/Netlify                       │
│ API Routes: Serverless functions (built-in)                    │
│ File Storage: /uploads directory (or cloud storage)            │
│ No Database: File-based operation only                         │
│ No Cache: Direct file reading on each request                  │
└─────────────────────────────────────────────────────────────────┘
```

This design provides a simplified real-time task monitoring system focused on task navigation, clear status visibility, and essential task information optimized for development workflow monitoring.

---

## Data Source Mapping

This section defines exactly which JSON fields map to each UI component, providing a clear reference for implementation.

### JSON Structure Overview
```json
{
  "master": {
    "tasks": [
      {
        "id": 1,
        "title": "string",
        "description": "string",
        "details": "string",
        "testStrategy": "string",
        "status": "string",
        "dependencies": [1, 2],
        "priority": "string",
        "subtasks": [
          {
            "id": 1,
            "title": "string",
            "description": "string",
            "dependencies": [],
            "details": "string",
            "status": "string",
            "testStrategy": "string",
            "parentTaskId": 2
          }
        ]
      }
    ],
    "metadata": {
      "created": "2025-07-03T11:58:17.628Z",
      "updated": "2025-07-03T15:51:35.780Z",
      "description": "Tasks for modifying the codebase structure and removing unwanted features"
    }
  },
  "coverage": {
    "tasks": [...],
    "metadata": {...}
  }
}
```

### Header Bar Components

| UI Component | JSON Path | Purpose/Example Value |
|--------------|-----------|----------------------|
| File Selection Button | N/A | Opens file dialog to select JSON source |
| Current File Indicator | Selected file path | `"tasks.json"` or `"No file selected"` |
| Auto-Refresh Toggle | N/A | Enables/disables 5-second file monitoring |
| Settings Button | N/A | Opens configuration options |
| Status Indicator | Connection state | `🔴 Live` / `⚫ Offline` / `🟠 Error` |

### Context Selector Components

| UI Component | JSON Path | Example Value |
|--------------|-----------|---------------|
| Context Name | `{contextName}` (object key) | `"master"`, `"coverage"` |
| Task Count | `{contextName}.tasks.length` | `4`, `30` |
| Completed Count | `{contextName}.tasks.filter(t => t.status === "done").length` | `4`, `3` |
| Progress Percentage | `(completedCount / totalCount) * 100` | `100%`, `10%` |
| Context Description | `{contextName}.metadata.description` | `"Tasks for modifying the codebase structure and removing unwanted features"` |
| Last Updated | `{contextName}.metadata.updated` | `"2025-07-03T15:51:35.780Z"` |

### Task Navigation Bar Components

| UI Component | JSON Path | Example Value |
|--------------|-----------|---------------|
| Current Task ID | `tasks[currentIndex].id` | `3` |
| Current Task Title | `tasks[currentIndex].title` | `"Execute and Fix Unit Tests in pkg/infra/http/server/config Directory"` |
| Status Badge | `tasks[currentIndex].status` | `"done"`, `"in-progress"`, `"pending"` |
| Task Dropdown Options | `tasks[].id + ": " + tasks[].title` | `"1: Remove All Preset Functionality from go-service-template Codebase"` |
| Search Results | Filter `tasks[]` by `title` or `description` containing search term | Filtered task array |

### Main Task Details Panel

| UI Component | JSON Path | Example Value |
|--------------|-----------|---------------|
| **Task Header** |
| Task ID | `tasks[current].id` | `3` |
| Task Title | `tasks[current].title` | `"Execute and Fix Unit Tests in pkg/infra/http/server/config Directory"` |
| Status | `tasks[current].status` | `"done"` |
| Priority | `tasks[current].priority` | `"high"`, `"medium"`, `"low"` |
| **Task Content** |
| Description | `tasks[current].description` | `"Run all unit tests specifically in the pkg/infra/http/server/config directory..."` |
| Details | `tasks[current].details` | `"**Phase 1: Targeted Test Execution**\n- Execute \`go test -v ./pkg/infra/http/server/config/...\`..."` |
| Test Strategy | `tasks[current].testStrategy` | `"**Validation Steps:**\n1. **Initial Assessment**: Run \`go test -v..."` |
| **Progress Info** |
| Subtask Count | `tasks[current].subtasks.length` | `0`, `4` |
| Completed Subtasks | `tasks[current].subtasks.filter(s => s.status === "done").length` | `3` |
| Progress Percentage | `(completedSubtasks / totalSubtasks) * 100` | `75%` |

### Sidebar - Task Hierarchy

| UI Component | JSON Path | Example Value |
|--------------|-----------|---------------|
| **Parent Task** |
| Parent ID | `tasks[].id` | `1` |
| Parent Title | `tasks[].title` | `"Remove All Preset Functionality"` |
| Parent Status | `tasks[].status` | `"done"` |
| **Subtasks** |
| Subtask ID | `tasks[].subtasks[].id` | `1`, `2`, `3`, `4` |
| Subtask Title | `tasks[].subtasks[].title` | `"Discovery and Analysis of Preset-Related Code"` |
| Subtask Status | `tasks[].subtasks[].status` | `"done"` |
| Subtask Dependencies | `tasks[].subtasks[].dependencies[]` | `[1, 2]` |
| **Dependencies** |
| Dependency Task IDs | `tasks[current].dependencies[]` | `[1, 2]` |
| Dependency Status | Find task by ID, check `tasks[id].status` | `"done"` |
| Dependency Title | Find task by ID, get `tasks[id].title` | `"Remove All Preset Functionality"` |

### Status Indicators and Visual Elements

| UI Component | JSON Field | Possible Values | Display |
|--------------|------------|-----------------|---------|
| Status Badge Color | `status` | `"pending"` | 🟡 (Yellow) |
| | | `"in-progress"` | 🟢 (Green) |
| | | `"done"` | 🔵 (Blue) |
| Priority Color | `priority` | `"high"` | Red border/text |
| | | `"medium"` | Yellow border/text |
| | | `"low"` | Blue border/text |
| Dependency Status | `dependencies[]` -> lookup status | `"done"` | ✅ |
| | | `"pending"`, `"in-progress"` | ⏱️ |

### Timestamps and Metadata

| UI Component | JSON Path | Format |
|--------------|-----------|--------|
| Last Updated | `{contextName}.metadata.updated` | `"2025-07-03T15:51:35.780Z"` → `"Jul 3, 15:51"` |
| Created Date | `{contextName}.metadata.created` | `"2025-07-03T11:58:17.628Z"` → `"Jul 3, 11:58"` |
| Task Update Time | Extract from `tasks[].subtasks[].details` text parsing | `"<info added on 2025-07-03T17:53:34.707Z>"` → `"17:53"` |

### Navigation State Management

| UI State | Data Source | Description |
|----------|-------------|-------------|
| Current Context | Application state + JSON object keys | `"master"` or `"coverage"` |
| Current Task Index | Application state + `tasks[]` array position | `2` (3rd task in array) |
| Navigation History | Application state | Array of previously viewed task IDs |
| Search Query | Application state | Current search filter string |
| Selected Subtask | Application state | Currently selected subtask ID for drill-down |

### File Management Workflow

| Action | Implementation | Data Flow |
|--------|---------------|-----------|
| **File Selection** | `openFileDialog()` → File Input → `handleFileSelection()` | Browser FileReader API → JSON.parse() → Update UI |
| **Auto-Refresh** | `toggleAutoRefresh()` → `setInterval(5000ms)` → `checkForUpdates()` | File modification check → Re-read file → Compare data → Update UI |
| **Status Updates** | `updateConnectionStatus()` | Live: File loaded & monitoring / Offline: No file selected / Error: JSON parse failed |
| **File Monitoring** | `startFileWatching()` / `stopFileWatching()` | Periodic file checks every 5 seconds when auto-refresh enabled |

### Real-Time Update Fields

| Update Type | JSON Fields to Monitor | Trigger Event |
|-------------|------------------------|---------------|
| Status Change | `tasks[].status`, `subtasks[].status` | Status indicator update |
| Progress Update | `tasks[].subtasks[].status` (count changes) | Progress bar update |
| Content Update | `tasks[].details` (info blocks added) | Details section refresh |
| New Tasks | `tasks[]` array length change | Task list refresh |
| Context Switch | Active context change | Full UI refresh |

### Implementation Notes

**File Watching:**
- Monitor `tasks.json` file for changes
- Parse JSON and update UI components based on field mappings above
- Use WebSocket or file system events for real-time updates

**Data Validation:**
- Verify required fields exist before rendering: `id`, `title`, `status`
- Provide fallback values for optional fields: `description`, `details`, `testStrategy`, `priority`
- Handle missing `subtasks` array (treat as empty array)
- Handle missing `dependencies` array (treat as empty array)

**Performance Considerations:**
- Cache parsed JSON to avoid re-parsing on every update
- Update only changed UI components based on field diffs
- Use virtual scrolling for large task lists (>100 tasks) 