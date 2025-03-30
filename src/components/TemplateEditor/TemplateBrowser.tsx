
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Plus, Trash } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { KnowledgeTemplate } from '@/services/api/types';
import { useTemplates } from '@/hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';
import { 
  deleteKnowledgeTemplate,
  duplicateKnowledgeTemplate 
} from '@/services/api/templates/knowledgeTemplateMutators';

interface TemplateBrowserProps {
  onSelectTemplate: (templateId: string) => void;
  onCreateNew: () => void;
}

const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ 
  onSelectTemplate,
  onCreateNew 
}) => {
  const { templates, isLoading, error, refetch } = useTemplates();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter templates based on search query
  const filteredTemplates = searchQuery
    ? templates.filter(template => 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;

  const handleDuplicate = async (templateId: string, templateName: string) => {
    try {
      setProcessingId(templateId);
      const newTemplate = await duplicateKnowledgeTemplate(templateId);
      
      toast({
        title: "Template Duplicated",
        description: `Created a copy of "${templateName}"`,
      });
      
      // Refresh the template list
      refetch();
    } catch (error) {
      console.error('Error duplicating template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate template",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (templateId: string, templateName: string) => {
    // Confirm before deletion
    if (!window.confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      return;
    }
    
    try {
      setProcessingId(templateId);
      await deleteKnowledgeTemplate(templateId);
      
      toast({
        title: "Template Deleted",
        description: `"${templateName}" has been deleted`,
      });
      
      // Refresh the template list
      refetch();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Template Library</CardTitle>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          Create New Template
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : error ? (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
            <h3 className="text-lg font-medium">Error Loading Templates</h3>
            <p>Failed to load templates. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? "No templates match your search." : "No templates available."}
          </div>
        ) : (
          <Table>
            <TableCaption>
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.is_global ? 'Global' : 'Custom'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTemplate(template.id)}
                      className="ml-2"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(template.id, template.name)}
                      disabled={processingId === template.id}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template.id, template.name)}
                      disabled={processingId === template.id}
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateBrowser;
