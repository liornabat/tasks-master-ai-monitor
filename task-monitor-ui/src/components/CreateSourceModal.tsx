'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XIcon } from 'lucide-react';
import { CreateSourceRequest } from '@/types';

interface CreateSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSourceRequest) => Promise<void>;
}

const CreateSourceModal: React.FC<CreateSourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [filePath, setFilePath] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isSubmitting) {
      setName('');
      setFilePath('');
      setError(null);
      onClose();
    }
  };

  const handlePathFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (selectedFile.name.endsWith('.json')) {
        // For security reasons, browsers don't expose full file paths
        // We'll help by suggesting common paths and showing the filename
        let suggestedPath = '';
        
        // Common task file paths
        if (selectedFile.name === 'tasks.json') {
          suggestedPath = '.taskmaster/tasks/tasks.json';
        } else {
          // Just use the filename as a starting point
          suggestedPath = selectedFile.name;
        }
        
        setFilePath(suggestedPath);
        
        if (!name) {
          // Auto-suggest name from filename
          setName(selectedFile.name.replace('.json', ''));
        }
        setError(null);
      } else {
        setError('Please select a JSON file');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Source name is required');
      return;
    }
    
    if (!filePath.trim()) {
      setError('Please specify a file path');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit({ name: name.trim(), filePath: filePath.trim() });
      handleClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create source');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Create New Source</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Source Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter source name"
                disabled={isSubmitting}
                className="w-full"
              />
            </div>

            {/* File Path Input */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  File Path
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="e.g., /path/to/tasks.json or .taskmaster/tasks/tasks.json"
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => !isSubmitting && pathFileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="px-3"
                  >
                    Browse
                  </Button>
                </div>
                <input
                  ref={pathFileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handlePathFileSelect}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  <p>Specify the absolute or relative path to your tasks.json file</p>
                  <p>• Click <strong>Browse</strong> to select a file and get path suggestions</p>
                  <p>• Example paths: <code>.taskmaster/tasks/tasks.json</code> or <code>/absolute/path/to/tasks.json</code></p>
                </div>
              </div>

            {/* Error Message */}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !name.trim() || !filePath.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Source'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSourceModal; 