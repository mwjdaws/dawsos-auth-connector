
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchKnowledgeTemplateById, 
  updateKnowledgeTemplate 
} from '@/services/api/templates';
import { KnowledgeTemplate } from '@/services/api/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import MarkdownPreview from '@/components/MarkdownEditor/MarkdownPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { JsonEditor } from './JsonEditor';

interface TemplateEditorProps {
  templateId: string;
  onSave?: (template: KnowledgeTemplate) => void;
  onCancel?: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ 
  templateId, 
  onSave,
  onCancel 
}) => {
  const [template, setTemplate] = useState<KnowledgeTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('edit');
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [metadata, setMetadata] = useState<string>('{}');
  const [structure, setStructure] = useState<string>('{}');

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        const loadedTemplate = await fetchKnowledgeTemplateById(templateId);
        setTemplate(loadedTemplate);
        
        // Initialize form state
        setName(loadedTemplate.name);
        setContent(loadedTemplate.content);
        setIsGlobal(loadedTemplate.is_global || false);
        setMetadata(JSON.stringify(loadedTemplate.metadata || {}, null, 2));
        setStructure(JSON.stringify(loadedTemplate.structure || {}, null, 2));
      } catch (err) {
        console.error('Error loading template:', err);
        setError(err instanceof Error ? err : new Error('Failed to load template'));
        toast({
          title: "Error Loading Template",
          description: "Could not load the template. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (templateId) {
      loadTemplate();
    }
  }, [templateId, toast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Parse JSON fields
      let parsedMetadata;
      let parsedStructure;
      
      try {
        parsedMetadata = JSON.parse(metadata);
        parsedStructure = JSON.parse(structure);
      } catch (err) {
        toast({
          title: "Invalid JSON",
          description: "The metadata or structure contains invalid JSON.",
          variant: "destructive",
        });
        return;
      }
      
      // Prepare update data
      const updates = {
        name,
        content,
        is_global: isGlobal,
        metadata: parsedMetadata,
        structure: parsedStructure,
        updated_at: new Date().toISOString()
      };
      
      // Update the template
      const updatedTemplate = await updateKnowledgeTemplate(templateId, updates);
      
      toast({
        title: "Template Saved",
        description: `The template "${name}" has been updated successfully.`,
      });
      
      // Update local state and call onSave callback
      setTemplate(updatedTemplate[0]);
      if (onSave) onSave(updatedTemplate[0]);
    } catch (err) {
      console.error('Error saving template:', err);
      toast({
        title: "Error Saving Template",
        description: "Could not save the template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading template...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
            <h3 className="text-lg font-medium">Error Loading Template</h3>
            <p>{error.message}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={onCancel}
            >
              Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Template</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="template-global"
              checked={isGlobal}
              onCheckedChange={setIsGlobal}
            />
            <Label htmlFor="template-global">
              Global Template <span className="text-xs text-muted-foreground">(available to all users)</span>
            </Label>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="edit">Edit Content</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-content">Template Content (Markdown)</Label>
                <Textarea
                  id="template-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter markdown content"
                  className="min-h-[300px] font-mono"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-md p-4">
                <MarkdownPreview content={content} />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-4 pt-4">
            <Label htmlFor="template-metadata">Metadata (JSON)</Label>
            <JsonEditor
              id="template-metadata"
              value={metadata}
              onChange={setMetadata}
              height="150px"
            />
          </div>

          <div className="space-y-4 pt-4">
            <Label htmlFor="template-structure">Structure (JSON)</Label>
            <JsonEditor
              id="template-structure"
              value={structure}
              onChange={setStructure}
              height="150px"
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Template
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateEditor;
