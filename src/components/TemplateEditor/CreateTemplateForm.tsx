
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { createKnowledgeTemplate } from '@/services/api/templates/knowledgeTemplateMutators';
import { JsonEditor } from './JsonEditor';

interface CreateTemplateFormProps {
  onCancel: () => void;
  onSuccess: (templateId: string) => void;
}

const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({ 
  onCancel,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const [metadata, setMetadata] = useState<string>('{}');
  const [structure, setStructure] = useState<string>('{}');
  const [saving, setSaving] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!name || !content) {
      toast({
        title: "Missing Fields",
        description: "Template name and content are required.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to create templates.",
        variant: "destructive",
      });
      return;
    }

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
      
      // Create the template
      const templateData = {
        name,
        content,
        is_global: isGlobal,
        metadata: parsedMetadata,
        structure: parsedStructure,
        user_id: user.id
      };
      
      const createdTemplate = await createKnowledgeTemplate(templateData);
      
      toast({
        title: "Template Created",
        description: `The template "${name}" has been created successfully.`,
      });
      
      // Call success callback with the new template ID
      if (createdTemplate[0]) {
        onSuccess(createdTemplate[0].id);
      } else {
        onCancel();
      }
    } catch (err) {
      console.error('Error creating template:', err);
      toast({
        title: "Error Creating Template",
        description: "Could not create the template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Template</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="template-content">Template Content (Markdown)</Label>
            <Textarea
              id="template-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter markdown content"
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template-metadata">Metadata (JSON)</Label>
            <JsonEditor
              id="template-metadata"
              value={metadata}
              onChange={setMetadata}
              height="150px"
            />
          </div>

          <div className="space-y-2">
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
        >
          {saving ? 'Creating...' : 'Create Template'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateTemplateForm;
