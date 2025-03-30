
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeCallback } from '@/types/compat';

interface TagsGroup {
  title: string;
  tags: string[];
}

interface TagCardsProps {
  key: string;
  title: string;
  tags: string[];
  onTagClick?: (tag: string) => void;
}

// Component for a single group of tags
const TagCards = ({ title, tags, onTagClick }: TagCardsProps) => {
  // Safe wrapper for the tag click handler
  const handleTagClick = safeCallback(onTagClick);
  
  return (
    <Card className="mb-4">
      <CardHeader className="py-4 px-5">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-5">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface GroupedTagListProps {
  tags: string[];
  onTagClick?: (tag: string) => void;
}

/**
 * Grouped Tag List Component
 * 
 * Displays tags grouped by categories like "Development", "Features", etc.
 */
export function GroupedTagList({ tags, onTagClick }: GroupedTagListProps) {
  // Group the tags by category
  const groupedTags = React.useMemo(() => {
    // Define groups and their keywords
    const groups: Record<string, { title: string; keywords: string[] }> = {
      development: {
        title: "Development",
        keywords: ["react", "typescript", "javascript", "angular", "vue", "html", "css", "scss", "node", "express", "api", "backend", "frontend", "fullstack", "webpack", "babel", "vite", "npm", "yarn"]
      },
      features: {
        title: "Features",
        keywords: ["feature", "component", "hook", "context", "state", "props", "ref", "memo", "callback", "effect", "reducer", "provider", "consumer"]
      },
      design: {
        title: "Design",
        keywords: ["ui", "ux", "design", "theme", "interface", "responsive", "mobile", "desktop", "layout", "grid", "flex", "style", "color", "typography", "dark mode"]
      },
      content: {
        title: "Content",
        keywords: ["markdown", "text", "image", "video", "audio", "media", "content", "document", "file", "upload", "download"]
      },
      functionality: {
        title: "Functionality",
        keywords: ["authentication", "authorization", "user", "login", "signup", "register", "password", "security", "form", "validation", "input", "button", "modal", "dialog", "notification", "toast", "alert"]
      },
      data: {
        title: "Data",
        keywords: ["database", "api", "fetch", "axios", "http", "rest", "graphql", "query", "mutation", "subscription", "cache", "storage", "local", "session", "cookie"]
      }
    };
    
    // Initialize result with uncategorized group
    const result: Record<string, string[]> = {
      uncategorized: []
    };
    
    // Process each tag
    tags.forEach(tag => {
      let categorized = false;
      
      // Check if tag belongs to any group
      for (const [key, group] of Object.entries(groups)) {
        if (group.keywords.some(keyword => tag.toLowerCase().includes(keyword.toLowerCase()))) {
          if (!result[key]) {
            result[key] = [];
          }
          result[key].push(tag);
          categorized = true;
          break;
        }
      }
      
      // If no group matches, add to uncategorized
      if (!categorized) {
        result.uncategorized.push(tag);
      }
    });
    
    // Transform to tag groups array
    const tagGroups: TagsGroup[] = [];
    
    // Add the categorized groups with their titles
    for (const [key, groupTags] of Object.entries(result)) {
      if (groupTags.length > 0) {
        if (key === 'uncategorized') {
          tagGroups.push({
            title: "Other Tags",
            tags: groupTags
          });
        } else {
          tagGroups.push({
            title: groups[key].title,
            tags: groupTags
          });
        }
      }
    }
    
    return tagGroups;
  }, [tags]);
  
  if (groupedTags.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      {groupedTags.map(group => (
        <TagCards
          key={group.title}
          title={group.title}
          tags={group.tags}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
