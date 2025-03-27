
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  fetchKnowledgeTemplates,
  createKnowledgeTemplate,
  KnowledgeTemplate
} from "@/services/api";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";

interface TemplateSelectorProps {
  onSelectTemplate: (template: KnowledgeTemplate) => void;
  className?: string;
}

export function TemplateSelector({ onSelectTemplate, className }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<KnowledgeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: ''
  });

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await fetchKnowledgeTemplates();
        setTemplates(data || []);
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

    loadTemplates();
  }, []);

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
      const data = await createKnowledgeTemplate({
        name: newTemplate.name,
        content: newTemplate.content,
        metadata: { custom: true }
      });

      if (data && data.length > 0) {
        setTemplates(prev => [...prev, data[0]]);
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
      <Select onValueChange={handleTemplateChange} disabled={loading}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
          <SelectItem value="create-new" className="text-primary font-medium">
            <div className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Custom Template
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

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
