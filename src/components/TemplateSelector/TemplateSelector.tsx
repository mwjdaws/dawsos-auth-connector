
import React, { useState, useEffect } from "react";
import { KnowledgeTemplate, PaginationParams } from "@/services/api/types";
import { 
  fetchKnowledgeTemplates,
  createKnowledgeTemplate
} from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { TemplateSelectorProps, PaginationState, NewTemplateForm } from "./types";
import { TemplateFilterTabs } from "./TemplateFilterTabs";
import { TemplateDropdown } from "./TemplateDropdown";
import { TemplatePagination } from "./TemplatePagination";
import { CreateTemplateDialog } from "./CreateTemplateDialog";
import { generateStructureFromContent } from "./utils";
import { useAuth } from "@/hooks/useAuth";

export function TemplateSelector({ 
  onSelectTemplate, 
  className, 
  defaultShowGlobal = true 
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<KnowledgeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateFilter, setTemplateFilter] = useState<'all' | 'global' | 'custom'>(
    defaultShowGlobal ? 'global' : 'all'
  );
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    count: 0
  });
  const [newTemplate, setNewTemplate] = useState<NewTemplateForm>({
    name: '',
    content: ''
  });
  const { user } = useAuth();

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetchKnowledgeTemplates();
      
      let filteredTemplates = response.data;
      if (templateFilter === 'global') {
        filteredTemplates = response.data.filter(template => template.is_global);
      } else if (templateFilter === 'custom' && user) {
        filteredTemplates = response.data.filter(template => 
          !template.is_global && template.user_id === user.id
        );
      }
      
      setTemplates(filteredTemplates);
      // Set pagination manually since the API doesn't return pagination info
      setPagination({
        page: 1,
        pageSize: 10,
        totalPages: Math.ceil(filteredTemplates.length / 10),
        count: filteredTemplates.length
      });
    } catch (error) {
      console.error("Failed to load templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [templateFilter, user]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  const handleTemplateChange = async (value: string) => {
    if (value === "create-new") {
      setDialogOpen(true);
      return;
    }

    const selectedTemplate = templates.find(template => template.id === value);
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  const handleSaveTemplate = async () => {
    if (!newTemplate.name || !newTemplate.content) {
      toast({
        title: "Validation Error",
        description: "Template name and content are required",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create templates",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const structure = generateStructureFromContent(newTemplate.content);
      
      const data = await createKnowledgeTemplate({
        name: newTemplate.name,
        content: newTemplate.content,
        metadata: { custom: true },
        structure: structure,
        is_global: false, // All user-created templates are private by default
        user_id: user.id  // Explicitly set the user_id to the current user
      });

      if (data && data.length > 0) {
        setTemplateFilter('custom');
        await loadTemplates();
        setNewTemplate({ name: '', content: '' });
        setDialogOpen(false);
        toast({
          title: "Success",
          description: "Template created successfully"
        });
      }
    } catch (error) {
      console.error("Failed to create template:", error);
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Get the current page of templates
  const paginatedTemplates = templates.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

  return (
    <div className={className}>
      <TemplateFilterTabs 
        currentFilter={templateFilter}
        onFilterChange={(filter) => setTemplateFilter(filter)}
      />

      <TemplateDropdown 
        templates={paginatedTemplates}
        loading={loading}
        onTemplateChange={handleTemplateChange}
      />

      <TemplatePagination 
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <CreateTemplateDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newTemplate={newTemplate}
        onNewTemplateChange={setNewTemplate}
        onSave={handleSaveTemplate}
        loading={loading}
      />
    </div>
  );
}

// Adding default export
export default TemplateSelector;
