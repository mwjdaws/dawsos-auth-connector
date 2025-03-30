
/**
 * OntologyTermsSection Component
 * 
 * Displays and manages ontology terms associated with a content source.
 * Uses the OntologySection component internally to render and manage terms.
 * 
 * @example
 * ```tsx
 * <OntologyTermsSection
 *   sourceId="ks-123456"
 *   editable={true}
 * />
 * ```
 * 
 * @remarks
 * - Renders the OntologySection component with the provided sourceId
 * - The editable prop controls whether terms can be added or removed
 * - Relies on the OntologySection component for the actual rendering and functionality
 */
import React from "react";
import { OntologySection } from "./OntologySection";
import { OntologyTermsSectionProps } from "../types";

export const OntologyTermsSection: React.FC<OntologyTermsSectionProps> = ({ 
  sourceId, 
  editable,
  className
}) => {
  return (
    <div className={className}>
      <OntologySection 
        sourceId={sourceId} 
        editable={editable} 
      />
    </div>
  );
};

export default OntologyTermsSection;
