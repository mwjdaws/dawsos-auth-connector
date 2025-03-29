
import React from "react";
import { OntologyTermsPanel } from "@/components/MarkdownViewer/OntologyTermsPanel";

interface OntologyTermsSectionProps {
  sourceId: string;
  editable: boolean;
}

export const OntologyTermsSection: React.FC<OntologyTermsSectionProps> = ({ 
  sourceId, 
  editable 
}) => {
  return (
    <OntologyTermsPanel 
      sourceId={sourceId} 
      editable={editable} 
    />
  );
};
