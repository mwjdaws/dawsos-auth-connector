
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TagGroup {
  content_id: string;
  tags: string[];
}

interface TagCardsListProps {
  tagGroups: TagGroup[];
}

export function TagCardsList({ tagGroups }: TagCardsListProps) {
  if (tagGroups.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tagGroups.map((group, index) => (
        <Card key={`${group.content_id}-${index}`}>
          <CardHeader>
            <CardTitle className="text-sm font-medium truncate">
              Content ID: {group.content_id.substring(0, 20)}
              {group.content_id.length > 20 ? '...' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag, tagIndex) => (
                <Badge key={`${tag}-${tagIndex}`} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
