# Task Master AI Monitor

A comprehensive project that combines **Task Master AI** (task management and planning) with a **Task Execution Monitor** (real-time monitoring interface) to provide a complete task management and monitoring solution.

## Project Overview

This repository contains two main components:

1. **Task Master AI Configuration** - Project initialization and task management using Task Master AI
2. **Task Monitor UI** - Real-time web interface for monitoring task execution and progress

## Repository Structure

```
tasks-master-ai-monitor/
├── .taskmaster/                 # Task Master AI configuration and files
│   ├── config.json             # AI model configuration
│   ├── docs/                   # Project documentation and PRDs
│   ├── reports/                # Task complexity analysis reports
│   └── tasks/                  # Generated task files
├── task-monitor-ui/            # Next.js monitoring application
│   ├── src/                    # Source code
│   ├── uploads/                # Uploaded task files
│   └── README.md               # UI application documentation
├── tasks.json                  # Current task data
└── README.md                   # This file
```

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Task Master AI CLI (optional, for task management)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tasks-master-ai-monitor.git
   cd tasks-master-ai-monitor
   ```

2. **Start the Task Monitor UI:**
   ```bash
   cd task-monitor-ui
   npm install
   npm run dev
   ```

3. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser

4. **Load task data:**
   The application comes with real task data pre-loaded. You can also upload your own task JSON files.

## Components

### 🤖 Task Master AI Integration

This project uses **Task Master AI** for intelligent task management:

- **Automated Task Generation**: Parse PRDs into structured tasks
- **Complexity Analysis**: AI-powered analysis of task complexity
- **Subtask Expansion**: Automatically break down complex tasks
- **Progress Tracking**: Monitor task completion and dependencies
- **Multiple Contexts**: Support for different project contexts (master, coverage, etc.)

**Key Features:**
- PRD parsing with AI-powered task generation
- Task complexity analysis and automated expansion
- Dependency management and validation
- Research-backed task updates using Perplexity AI
- Tag-based task organization for different contexts

### 🖥️ Task Monitor UI

A modern web interface for real-time task monitoring:

- **Live Monitoring**: Real-time task status updates
- **Interactive Navigation**: Easy task browsing and search
- **Visual Progress**: Progress bars and dependency visualization
- **Context Switching**: Switch between different task contexts
- **File Upload**: Support for uploading new task data

**Tech Stack:**
- Next.js 14 with App Router
- TypeScript for type safety
- shadcn/ui with Tailwind CSS
- Responsive design with dark theme

## Task Data Structure

The project works with structured JSON task data:

```json
{
  "master": {
    "tasks": [
      {
        "id": 1,
        "title": "Task Title",
        "description": "Task description",
        "details": "Implementation details",
        "testStrategy": "Testing approach",
        "status": "pending|in-progress|done",
        "priority": "high|medium|low",
        "dependencies": [2, 3],
        "subtasks": [...]
      }
    ],
    "metadata": {
      "created": "2023-11-01T10:00:00.000Z",
      "updated": "2023-11-05T15:30:00.000Z",
      "description": "Context description"
    }
  }
}
```

## Current Task Data

The repository includes real task data with two contexts:

- **Master Context**: Complex codebase modification tasks focused on removing preset functionality from a Go service template
- **Coverage Context**: Comprehensive testing and security validation tasks for achieving 100% test coverage

## Use Cases

### 🎯 Project Management
- Generate tasks from Project Requirements Documents (PRDs)
- Track progress across complex software projects
- Manage dependencies between tasks and subtasks
- Analyze task complexity and plan sprints

### 🔍 Development Monitoring
- Monitor real-time development progress
- Track task completion across team members
- Visualize project dependencies and blockers
- Search and filter tasks by various criteria

### 📊 Team Collaboration
- Share task progress with stakeholders
- Switch between different project contexts
- Upload and share task data across teams
- Generate reports on project completion

## Deployment

### Development
```bash
# Start the monitor UI in development mode
cd task-monitor-ui
npm run dev
```

### Production
```bash
# Build and start the production server
cd task-monitor-ui
npm run build
npm start
```

### Docker
```bash
# Build and run with Docker
cd task-monitor-ui
docker build -t task-monitor .
docker run -p 3000:3000 task-monitor
```

## Configuration

### Task Master AI
Configure AI models and settings in `.taskmaster/config.json`:
- Primary AI model for task generation
- Research model for enhanced analysis
- Fallback model configuration

### Monitor UI
Environment variables can be configured in `task-monitor-ui/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Contributing

We welcome contributions to both components:

1. **Task Master AI improvements**: Enhanced task generation, better complexity analysis
2. **Monitor UI enhancements**: New visualization features, improved user experience
3. **Integration features**: Better synchronization between AI and UI components

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both components if applicable
5. Submit a pull request

## Documentation

- **[Task Monitor UI Documentation](task-monitor-ui/README.md)** - Detailed documentation for the monitoring interface
- **[Task Master AI Documentation](.taskmaster/docs/)** - Project documentation and PRDs
- **[API Documentation](task-monitor-ui/src/app/api/)** - REST API endpoint documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Comprehensive guides and examples
- **Community**: Join discussions and share experiences

---

**A powerful combination of AI-driven task management and real-time monitoring for modern software development projects.**