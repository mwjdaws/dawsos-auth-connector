
/**
 * OntologyTermsSection Component
 * 
 * Displays and manages ontology terms associated with a content source.
 * Uses the OntologyTermsPanel component internally to render and manage terms.
 * 
 * @example
 * ```tsx
 * <OntologyTermsSection
 *   sourceId="ks-123456"
 *   editable={true}
 * />
 * ```
 */
import React from "react";
import { OntologyTermsPanel } from "@/components/MarkdownViewer/OntologyTermsPanel";
import { OntologyTermsSectionProps } from "../types";

export const OntologyTermsSection: React.FC<OntologyTermsSectionProps> = ({ 
  sourceId, 
  editable,
  className
}) => {
  return (
    <div className={className}>
      <OntologyTermsPanel 
        sourceId={sourceId} 
        editable={editable} 
      />
    </div>
  );
};
