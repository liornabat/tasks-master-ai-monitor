# 🎯 Task Master AI Monitor

A modern, real-time task monitoring dashboard for Task Master AI projects. Built with Next.js, TypeScript, and Tailwind CSS, this tool provides an intuitive interface for tracking task progress, managing multiple project sources, and monitoring development workflows.

![Task Monitor Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![License](https://img.shields.io/badge/License-MIT-green)


## 📸 Screenshots

### Dashboard Overview
![Task Master AI Monitor Dashboard](![img.png](docs/img.png)

*The main dashboard showing the task monitoring interface with source management, tag selection, task list, and detailed task view with subtasks.*

### Key Interface Elements:
- **Source Selector**: Switch between different project sources (QAutonomus shown)
- **Tag/Context Selector**: Filter tasks by context (Iframe-Fixes shown)
- **Auto-Refresh Toggle**: Real-time monitoring with connection status
- **Task List**: Hierarchical view of all tasks with status indicators
- **Task Details**: Comprehensive task information with progress tracking
- **Subtask Panel**: Detailed subtask management with completion status
- **Progress Visualization**: Visual progress bars showing completion percentage

The interface demonstrates a completed task "Remove Security and Validation Barriers" with 4 subtasks, showing 100% completion with detailed breakdown of each subtask's status.
## ✨ Features

### 🎛️ **Multi-Source Management**
- **Source Switching**: Manage multiple Task Master projects from a single dashboard
- **Source-Specific Context Memory**: Each source remembers its last used tag/context
- **File Upload Support**: Import tasks.json files or specify local file paths
- **Auto-Migration**: Seamlessly migrate existing tasks to the new source system

### 🏷️ **Tag-Based Organization**
- **Context Switching**: Switch between different task contexts (master, feature branches, etc.)
- **Persistent Context**: Each source maintains its own active context independently
- **Tag Memory**: Returns to the exact tag you were using when switching between sources

### 📋 **Advanced Task Management**
- **Real-Time Monitoring**: Auto-refresh every 5 seconds (configurable)
- **Hierarchical View**: View tasks with their subtasks in an organized layout
- **Task Details**: Comprehensive task information including dependencies, status, and progress
- **Subtask Navigation**: Click to view detailed subtask information
- **Dependency Tracking**: Visual dependency links with navigation

### 🔍 **Smart Search & Filtering**
- **Global Search**: Search across task titles, descriptions, details, and dependencies
- **Status Filtering**: Filter tasks by status (pending, in-progress, done, etc.)
- **Real-Time Results**: Instant search results as you type

### 💾 **Data Persistence**
- **Local Storage**: Remembers your preferences, selected sources, and contexts
- **Session Continuity**: Maintains state across browser sessions
- **Settings Memory**: Auto-refresh preferences and UI settings persist

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Progress Visualization**: Visual progress bars for tasks with subtasks
- **Status Indicators**: Color-coded status badges and icons
- **Intuitive Navigation**: Clean, organized interface with logical information hierarchy

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Task Master AI** project with tasks.json files

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tasks-master-ai-monitor.git
   cd tasks-master-ai-monitor
   ```

2. **Install dependencies**
   ```bash
   cd task-monitor-ui
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📖 Usage Guide

### Getting Started

1. **First Launch**: The app will automatically check for existing tasks.json files
2. **Create a Source**: Click "Manage Sources" to add your first task source
3. **Start Monitoring**: Select your source and begin tracking your tasks

### Managing Sources

#### Adding a New Source
1. Click the source dropdown and select "Manage Sources"
2. Click "Create New Source"
3. Specify a local file system path

#### Source Management
- **Switch Sources**: Use the dropdown in the header to change active source
- **Delete Sources**: Remove sources you no longer need
- **Auto-Selection**: The most recently used source is automatically selected

### Working with Tasks

#### Task Navigation
- **Task List**: Browse all tasks in the left sidebar
- **Task Selection**: Click any task to view detailed information
- **Search**: Use the search bar to find specific tasks
- **Filtering**: Filter by status using the status dropdown

#### Subtask Management
- **View Subtasks**: Subtasks appear in the right panel when a parent task is selected
- **Subtask Details**: Click any subtask to view its detailed information
- **Back Navigation**: Use "← Back to main task" to return to the parent task
- **Progress Tracking**: Visual progress bars show completion status

#### Context Switching
- **Tag Selection**: Use the context dropdown to switch between tags (master, feature branches, etc.)
- **Context Memory**: Each source remembers its last used context
- **Independent Contexts**: Different sources maintain separate active contexts

### Real-Time Features

#### Auto-Refresh
- **Automatic Updates**: Tasks refresh every 5 seconds by default
- **Toggle Control**: Disable auto-refresh using the toggle in the header
- **Manual Refresh**: Force refresh by toggling auto-refresh off and on
- **Connection Status**: Visual indicator shows connection status

#### Live Data
- **Task Updates**: See task status changes in real-time
- **New Tasks**: Newly added tasks appear automatically
- **Progress Updates**: Subtask completion updates parent task progress

## 🛠️ Configuration

### Environment Variables

Create a `.env.local` file in the `task-monitor-ui` directory:

```env
# Application Settings
NEXT_PUBLIC_APP_NAME="Task Master AI Monitor"
NEXT_PUBLIC_AUTO_REFRESH_INTERVAL=5000

# File Upload Settings  
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB
NEXT_PUBLIC_ALLOWED_FILE_TYPES=".json"

# Development Settings
NEXT_PUBLIC_DEBUG_MODE=false
```

### Customization

#### Refresh Interval
Modify the auto-refresh interval in `TaskMonitor.tsx`:

```typescript
const interval = setInterval(fetchData, 5000); // 5 seconds
```

#### Storage Keys
Customize localStorage keys in the component:

```typescript
// Modify these keys if needed
'taskMonitor.selectedSourceId'
'taskMonitor.sourceContexts'
'taskMonitor.isAutoRefresh'
```

## 📁 Project Structure

```
tasks-master-ai-monitor/
├── task-monitor-ui/              # Next.js application
│   ├── src/
│   │   ├── app/                  # App router pages
│   │   │   ├── api/              # API routes
│   │   │   │   ├── sources/      # Source management endpoints
│   │   │   │   ├── tasks/        # Task data endpoints
│   │   │   │   └── upload/       # File upload endpoints
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── page.tsx          # Home page
│   │   ├── components/           # React components
│   │   │   ├── ui/               # Reusable UI components
│   │   │   ├── TaskMonitor.tsx   # Main application component
│   │   │   ├── TaskPanel.tsx     # Task detail view
│   │   │   ├── NavigationSidebar.tsx # Task list sidebar
│   │   │   ├── Header.tsx        # Application header
│   │   │   ├── SourceManager.tsx # Source management modal
│   │   │   └── ...               # Other components
│   │   ├── types/                # TypeScript type definitions
│   │   └── lib/                  # Utility functions
│   ├── public/                   # Static assets
│   ├── uploads/                  # Uploaded files directory
│   ├── sources/                  # Source metadata storage
│   └── package.json              # Dependencies and scripts
└── README.md                     # This file
```

## 🔌 API Reference

### Sources API

#### `GET /api/sources`
Get all available sources

**Response:**
```json
{
  "sources": [
    {
      "id": "uuid",
      "name": "Project Name",
      "filePath": "/path/to/tasks.json",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastAccessed": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/sources`
Create a new source

**Request:**
```json
{
  "name": "Project Name",
  "file": "File object or null",
  "filePath": "/path/to/tasks.json or null"
}
```

#### `DELETE /api/sources/[id]`
Delete a source

### Tasks API

#### `GET /api/tasks?source=sourceId`
Get tasks for a specific source

**Response:**
```json
{
  "tags": {
    "master": {
      "tasks": [
        {
          "id": 1,
          "title": "Task Title",
          "description": "Task Description",
          "status": "pending",
          "priority": "high",
          "dependencies": [2, 3],
          "subtasks": [...]
        }
      ]
    }
  }
}
```

### Upload API

#### `POST /api/upload`
Upload a tasks.json file

**Request:** Multipart form data with file

## 🧪 Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Building

```bash
# Development build
npm run dev

# Production build
npm run build

# Analyze bundle
npm run analyze
```

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: All code must be properly typed
- **ESLint**: Follow the configured linting rules
- **Prettier**: Use consistent code formatting
- **Testing**: Add tests for new functionality
- **Documentation**: Update docs for API changes

## 🐛 Troubleshooting

### Common Issues

#### Tasks Not Loading
- **Check Source**: Ensure your source is properly configured
- **File Path**: Verify the tasks.json file path is correct
- **File Format**: Ensure the JSON file is valid Task Master format
- **Permissions**: Check file system permissions for local file access

#### Auto-Refresh Not Working
- **Toggle**: Try turning auto-refresh off and on
- **Browser**: Check browser console for errors
- **Source**: Ensure source is properly selected
- **Connection**: Check network connectivity

#### Sources Not Saving
- **Local Storage**: Check if localStorage is enabled
- **Disk Space**: Ensure sufficient disk space for uploads
- **File Size**: Check if file exceeds maximum size limit

### Getting Help

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/tasks-master-ai-monitor/issues)
- **Discussions**: Join discussions on [GitHub Discussions](https://github.com/yourusername/tasks-master-ai-monitor/discussions)
- **Documentation**: Check the [Wiki](https://github.com/yourusername/tasks-master-ai-monitor/wiki) for detailed guides

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Task Master AI**: The core task management system this monitor supports
- **Next.js Team**: For the amazing React framework
- **Vercel**: For the deployment platform
- **Tailwind CSS**: For the utility-first CSS framework
- **Contributors**: All the amazing people who contribute to this project


### Version History

#### v1.0.0 (Current)
- ✅ Multi-source management
- ✅ Tag-based organization  
- ✅ Real-time monitoring
- ✅ Advanced search and filtering
- ✅ Source-specific context memory
- ✅ Subtask navigation
- ✅ Progress visualization

## 📊 Statistics

![GitHub stars](https://img.shields.io/github/stars/yourusername/tasks-master-ai-monitor)
![GitHub forks](https://img.shields.io/github/forks/yourusername/tasks-master-ai-monitor)
![GitHub issues](https://img.shields.io/github/issues/yourusername/tasks-master-ai-monitor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/tasks-master-ai-monitor)

---

<div align="center">

**[⭐ Star this project](https://github.com/yourusername/tasks-master-ai-monitor)** • **[🐛 Report Bug](https://github.com/yourusername/tasks-master-ai-monitor/issues)** • **[✨ Request Feature](https://github.com/yourusername/tasks-master-ai-monitor/issues)**

Made with ❤️ by the Task Master AI Monitor team

</div>