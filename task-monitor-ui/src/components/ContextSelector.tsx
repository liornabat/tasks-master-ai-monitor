'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContextSelectorProps {
  contexts: string[];
  currentContext: string;
  onContextChange: (context: string) => void;
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  contexts,
  currentContext,
  onContextChange,
}) => {
  return (
    <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gray-50">
      <span className="text-sm text-gray-600 whitespace-nowrap">Context:</span>
      <Select value={currentContext} onValueChange={onContextChange}>
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Select context" />
        </SelectTrigger>
        <SelectContent>
          {contexts.map((context) => (
            <SelectItem key={context} value={context}>
              <span className="capitalize">{context}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ContextSelector; 