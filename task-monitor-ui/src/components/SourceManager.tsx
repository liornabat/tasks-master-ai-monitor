'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { XIcon, PlusIcon, TrashIcon, AlertTriangleIcon, CalendarIcon, FileIcon } from 'lucide-react';
import { Source } from '@/types';

interface SourceManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: Source[];
  onCreateNew: () => void;
  onDeleteSource: (sourceId: string) => Promise<void>;
}

const SourceManager: React.FC<SourceManagerProps> = ({
  isOpen,
  onClose,
  sources,
  onCreateNew,
  onDeleteSource,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (sourceId: string) => {
    if (window.confirm('Are you sure you want to delete this source? This action cannot be undone.')) {
      setDeletingId(sourceId);
      try {
        await onDeleteSource(sourceId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleCreateNew = () => {
    onClose();
    onCreateNew();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <CardTitle>Manage Sources</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateNew}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" />
              New Source
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          {sources.length === 0 ? (
            <div className="text-center py-12">
              <FileIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Sources</h3>
              <p className="text-gray-500">
                Create your first source to start monitoring tasks.
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="border-b border-gray-200 last:border-b-0 p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{source.name}</h3>
                        {source.hasError && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangleIcon className="h-3 w-3" />
                            Error
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <FileIcon className="h-4 w-4" />
                          <span>{source.fileName}</span>
                          <Badge variant={source.isUploaded ? "default" : "secondary"} className="text-xs">
                            {source.isUploaded ? "Uploaded" : "Path"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-500 min-w-fit">Path:</span>
                          <span className="text-xs font-mono break-all">{source.originalPath}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>Created: {formatDate(source.createdAt)}</span>
                        </div>
                        
                        {source.lastUsed && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span>Last used: {formatDate(source.lastUsed)}</span>
                          </div>
                        )}
                        
                        {source.hasError && source.errorMessage && (
                          <div className="text-red-600 text-xs bg-red-50 p-2 rounded mt-2">
                            {source.errorMessage}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(source.id)}
                      disabled={deletingId === source.id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deletingId === source.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <TrashIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceManager; 