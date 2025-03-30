
import React, { memo } from 'react';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface GraphHeaderProps {
  nodeCount: number;
  linkCount: number;
}

export const GraphHeader = memo(function GraphHeader({ 
  nodeCount, 
  linkCount 
}: GraphHeaderProps) {
  return (
    <div className="px-4 py-3 border-b flex justify-between items-center bg-muted/50">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Knowledge Graph</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Visualizes connections between knowledge sources</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="text-sm text-muted-foreground flex gap-3">
        <span>{nodeCount} nodes</span>
        <span>{linkCount} connections</span>
      </div>
    </div>
  );
});
