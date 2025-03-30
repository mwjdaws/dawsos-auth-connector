
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ErrorState } from '@/components/common/states/ErrorState';
import { LoadingState } from '@/components/common/states/LoadingState';
import { EmptyState } from '@/components/common/states/EmptyState';

export interface TagItem {
  id: string;
  name: string;
}

export interface TagListProps {
  tags: TagItem[];
  isLoading: boolean;
  error?: Error | null;
  knowledgeSourceId?: string;
  editable?: boolean;
  onTagClick?: (tag: string) => void;
  onDeleteTag?: (tagId: string) => void;
  retry?: () => void;
}

export function TagList({ 
  tags, 
  isLoading,
  error,
  knowledgeSourceId,
  editable = false,
  onTagClick,
  onDeleteTag,
  retry
}: TagListProps) {
  if (isLoading) {
    return <LoadingState text="Loading tags..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        error={error} 
        title="Error Loading Tags" 
        retry={retry} 
      />
    );
  }
  
  if (!tags.length) {
    return (
      <EmptyState 
        title="No Tags Found" 
        description="There are no tags associated with this content."
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <Badge 
          key={tag.id}
          variant="secondary"
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => onTagClick && onTagClick(tag.name)}
        >
          {tag.name}
          
          {editable && onDeleteTag && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTag(tag.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </Badge>
      ))}
    </div>
  );
}
