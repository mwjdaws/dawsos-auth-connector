
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import TemplateSelector from "@/components/TemplateSelector";
import { 
  createKnowledgeSource, 
  KnowledgeTemplate
} from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export function CreateKnowledgeForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (template: KnowledgeTemplate) => {
    setFormData(prev => ({ ...prev, content: template.content }));
    toast({
      title: "Template Applied",
      description: `Template "${template.name}" has been applied`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const result = await createKnowledgeSource({
        title: formData.title,
        content: formData.content || "# New Document\n\nStart writing here...",
        user_id: user?.id
      });

      if (result) {
        toast({
          title: "Success",
          description: "Knowledge source created successfully!"
        });
        
        // Reset form after successful creation
        setFormData({ title: "", content: "" });
      }
    } catch (error) {
      console.error("Error creating knowledge source:", error);
      toast({
        title: "Error",
        description: "Failed to create knowledge source",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Knowledge Source</CardTitle>
        <CardDescription>
          Create a new knowledge source or use a template to get started quickly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Template
            </label>
            <TemplateSelector 
              onSelectTemplate={handleTemplateSelect}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select a template to pre-fill the content or create a new template.
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="# New Document
              
Start writing here..."
              rows={12}
              value={formData.content}
              onChange={handleInputChange}
              className="font-mono text-sm"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Knowledge Source"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateKnowledgeForm;
