
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { useTagGroups, TagGroup } from './hooks/useTagGroups';
import { Tag } from '@/types/tag';

interface TagCardsProps {
  tags?: Tag[];
  isLoading?: boolean;
  error?: Error | null;
  handleRefresh?: () => void;
  onTagClick?: (tag: string) => void;
}

export function TagCards({ tags = [], isLoading = false, error = null, handleRefresh, onTagClick }: TagCardsProps) {
  const [recentTags, setRecentTags] = useState<Tag[]>([]);
  const groupedTags = useTagGroups(recentTags);

  useEffect(() => {
    // Use provided tags or fetch the most recent tags
    if (tags && tags.length > 0) {
      setRecentTags(tags);
    } else {
      // In a real implementation, you might fetch recent tags here
      setRecentTags([]);
    }
  }, [tags]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-red-700 text-lg flex justify-between items-center">
            <span>Error Loading Tags</span>
            {handleRefresh && (
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!groupedTags || groupedTags.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent tags found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {groupedTags.map((group) => (
        <Card key={group.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              <span>{group.name}</span>
              {handleRefresh && (
                <Button variant="ghost" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onTagClick && onTagClick(tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
