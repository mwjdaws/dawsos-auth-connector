
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTagGroups } from './hooks/useTagGroups';
import { Tag } from '@/types/tag';

export interface TagCardsProps {
  tagGroupsResult?: {
    groups: { category: string; tags: Tag[] }[];
    isLoading: boolean;
  };
}

export function TagCards({ tagGroupsResult }: TagCardsProps) {
  // If no tagGroups provided, use the hook to fetch them
  const defaultTagGroups = useTagGroups();
  const { groups, isLoading } = tagGroupsResult || defaultTagGroups;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-6 bg-gray-200 rounded w-20"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No tags available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{group.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {group.tags.map(tag => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-xs font-normal"
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

export default TagCards;
