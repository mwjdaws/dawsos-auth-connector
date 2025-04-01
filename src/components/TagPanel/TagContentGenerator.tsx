
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Tag } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { handleError, ErrorLevel } from '@/utils/errors';

interface TagContentGeneratorProps {
  onGenerate: (content: string) => void;
  isPending: boolean;
}

/**
 * TagContentGenerator Component
 * 
 * Allows users to input content for automatic tag generation.
 */
export function TagContentGenerator({ onGenerate, isPending }: TagContentGeneratorProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) {
      handleError(
        new Error('No content provided'),
        'Please enter some content to generate tags.',
        { level: ErrorLevel.WARNING }
      );
      return;
    }

    if (content.trim().length < 10) {
      handleError(
        new Error('Content is too short'),
        'Please enter more content for better tag generation.',
        { level: ErrorLevel.WARNING }
      );
      return;
    }

    onGenerate(content.trim());
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5" />
          <span>Generate Tags from Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Paste your content here to generate relevant tags..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="resize-none"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isPending || !content.trim()}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Tags...
            </>
          ) : (
            'Generate Tags'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
