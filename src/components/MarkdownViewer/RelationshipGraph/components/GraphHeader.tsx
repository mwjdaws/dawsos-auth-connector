
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GraphHeaderProps {
  loading: boolean;
  nodeCount: number;
  linkCount: number;
  onRetry: () => void;
}

export function GraphHeader({ loading, nodeCount, linkCount, onRetry }: GraphHeaderProps) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>{nodeCount} nodes</span>
        <span>•</span>
        <span>{linkCount} connections</span>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRetry} 
        disabled={loading}
        className="text-xs h-7"
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Loading...' : 'Refresh'}
      </Button>
    </div>
  );
}
