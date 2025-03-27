
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

  const loadTemplates = async (params?: PaginationParams) => {
    try {
      setLoading(true);
      const response = await fetchKnowledgeTemplates(params);
      
      let filteredTemplates = response.data;
      if (templateFilter === 'global') {
        filteredTemplates = response.data.filter(template => template.is_global);
      } else if (templateFilter === 'custom') {
        filteredTemplates = response.data.filter(template => !template.is_global);
      }
      
      setTemplates(filteredTemplates);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
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
  }, [templateFilter]);

  const handlePageChange = (page: number) => {
    loadTemplates({ page, pageSize: pagination.pageSize });
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

    try {
      setLoading(true);
      
      const structure = generateStructureFromContent(newTemplate.content);
      
      const data = await createKnowledgeTemplate({
        name: newTemplate.name,
        content: newTemplate.content,
        metadata: { custom: true },
        structure: structure,
        is_global: false
      });

      if (data && data.length > 0) {
        setTemplateFilter('custom');
        await loadTemplates({ page: 1 });
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

  return (
    <div className={className}>
      <TemplateFilterTabs 
        currentFilter={templateFilter}
        onFilterChange={(filter) => setTemplateFilter(filter)}
      />

      <TemplateDropdown 
        templates={templates}
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
