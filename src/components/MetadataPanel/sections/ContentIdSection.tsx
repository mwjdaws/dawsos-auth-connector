
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ContentIdSectionProps {
  contentId: string;
}

export function ContentIdSection({ contentId }: ContentIdSectionProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(contentId)
      .then(() => {
        toast({
          title: 'Copied to clipboard',
          description: 'Content ID copied to clipboard',
          variant: 'default',
        });
      })
      .catch((error) => {
        console.error('Failed to copy content ID:', error);
        toast({
          title: 'Copy failed',
          description: 'Failed to copy content ID to clipboard',
          variant: 'destructive',
        });
      });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          Content ID
          <Button 
            variant="ghost" 
            size="sm"
            onClick={copyToClipboard}
            className="h-6 w-6 p-0"
            aria-label="Copy content ID"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <code className="bg-muted p-1 rounded text-xs break-all">{contentId}</code>
      </CardContent>
    </Card>
  );
}
