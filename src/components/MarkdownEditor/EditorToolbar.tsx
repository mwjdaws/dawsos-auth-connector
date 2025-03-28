
import React from 'react';
import { Button } from '@/components/ui/button';
import { History, Maximize2, Minimize2 } from 'lucide-react';

interface EditorToolbarProps {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  documentId?: string;
  onHistoryClick: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isFullscreen,
  toggleFullscreen,
  documentId,
  onHistoryClick
}) => {
  return (
    <div className="flex items-center gap-2">
      {documentId && (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={onHistoryClick}
          title="View version history"
        >
          <History size={16} />
          <span className="hidden sm:inline">History</span>
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
      </Button>
    </div>
  );
};

export default EditorToolbar;
