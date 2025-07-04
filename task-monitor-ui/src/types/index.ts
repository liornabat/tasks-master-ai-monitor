export interface Task {
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

export interface Subtask {
  id: number;
  title: string;
  description: string;
  dependencies: number[];
  details: string;
  status: string;
  testStrategy: string;
  parentTaskId?: number;
}

export interface TaskData {
  tags: {
    [context: string]: {
      tasks: Task[];
      metadata: {
        created: string;
        updated: string;
        description: string;
      };
    };
  };
}

export interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'error';
  lastUpdate?: string;
}

export interface Source {
  id: string;
  name: string;
  fileName: string;
  filePath?: string; // Local copy (backup)
  originalPath: string; // Always read from here first
  createdAt: string;
  lastUsed?: string;
  hasError?: boolean;
  errorMessage?: string;
  isUploaded?: boolean; // True if file was uploaded, false if path was specified
}

export interface CreateSourceRequest {
  name: string;
  file?: File; // For uploaded files
  filePath?: string; // For existing file paths
}

export interface SourcesResponse {
  sources: Source[];
} 