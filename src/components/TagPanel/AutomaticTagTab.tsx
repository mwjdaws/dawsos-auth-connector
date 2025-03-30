
import React from "react";
import { TagGenerator } from "./TagGenerator";
import { TagList } from "./TagList";
import { TagSaver } from "./TagSaver";
import { isValidContentId } from "@/utils/validation/contentIdValidation";

interface AutomaticTagTabProps {
  contentId: string;
  tagGeneration: {
    tags: string[];
    isLoading: boolean;
    contentId: string | null;
  };
  isPending: boolean;
  handleTagClick: (tag: string) => void;
  processTagGeneration: (text: string) => void;
  handleSaveTags: () => Promise<void>;
  saveTags: {
    isProcessing: boolean;
    isRetrying: boolean;
  };
  onTagsSaved: (contentId: string) => void;
}

export function AutomaticTagTab({
  contentId,
  tagGeneration,
  isPending,
  handleTagClick,
  processTagGeneration,
  handleSaveTags,
  saveTags,
  onTagsSaved
}: AutomaticTagTabProps) {
  const isValidContent = isValidContentId(contentId);
  
  // Convert string tags to tag objects with IDs
  const tagObjects = tagGeneration.tags.map(tagName => ({
    name: tagName,
    id: `temp-${tagName.replace(/\s+/g, '-').toLowerCase()}`
  }));

  // Safely determine the effective knowledge source ID
  const effectiveContentId = tagGeneration.contentId || (isValidContent ? contentId : '');

  return (
    <div className="space-y-6 pt-4">
      <TagGenerator 
        isLoading={tagGeneration.isLoading || isPending}
        onGenerateTags={processTagGeneration}
      />
      
      <TagList 
        tags={tagObjects}
        isLoading={tagGeneration.isLoading || isPending}
        knowledgeSourceId={effectiveContentId}
        onTagClick={handleTagClick}
      />
      
      <TagSaver
        tags={tagGeneration.tags}
        contentId={effectiveContentId}
        saveTags={handleSaveTags}
        isProcessing={saveTags.isProcessing}
        isRetrying={saveTags.isRetrying}
        onTagsSaved={onTagsSaved}
        disabled={!effectiveContentId}
      />
    </div>
  );
}
