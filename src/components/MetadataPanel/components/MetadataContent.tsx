
/**
 * MetadataContent Component
 * 
 * Displays the content of the metadata panel including sections for
 * external source, tags, ontology terms, and content ID.
 */
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { 
  ExternalSourceSection, 
  TagsSection, 
  OntologySection, 
  ContentIdSection 
} from "../sections";
import { LoadingState } from "../sections/LoadingState";

interface MetadataContentProps {
  isLoading: boolean;
  error: Error | null;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  tags: any[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  isPending: boolean;
  showOntologyTerms: boolean;
  contentId: string;
  ontologyTerms: any[];
  children?: React.ReactNode;
}

export const MetadataContent: React.FC<MetadataContentProps> = ({
  isLoading,
  error,
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
  contentId,
  ontologyTerms,
  children
}) => {
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error.toString()}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <>
      <div className="space-y-4">
        <ExternalSourceSection 
          externalSourceUrl={externalSourceUrl} 
          lastCheckedAt={lastCheckedAt} 
        />
        
        <TagsSection 
          tags={tags}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
          className="mt-4"
        />
        
        {showOntologyTerms && contentId && (
          <OntologySection
            sourceId={contentId} 
            terms={ontologyTerms}
            editable={editable}
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
