
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentIdSectionProps {
  contentId: string;
}

/**
 * Displays the content ID with a copy button
 */
export const ContentIdSection: React.FC<ContentIdSectionProps> = ({
  contentId
}) => {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(contentId);
  };
  
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-1">Content ID</h3>
      <div className="flex items-center gap-2">
        <code className="bg-secondary p-1 rounded text-xs font-mono flex-1 overflow-x-auto">
          {contentId}
        </code>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={handleCopyClick}
        >
          <Copy className="h-3 w-3" />
          <span className="sr-only">Copy ID</span>
        </Button>
      </div>
    </div>
  );
};
