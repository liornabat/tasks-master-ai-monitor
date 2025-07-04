# Task Execution Monitor

A modern web application for monitoring and tracking task execution progress with real-time updates and comprehensive task management features.

## Features

### 🔄 Source Management System
- **Multiple Data Sources**: Create and manage multiple task data sources
- **Easy Source Creation**: Upload JSON task files with drag-and-drop or file picker
- **Source Organization**: Give custom names to your task sources for easy identification
- **Error Detection**: Automatic detection and reporting of missing or corrupted source files
- **Auto-Migration**: Seamlessly migrates existing `uploads/tasks.json` files to the new source system

### 📋 Task Management
- **Task Overview**: Comprehensive view of all tasks with status indicators
- **Subtask Support**: Detailed breakdown of tasks into manageable subtasks
- **Context Switching**: Support for multiple task contexts (tags) within each source
- **Dependency Tracking**: Visual representation of task dependencies with clickable navigation
- **Status Management**: Track task progress through various states (pending, in-progress, done, etc.)

### 🔍 Advanced Search & Navigation
- **Comprehensive Search**: Search across all task and subtask fields including titles, descriptions, details, test strategies, status, priority, and dependencies
- **Smart Navigation**: Click on dependency badges to instantly navigate to related tasks
- **Hierarchy Navigation**: Easy switching between main tasks and subtasks
- **Progress Indicators**: Visual progress bars for tasks with subtasks

### 💻 User Interface
- **Responsive Design**: Optimized for various screen sizes
- **Light Theme**: Clean, professional interface optimized for productivity
- **Real-time Updates**: Auto-refresh functionality with 5-second polling
- **Markdown Support**: Rich text rendering for task details and test strategies with syntax highlighting
- **Keyboard Navigation**: Efficient navigation using keyboard shortcuts

### 🔧 Technical Features
- **Next.js 15**: Built with the latest Next.js App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Modern styling with consistent design system
- **API Integration**: RESTful API endpoints for all data operations
- **File Management**: Secure file storage and retrieval system

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- JSON task files (supports Task Master AI format)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-monitor-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### First Time Setup

1. **Create Your First Source**
   - Click "Add Source" when you first open the application
   - Give your source a descriptive name (e.g., "My Project Tasks")
   - Upload your JSON tasks file using drag-and-drop or file picker

2. **Automatic Migration**
   - If you have an existing `uploads/tasks.json` file, it will be automatically migrated to a source named "Migrated Tasks"

## Source Management

### Creating Sources
1. Click "Add Source" or access "Manage Sources..." from the source dropdown
2. Enter a descriptive name for your source
3. Upload a JSON file containing your task data
4. The source will be automatically validated and added to your collection

### Managing Sources
- **Switch Sources**: Use the dropdown in the header to switch between different task sources
- **View Source Details**: Access the "Manage Sources..." option to see all sources with creation dates, last used times, and file information
- **Delete Sources**: Remove sources you no longer need (with confirmation prompt)
- **Error Handling**: Sources with missing or corrupted files are clearly marked with error indicators

### Supported File Formats
- JSON files containing task data
- Task Master AI format with support for tagged task lists
- Legacy single-context task lists

## Usage

### Basic Navigation
1. **Select a Source**: Choose your data source from the dropdown
2. **Browse Tasks**: View all tasks in the left sidebar with status indicators and progress bars
3. **Select Tasks**: Click on any task to view detailed information
4. **Navigate Dependencies**: Click on dependency badges to jump to related tasks
5. **Search**: Use the search box to find specific tasks or content

### Task Details
Each task displays:
- **Title and ID**: Clear identification with dot notation (1., 2., etc.)
- **Status and Priority**: Visual badges showing current state and importance
- **Dependencies**: Clickable badges linking to prerequisite tasks
- **Description**: Overview of what the task involves
- **Implementation Details**: Technical specifications and requirements (with Markdown support)
- **Test Strategy**: Verification and testing approach (with Markdown support)
- **Subtasks**: Breakdown into smaller, manageable components

### Search Functionality
The search feature looks through:
- Task and subtask titles
- Descriptions and details
- Test strategies
- Status and priority values
- Task IDs and dependency relationships
- All text content within tasks

## API Endpoints

### Sources Management
- `GET /api/sources` - List all sources
- `POST /api/sources` - Create a new source
- `DELETE /api/sources/[id]` - Delete a source
- `POST /api/sources/migrate` - Migrate existing uploads/tasks.json

### Task Data
- `GET /api/tasks?source=[sourceId]` - Get tasks from specific source

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Custom components with shadcn/ui base
- **State Management**: React hooks for local state
- **Data Fetching**: Native fetch API with error handling

### Backend
- **API Routes**: Next.js API routes
- **File Storage**: Local filesystem with organized directory structure
- **Data Format**: JSON with full validation
- **Error Handling**: Comprehensive error detection and reporting

### File Structure
```
sources/
├── sources.json          # Source metadata
└── files/               # Actual task files
    ├── source-1.json
    ├── source-2.json
    └── ...
```

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production
```bash
npm run build
npm run start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
