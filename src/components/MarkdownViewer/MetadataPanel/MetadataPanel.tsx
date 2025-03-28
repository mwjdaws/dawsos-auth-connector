
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CollapsibleHeader } from "./CollapsibleHeader";
import { OntologyTermsSection } from "./OntologyTermsSection";
import { ExternalSourceSection } from "./ExternalSourceSection";
import { TagsSection } from "./TagsSection";
import { DomainSection } from "./DomainSection";

interface Tag {
  id: string;
  name: string;
  content_id: string;
}

interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
}

interface MetadataPanelProps {
  tags: Tag[];
  ontologyTerms: OntologyTerm[];
  domain: string | null;
  externalSourceUrl: string | null;
  lastCheckedAt?: string | null;
  needsExternalReview?: boolean;
  isLoading: boolean;
  newTag: string;
  setNewTag: (value: string) => void;
  editable: boolean;
  onAddTag: () => void;
  onDeleteTag: (tagId: string) => void;
  isPending: boolean;
}

export function MetadataPanel({
  tags,
  ontologyTerms,
  domain,
  externalSourceUrl,
  lastCheckedAt = null,
  needsExternalReview = false,
  isLoading,
  newTag,
  setNewTag,
  editable,
  onAddTag,
  onDeleteTag,
  isPending
}: MetadataPanelProps) {
  const [isMetadataCollapsed, setIsMetadataCollapsed] = useState(false);

  // Determine card border styling based on review status
  const cardBorderClass = needsExternalReview
    ? "border-yellow-400 dark:border-yellow-600"
    : "";

  return (
    <Card className={`border rounded-lg shadow-sm ${cardBorderClass}`}>
      <CollapsibleHeader 
        isCollapsed={isMetadataCollapsed}
        setIsCollapsed={setIsMetadataCollapsed}
        needsExternalReview={needsExternalReview}
      />

      {!isMetadataCollapsed && (
        <div className="p-4 space-y-4">
          {isLoading ? (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <Skeleton className="h-8 w-full" />
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Ontology Terms</h3>
                <Skeleton className="h-8 w-full" />
              </div>
            </>
          ) : (
            <>
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
              />
              
              <OntologyTermsSection ontologyTerms={ontologyTerms} />
              
              <DomainSection domain={domain} />
            </>
          )}
          {isPending && <div className="text-sm text-muted-foreground">Updating metadata...</div>}
        </div>
      )}
    </Card>
  );
}
