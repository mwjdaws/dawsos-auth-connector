
/**
 * OntologyTermsSection Component
 * 
 * Displays and manages ontology terms associated with a content source.
 * Uses the OntologySection component internally to render and manage terms.
 */
import React from "react";
import { OntologySection } from "./OntologySection";
import { OntologyTermsSectionProps } from "../types";

export const OntologyTermsSection: React.FC<OntologyTermsSectionProps> = ({ 
  contentId,
  editable = false,
  sourceId,
  onMetadataChange,
  className = "",
  ontologyTerms = []
}) => {
  // Use sourceId if provided, otherwise fall back to contentId
  const effectiveSourceId = sourceId || contentId;
  
  return (
    <div className={className}>
      {effectiveSourceId && (
        <OntologySection 
          sourceId={effectiveSourceId} 
          editable={editable} 
        />
      )}
    </div>
  );
};

export default OntologyTermsSection;
