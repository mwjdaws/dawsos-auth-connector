
import React from "react";
import { KnowledgeTemplate } from "@/services/api/types";

interface TemplatePreviewProps {
  template: KnowledgeTemplate;
}

interface TemplateSection {
  title: string;
  content?: string;
}

interface TemplateStructure {
  sections?: TemplateSection[];
}

export const TemplatePreview = ({ template }: TemplatePreviewProps) => {
  if (!template.structure) {
    return (
      <div className="max-h-[300px] overflow-y-auto rounded-md border p-3 text-sm font-mono">
        {template.content.slice(0, 150)}
        {template.content.length > 150 && '...'}
      </div>
    );
  }

  try {
    const structure = typeof template.structure === 'string' 
      ? JSON.parse(template.structure) as TemplateStructure
      : template.structure as TemplateStructure;
    
    if (structure.sections && Array.isArray(structure.sections)) {
      return (
        <div className="space-y-2">
          <div className="font-medium border-b pb-1 mb-2">{template.name}</div>
          {structure.sections.map((section: TemplateSection, index: number) => (
            <div key={index} className="space-y-1">
              <div className="font-medium text-sm text-primary">{section.title}</div>
              <div className="text-xs text-muted-foreground italic">
                {section.content || '(Empty content)'}
              </div>
            </div>
          ))}
        </div>
      );
    }
  } catch (error) {
    console.error("Error parsing template structure:", error);
  }

  return (
    <div className="max-h-[300px] overflow-y-auto rounded-md border p-3 text-sm">
      <div className="font-medium mb-2">{template.name}</div>
      <div className="text-xs font-mono">
        {template.content.slice(0, 150)}
        {template.content.length > 150 && '...'}
      </div>
    </div>
  );
};

export default TemplatePreview;
