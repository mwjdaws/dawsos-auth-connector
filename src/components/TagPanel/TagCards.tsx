
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TagGroup } from "./hooks/useTagGroups";
import { Tag } from "@/types/tag";

interface TagCardsProps {
  tagGroupsResult: {
    tagGroups: TagGroup[];
    isLoading: boolean;
    error: Error | null;
    refreshGroups: () => boolean;
  };
  onTagClick?: (tag: string) => void;
  onTagDelete?: (tagId: string) => void;
  editable?: boolean;
}

/**
 * Displays tags in cards grouped by type/category
 */
export const TagCards: React.FC<TagCardsProps> = ({
  tagGroupsResult,
  onTagClick,
  onTagDelete,
  editable = false
}) => {
  const { tagGroups, isLoading, error, refreshGroups } = tagGroupsResult;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-14" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load tags: {error.message}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => refreshGroups()} 
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!tagGroups || tagGroups.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No tags found.
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tagGroups.map((group) => (
        <Card key={group.category}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{group.category}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1.5">
              {group.tags.map((tag: Tag) => (
                <Badge
                  key={tag.id}
                  className={`${onTagClick ? 'cursor-pointer' : ''}`}
                  variant="secondary"
                  onClick={() => onTagClick && onTagClick(tag.name)}
                >
                  {tag.name}
                  {editable && onTagDelete && (
                    <span
                      className="ml-1 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagDelete(tag.id);
                      }}
                    >
                      ×
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TagCards;
