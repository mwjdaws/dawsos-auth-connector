
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { ExternalSourceSection } from '../sections/ExternalSourceSection';
import { TagsSection } from '../sections/TagsSection';
import { OntologyTermsSection } from '../sections/OntologyTermsSection';
import { useMetadataContext } from '../providers/MetadataQueryProvider';

interface MetadataContentProps {
  showOntologyTerms?: boolean;
  showDomain?: boolean;
}

/**
 * MetadataContent Component
 * 
 * Renders the different sections of the metadata panel
 */
export function MetadataContent({
  showOntologyTerms = true,
  showDomain = false
}: MetadataContentProps) {
  const {
    tags,
    ontologyTerms,
    sourceMetadata,
    isEditable,
    contentId,
    refreshMetadata,
    handleDeleteTag
  } = useMetadataContext();
  
  return (
    <div className="space-y-4">
      {/* Tags Section */}
      <TagsSection
        tags={tags}
        contentId={contentId}
        editable={isEditable}
        newTag=""
        setNewTag={() => {}}
        onAddTag={async () => false}
        onDeleteTag={handleDeleteTag}
        onMetadataChange={refreshMetadata}
        className="pb-2"
      />
      
      <Separator />
      
      {/* External Source Section */}
      <ExternalSourceSection
        externalSource={sourceMetadata}
        contentId={contentId}
        editable={isEditable}
        onMetadataChange={refreshMetadata}
        className="py-2"
      />
      
      {/* Only show ontology terms if requested */}
      {showOntologyTerms && (
        <>
          <Separator />
          
          <OntologyTermsSection
            ontologyTerms={ontologyTerms}
            contentId={contentId}
            editable={isEditable}
            showDomain={showDomain}
            className="pt-2"
          />
        </>
      )}
    </div>
  );
}
