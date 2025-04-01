
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TagGroup, useTagGroups } from './hooks/useTagGroups';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface GroupedTagListProps {
  onTagClick?: (tag: string) => void;
  maxTagsPerGroup?: number;
  showCount?: boolean;
  className?: string;
}

export function GroupedTagList({
  onTagClick,
  maxTagsPerGroup = 15,
  showCount = true,
  className,
}: GroupedTagListProps) {
  const { 
    groups, 
    isLoading, 
    error, 
    refreshGroups 
  } = useTagGroups();

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load tag groups: {error.message}</AlertDescription>
      </Alert>
    );
  }

  // Handle empty state
  if (!groups || groups.length === 0) {
    return (
      <Alert>
        <AlertDescription>No tag groups found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group: TagGroup) => (
          <Card key={group.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex justify-between">
                {group.name}
                {showCount && (
                  <span className="text-muted-foreground text-xs">
                    {group.tags.length} {group.tags.length === 1 ? 'tag' : 'tags'}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex flex-wrap gap-1">
                {group.tags.slice(0, maxTagsPerGroup).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => onTagClick && onTagClick(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {group.tags.length > maxTagsPerGroup && (
                  <Badge variant="outline">+{group.tags.length - maxTagsPerGroup} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
