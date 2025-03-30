
import React, { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { useTemplates } from "@/hooks/useTemplates";
import TemplateEditor from "@/components/TemplateEditor";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import { KnowledgeTemplate } from "@/services/api/types";
import TemplateBrowser from "@/components/TemplateEditor/TemplateBrowser";
import CreateTemplateForm from "@/components/TemplateEditor/CreateTemplateForm";

export function TemplatesTab() {
  const { templates, isLoading, error, refetch } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'create'>('list');
  
  const handleEditTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setMode('edit');
  };
  
  const handleCreateTemplate = () => {
    setSelectedTemplateId(null);
    setMode('create');
  };
  
  const handleSaveTemplate = () => {
    // Return to list view after saving and refresh the list
    setMode('list');
    refetch();
  };
  
  const handleCancelEdit = () => {
    setSelectedTemplateId(null);
    setMode('list');
  };
  
  const handleTemplateCreated = (templateId: string) => {
    // Switch to edit mode with the newly created template
    setSelectedTemplateId(templateId);
    setMode('edit');
    refetch();
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
  
  // Display create form if in create mode
  if (mode === 'create') {
    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Template</h2>
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
        <CreateTemplateForm 
          onCancel={handleCancelEdit}
          onSuccess={handleTemplateCreated}
        />
      </>
    );
  }

  // Display template browser in list mode
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Knowledge Templates</h2>
      <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
        <TemplateBrowser 
          onSelectTemplate={handleEditTemplate}
          onCreateNew={handleCreateTemplate}
        />
      </Suspense>
    </>
  );
}
