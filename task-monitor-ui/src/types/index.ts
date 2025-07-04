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
  filePath: string;
  createdAt: string;
  lastUsed?: string;
  hasError?: boolean;
  errorMessage?: string;
}

export interface CreateSourceRequest {
  name: string;
  file: File;
}

export interface SourcesResponse {
  sources: Source[];
} 