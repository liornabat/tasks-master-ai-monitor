'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCwIcon } from 'lucide-react';
import SourceSelector from './SourceSelector';
import { Source } from '@/types';

interface HeaderProps {
  connectionStatus: 'connected' | 'disconnected' | 'error';
  isAutoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  availableContexts: string[];
  selectedContext: string;
  onContextChange: (context: string) => void;
  sources: Source[];
  selectedSourceId: string | null;
  onSourceChange: (sourceId: string) => void;
  onManageSources: () => void;
}

const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  isAutoRefresh,
  onAutoRefreshToggle,
  availableContexts,
  selectedContext,
  onContextChange,
  sources,
  selectedSourceId,
  onSourceChange,
  onManageSources,
}) => {

  // Function to get connection status badge content
  const getConnectionBadge = () => {
    const variants = {
      connected: '🟢 Connected',
      disconnected: '⚫ Disconnected',
      error: '🔴 Error'
    };
    
    const colors = {
      connected: 'bg-green-100 text-green-800 border-green-200',
      disconnected: 'bg-gray-100 text-gray-800 border-gray-200',
      error: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge className={colors[connectionStatus]}>
        {variants[connectionStatus]}
      </Badge>
    );
  };



  return (
    <header className="border-b border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        {/* Left section - Title */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">TaskMasterAI Monitor</h1>
        </div>

        {/* Right section - Source selection, controls and status */}
        <div className="flex items-center gap-3">
          {/* Source selection */}
          <SourceSelector
            sources={sources}
            selectedSourceId={selectedSourceId}
            onSourceChange={onSourceChange}
            onManageSources={onManageSources}
          />

          {/* Tag selector */}
          {availableContexts.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Tag:</span>
              <Select value={selectedContext} onValueChange={onContextChange}>
                <SelectTrigger className="w-[140px] bg-white">
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {availableContexts.map((context) => (
                    <SelectItem key={context} value={context}>
                      <span className="capitalize">{context}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Auto-refresh toggle */}
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={onAutoRefreshToggle}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon className={`h-4 w-4 ${isAutoRefresh ? 'animate-spin' : ''}`} />
            Auto 5s
          </Button>

          {/* Connection status */}
          {getConnectionBadge()}
        </div>
      </div>
    </header>
  );
};

export default Header; 