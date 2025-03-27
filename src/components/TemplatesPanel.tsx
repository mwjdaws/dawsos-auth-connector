
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { TemplateSelector } from "@/components/TemplateSelector";
import { fetchKnowledgeTemplates, KnowledgeTemplate, PaginationParams } from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { FileText, Plus, ArrowRight } from "lucide-react";

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
          <Card>
            <CardHeader>
              <CardTitle>Template Selector</CardTitle>
              <CardDescription>
                Choose a template to start creating new content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TemplateSelector 
                onSelectTemplate={handleTemplateSelect} 
                className="w-full"
              />
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleCreateFromTemplate} 
                disabled={!selectedTemplate}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Create from Template
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Selected Template</CardTitle>
              <CardDescription>
                Preview of the currently selected template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-2">
                  <div className="bg-muted p-2 rounded flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    <span className="font-medium">{selectedTemplate.name}</span>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto p-3 border rounded-md text-sm font-mono">
                    {selectedTemplate.content.slice(0, 200)}
                    {selectedTemplate.content.length > 200 && '...'}
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <FileText size={48} className="mx-auto mb-2 opacity-30" />
                  <p>Select a template to preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Available Templates</CardTitle>
            <div className="w-64">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : templates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates
                  .filter(template => 
                    searchQuery.trim() === "" || 
                    template.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {template.content.slice(0, 50)}...
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleTemplateSelect(template)}
                          className="flex items-center gap-1"
                        >
                          <span>Select</span>
                          <ArrowRight size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-6 text-muted-foreground">
              No templates found.
            </div>
          )}
        </CardContent>
        {pagination.totalPages > 1 && (
          <CardFooter>
            <Pagination className="w-full">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, pagination.page - 1))} 
                    className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === pagination.page}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))} 
                    className={pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
