'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Source } from '@/types';

interface SourceSelectorProps {
  sources: Source[];
  selectedSourceId: string | null;
  onSourceChange: (sourceId: string) => void;
  onManageSources: () => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({
  sources,
  selectedSourceId,
  onSourceChange,
  onManageSources,
}) => {
  const handleValueChange = (value: string) => {
    if (value === '__manage__') {
      onManageSources();
    } else {
      onSourceChange(value);
    }
  };
  const getSourceDisplayName = (source: Source) => {
    if (source.hasError) {
      return `${source.name} ⚠️`;
    }
    return source.name;
  };

  const selectedSource = sources.find(s => s.id === selectedSourceId);

  return (
    <div className="flex items-center gap-2">
      {sources.length > 0 ? (
        <Select value={selectedSourceId || ''} onValueChange={handleValueChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select source">
              {selectedSource ? getSourceDisplayName(selectedSource) : 'Select source'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sources.map((source) => (
              <SelectItem 
                key={source.id} 
                value={source.id}
                className={source.hasError ? 'text-red-600' : ''}
              >
                {getSourceDisplayName(source)}
              </SelectItem>
            ))}
            <SelectItem value="__manage__" className="border-t border-gray-200 mt-1 pt-1">
              <div className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Manage Sources...
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <Button
          variant="outline"
          onClick={onManageSources}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Source
        </Button>
      )}
    </div>
  );
};

export default SourceSelector; 