
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTagGroups } from "./hooks/useTagGroups";
import { Tag } from "@/types/tag";

export interface TagGroupType {
  category: string;
  tags: Tag[];
}

interface GroupedTagListProps {
  tags: Tag[];
  isLoading?: boolean;
  contentId?: string;
  onTagClick?: (tag: string) => void;
  onTagDelete?: (tagId: string) => void;
  editable?: boolean;
  emptyMessage?: string;
  maxHeight?: string;
  refreshTrigger?: number;
}

/**
 * Displays tags grouped by their type/category
 */
export const GroupedTagList: React.FC<GroupedTagListProps> = ({
  tags,
  isLoading = false,
  contentId,
  onTagClick,
  onTagDelete,
  editable = false,
  emptyMessage = "No tags found",
  maxHeight = "200px",
  refreshTrigger
}) => {
  const { tagGroups, isLoading: isGroupingTags } = useTagGroups(tags);
  
  const loading = isLoading || isGroupingTags;
  
  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-6 w-20" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-14" />
        </div>
      </div>
    );
  }
  
  if (!tagGroups || tagGroups.length === 0 || tagGroups.every(group => group.tags.length === 0)) {
    return <p className="text-muted-foreground text-sm py-2">{emptyMessage}</p>;
  }
  
  return (
    <ScrollArea className={`w-full ${maxHeight ? `max-h-[${maxHeight}]` : ''}`}>
      <div className="space-y-4">
        {tagGroups.map((group) => (
          <div key={group.category} className="space-y-2">
            <h4 className="text-sm font-medium">{group.category}</h4>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => (
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
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default GroupedTagList;
