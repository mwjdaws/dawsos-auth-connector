
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
import { useAuth } from "@/hooks/useAuth";

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
  const [filterType, setFilterType] = useState<'all' | 'global' | 'custom'>('all');
  const { user } = useAuth();

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetchKnowledgeTemplates();
      
      let filteredTemplates = response.data;
      if (filterType === 'global') {
        filteredTemplates = response.data.filter(template => template.is_global);
      } else if (filterType === 'custom' && user) {
        filteredTemplates = response.data.filter(template => 
          !template.is_global && template.user_id === user.id
        );
      }
      
      // Further filter by search query if provided
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredTemplates = filteredTemplates.filter(template => 
          template.name.toLowerCase().includes(query) || 
          template.content.toLowerCase().includes(query)
        );
      }
      
      setTemplates(filteredTemplates);
      
      // Set pagination manually
      setPagination({
        page: 1,
        pageSize: 5,
        totalPages: Math.ceil(filteredTemplates.length / 5),
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
  }, [filterType, searchQuery, user]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  };

  const handleTemplateSelect = (template: KnowledgeTemplate) => {
    setSelectedTemplate(template);
    toast({
      title: "Template Selected",
      description: `Selected template: ${template.name}`,
    });
  };

  const handleFilterChange = (type: 'all' | 'global' | 'custom') => {
    setFilterType(type);
  };

  const handleCreateFromTemplate = () => {
    if (!selectedTemplate) {
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create content from templates",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Creating Content",
      description: `Creating new content from template: ${selectedTemplate.name}`,
    });
    
    // Here you would typically redirect to a creation page or open a modal
    // For now, we'll just show a toast
  };

  // Get paginated templates
  const paginatedTemplates = templates.slice(
    (pagination.page - 1) * pagination.pageSize,
    pagination.page * pagination.pageSize
  );

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
        templates={paginatedTemplates}
        loading={loading}
        pagination={pagination}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handlePageChange={handlePageChange}
        handleTemplateSelect={handleTemplateSelect}
        filterType={filterType}
        onFilterChange={handleFilterChange}
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

export default TemplatesPanel;
