import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { 
  fetchKnowledgeTemplates,
  createKnowledgeTemplate,
  KnowledgeTemplate,
  PaginationParams
} from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { PlusCircle, Globe, User, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplateSelectorProps {
  onSelectTemplate: (template: KnowledgeTemplate) => void;
  className?: string;
  defaultShowGlobal?: boolean;
}

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
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPages: 1,
    count: 0
  });
  const [newTemplate, setNewTemplate] = useState({
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

  const generateStructureFromContent = (content: string) => {
    try {
      const lines = content.split('\n');
      const sections = [];
      
      let currentSection = null;
      
      for (const line of lines) {
        const h2Match = line.match(/^## (.+)$/);
        
        if (h2Match) {
          if (currentSection) {
            sections.push(currentSection);
          }
          currentSection = {
            title: h2Match[1].trim(),
            content: ""
          };
        } else if (currentSection) {
          if (currentSection.content) {
            currentSection.content += "\n" + line;
          } else {
            currentSection.content = line;
          }
        }
      }
      
      if (currentSection) {
        sections.push(currentSection);
      }
      
      return { sections };
    } catch (error) {
      console.error("Error generating structure from content:", error);
      return null;
    }
  };

  const renderTemplatePreview = (template: KnowledgeTemplate) => {
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
        ? JSON.parse(template.structure) 
        : template.structure;
      
      if (structure.sections && Array.isArray(structure.sections)) {
        return (
          <div className="space-y-2">
            <div className="font-medium border-b pb-1 mb-2">{template.name}</div>
            {structure.sections.map((section, index) => (
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

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === pagination.page}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return links;
  };

  return (
    <div className={className}>
      <div className="mb-4">
        <Tabs 
          defaultValue={templateFilter} 
          onValueChange={(value) => setTemplateFilter(value as 'all' | 'global' | 'custom')}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="global" className="flex items-center gap-1">
              <Globe className="h-4 w-4" /> Global
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-1">
              <User className="h-4 w-4" /> Custom
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Select onValueChange={handleTemplateChange} disabled={loading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <HoverCard key={template.id} openDelay={300} closeDelay={100}>
              <HoverCardTrigger asChild>
                <SelectItem value={template.id}>
                  <div className="flex items-center gap-2">
                    {template.is_global ? (
                      <Globe className="h-4 w-4 text-blue-500" />
                    ) : (
                      <User className="h-4 w-4 text-green-500" />
                    )}
                    {template.name}
                  </div>
                </SelectItem>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{template.name}</span>
                    {template.is_global && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Global
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    {renderTemplatePreview(template)}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
          <SelectItem value="create-new" className="text-primary font-medium">
            <div className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Custom Template
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {pagination.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, pagination.page - 1))} 
                className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {renderPaginationLinks()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))} 
                className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a custom template for reuse in future knowledge sources.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="template-name" className="text-sm font-medium">
                Template Name
              </label>
              <Input
                id="template-name"
                placeholder="e.g., Meeting Notes, Project Plan"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="template-content" className="text-sm font-medium">
                Template Content
              </label>
              <Textarea
                id="template-content"
                placeholder="# Title
## Section 1
Content goes here...

## Section 2
More content..."
                rows={10}
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate} disabled={loading}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TemplateSelector;
