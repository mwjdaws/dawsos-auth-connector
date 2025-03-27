
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { KnowledgeTemplate, PaginationParams } from "@/services/api/types";
import { fetchKnowledgeTemplates } from "@/services/api";
import TemplateSelector from "@/components/TemplateSelector";
import { TemplatePreviewCard } from "./TemplatePreviewCard";
import { TemplateListCard } from "./TemplateListCard";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TemplatesPanel() {
  const [templates, setTemplates] = useState<KnowledgeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalPages: 1,
    count: 0
  });
  const [selectedTemplate, setSelectedTemplate] = useState<KnowledgeTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const loadTemplates = async (params?: PaginationParams) => {
    try {
      setLoading(true);
      const response = await fetchKnowledgeTemplates(params);
      setTemplates(response.data);
      setPagination({
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        count: response.count
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
    loadTemplates({ page: 1, pageSize: pagination.pageSize });
  }, []);

  const handlePageChange = (page: number) => {
    loadTemplates({ page, pageSize: pagination.pageSize });
  };

  const handleTemplateSelect = (template: KnowledgeTemplate) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Selected",
      description: `Selected template: ${template.name}`,
    });
  };

  const handleCreateFromTemplate = () => {
    if (selectedTemplate) {
      toast({
        title: "Creating Content",
        description: `Creating new content from template: ${selectedTemplate.name}`,
      });
      // Here you would typically redirect to a creation page or open a modal
      // For now, we'll just show a toast
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
        <div className="w-full md:w-2/3">
          <TemplateSelectorCard 
            onSelectTemplate={handleTemplateSelect} 
            onCreateFromTemplate={handleCreateFromTemplate}
            selectedTemplate={selectedTemplate}
          />
        </div>

        <div className="w-full md:w-1/3">
          <TemplatePreviewCard selectedTemplate={selectedTemplate} />
        </div>
      </div>

      <TemplateListCard
        templates={templates}
        loading={loading}
        pagination={pagination}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handlePageChange={handlePageChange}
        handleTemplateSelect={handleTemplateSelect}
      />
    </div>
  );
}

// Component for the Template Selector Card
function TemplateSelectorCard({ 
  onSelectTemplate, 
  onCreateFromTemplate, 
  selectedTemplate 
}: { 
  onSelectTemplate: (template: KnowledgeTemplate) => void;
  onCreateFromTemplate: () => void;
  selectedTemplate: KnowledgeTemplate | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Selector</CardTitle>
        <CardDescription>
          Choose a template to start creating new content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TemplateSelector 
          onSelectTemplate={onSelectTemplate} 
          className="w-full"
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onCreateFromTemplate} 
          disabled={!selectedTemplate}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Create from Template
        </Button>
      </CardFooter>
    </Card>
  );
}
