
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Maximize, Minimize, History, Book } from 'lucide-react';

interface EditorToolbarProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  documentId?: string;
  onHistoryClick: () => void;
  onSourceBrowserClick: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isFullscreen,
  toggleFullscreen,
  documentId,
  onHistoryClick,
  onSourceBrowserClick
}) => {
  return (
    <div className="flex items-center space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSourceBrowserClick}
              className="text-muted-foreground hover:text-foreground"
            >
              <Book className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Browse Knowledge Sources</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {documentId && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onHistoryClick}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Version History</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFullscreen}
              className="text-muted-foreground hover:text-foreground"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default EditorToolbar;
