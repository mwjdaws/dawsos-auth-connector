
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateEditor from "@/components/TemplateEditor";
import { Button } from "@/components/ui/button";
import { Edit, Plus, List } from "lucide-react";
import { KnowledgeTemplate } from "@/services/api/types";

export function TemplatesTab() {
  const { templates, isLoading, error } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'edit'>('list');
  
  const handleEditTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setMode('edit');
  };
  
  const handleSaveTemplate = () => {
    // Return to list view after saving
    setMode('list');
  };
  
  const handleCancelEdit = () => {
    setSelectedTemplateId(null);
    setMode('list');
  };

  // Display editor if in edit mode
  if (mode === 'edit' && selectedTemplateId) {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Template</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancelEdit}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Back to Templates
          </Button>
        </div>
        <TemplateEditor 
          templateId={selectedTemplateId} 
          onSave={handleSaveTemplate}
          onCancel={handleCancelEdit}
        />
      </>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Knowledge Templates</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
            <h3 className="text-lg font-medium">Error Loading Templates</h3>
            <p>Failed to load templates. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onEdit={handleEditTemplate} 
              />
            ))}
          </div>
        )}
      </Suspense>
    </>
  );
}

interface TemplateCardProps {
  template: KnowledgeTemplate;
  onEdit: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="font-medium mb-2">{template.name}</h3>
        {template.is_global && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Global
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {template.content.slice(0, 100)}...
      </p>
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onEdit(template.id)}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </Button>
      </div>
    </div>
  );
};
