
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Tag, SourceMetadata } from "../types";
import { ContentIdSection } from "../sections/ContentIdSection";
import { ExternalSourceSection } from "../sections/ExternalSourceSection";
import { TagsSection } from "../sections/TagsSection";
import { OntologySection } from "../sections/OntologySection";

export interface MetadataContentProps {
  data: SourceMetadata | null;
  contentId: string;
  error: any;
  tags: Tag[];
  editable: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  onAddTag: (typeId?: string | null) => Promise<void>;
  onDeleteTag: (tagId: string) => Promise<void>;
  onRefresh: () => void;
  externalSourceUrl: string | null;
  lastCheckedAt: string | null;
  needsExternalReview: boolean;
  onMetadataChange?: (() => void) | undefined;
  showOntologyTerms: boolean;
}

export function MetadataContent({
  data,
  contentId,
  error,
  tags,
  editable,
  newTag,
  setNewTag,
  onAddTag,
  onDeleteTag,
  onRefresh,
  externalSourceUrl,
  lastCheckedAt,
  needsExternalReview,
  onMetadataChange,
  showOntologyTerms
}: MetadataContentProps) {
  // Display error if there's an error
  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading metadata: {error.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Function to ensure we always have a consistent callback
  const handleMetadataChange = () => {
    if (onMetadataChange) {
      onMetadataChange();
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-6">
        {/* Content ID Section */}
        <ContentIdSection contentId={contentId} />
        
        {/* External Source Section */}
        <ExternalSourceSection
          externalSourceUrl={externalSourceUrl || ""}
          lastCheckedAt={lastCheckedAt}
          editable={editable}
          onMetadataChange={handleMetadataChange}
        />
        
        {/* Tags Section */}
        <TagsSection
          tags={tags}
          contentId={contentId}
          editable={editable}
          newTag={newTag}
          setNewTag={setNewTag}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
          onMetadataChange={handleMetadataChange}
          className="mt-6"
        />
        
        {/* Ontology Terms Section (conditionally rendered) */}
        {showOntologyTerms && (
          <div>
            {/* Replace with proper OntologySection implementation once available */}
            <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
            <p className="text-muted-foreground text-sm">No ontology terms assigned.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
