
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
