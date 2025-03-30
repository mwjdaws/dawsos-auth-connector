
/**
 * MetadataContent Component
 * 
 * Displays the content of the metadata panel including sections for
 * external source, tags, ontology terms, and content ID.
 * Uses the unified loading and error state components.
 */
import React from "react";
import { 
  ExternalSourceSection, 
  TagsSection, 
  OntologySection, 
  ContentIdSection 
} from "../sections";
import { LoadingState, ErrorState } from "@/components/ui/shared-states";

interface MetadataContentProps {
  isLoading: boolean;
  error: Error | null;
  contentId: string;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  tags: any[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  isPending: boolean;
  showOntologyTerms: boolean;
  ontologyTerms: any[];
  onMetadataChange?: () => void;
  onRefresh?: () => void;
  children?: React.ReactNode;
}

export const MetadataContent: React.FC<MetadataContentProps> = ({
  isLoading,
  error,
  contentId,
  externalSourceUrl,
  lastCheckedAt,
  tags,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  isPending,
  showOntologyTerms,
  ontologyTerms,
  onMetadataChange,
  onRefresh,
  children
}) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    const safeRetry = onRefresh ? () => onRefresh() : undefined;
    
    return (
      <ErrorState 
        error={error} 
        title="Failed to load metadata" 
        retry={safeRetry}
      />
    );
  }
  
  // For compatibility with different function signatures
  const handleAddTag = async () => {
    if (onAddTag) {
      await onAddTag();
    }
  };
  
  const handleDeleteTag = async (tagId: string) => {
    if (onDeleteTag) {
      await onDeleteTag(tagId);
    }
  };
  
  return (
    <>
      <div className="space-y-4">
        <ExternalSourceSection 
          contentId={contentId}
          externalSourceUrl={externalSourceUrl} 
          lastCheckedAt={lastCheckedAt}
          editable={editable}
          onMetadataChange={onMetadataChange ? () => onMetadataChange() : undefined}
        />
        
        <TagsSection 
          tags={tags}
          contentId={contentId}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={handleAddTag}
          onDeleteTag={handleDeleteTag}
          onMetadataChange={onMetadataChange ? () => onMetadataChange() : undefined}
          className="mt-4"
        />
        
        {showOntologyTerms && contentId && (
          <OntologySection
            sourceId={contentId} 
            terms={ontologyTerms}
            editable={editable ? true : false}
            className="mt-4" 
          />
        )}
        
        {children}
        
        <ContentIdSection contentId={contentId} className="mt-4" />
      </div>
      
      {isPending && (
        <div className="text-sm text-muted-foreground mt-2">
          Updating...
        </div>
      )}
    </>
  );
};

export default MetadataContent;
