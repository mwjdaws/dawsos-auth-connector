
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchKnowledgeTemplateById, 
  updateKnowledgeTemplate 
} from '@/services/api/templates';
import { KnowledgeTemplate } from '@/services/api/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Import components directly rather than through index to avoid potential circular dependencies
import TemplateEditorHeader from './TemplateEditorHeader';
import TemplateNameField from './TemplateNameField';
import TemplateGlobalToggle from './TemplateGlobalToggle';
import TemplateContentEditor from './TemplateContentEditor';
import TemplateJsonFields from './TemplateJsonFields';
import TemplateEditorFooter from './TemplateEditorFooter';

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
      <TemplateEditorHeader isEditing={true} />
      <CardContent>
        <div className="space-y-4">
          <TemplateNameField name={name} setName={setName} />
          <TemplateGlobalToggle isGlobal={isGlobal} setIsGlobal={setIsGlobal} />
          <TemplateContentEditor 
            content={content}
            setContent={setContent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TemplateJsonFields
            metadata={metadata}
            setMetadata={setMetadata}
            structure={structure}
            setStructure={setStructure}
          />
        </div>
      </CardContent>
      
      <TemplateEditorFooter
        onCancel={onCancel}
        onSave={handleSave}
        saving={saving}
      />
    </Card>
  );
};

export default TemplateEditor;
