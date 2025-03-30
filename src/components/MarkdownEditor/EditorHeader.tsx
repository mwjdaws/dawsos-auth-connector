
import React from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { KnowledgeTemplate } from '@/services/api/types';
import { ArchiveRestore, Link, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UseTemplate } from '@/components/TemplateEditor';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import TemplateSelector from './TemplateSelector';

interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  templateId: string | null;
  externalSourceUrl: string;
  setExternalSourceUrl: (url: string) => void;
  templates: KnowledgeTemplate[];
  isLoadingTemplates: boolean;
  onTemplateChange: (templateId: string) => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  title,
  setTitle,
  templateId,
  externalSourceUrl,
  setExternalSourceUrl,
  templates,
  isLoadingTemplates,
  onTemplateChange,
}) => {
  const { user } = useAuth();

  const handleApplyTemplate = (content: string) => {
    // This function will be called when a template is applied
    // For now, we'll just set the title to indicate that a template was applied
    setTitle(title ? `${title} (From Template)` : 'New Document (From Template)');
  };
  
  const handleClearExternalSource = () => {
    if (confirm('Are you sure you want to remove the external source link?')) {
      setExternalSourceUrl('');
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="document-title">Document Title</Label>
        <Input
          id="document-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
          className="w-full"
          aria-label="Document title"
        />
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px]">
          <TemplateSelector
            templateId={templateId}
            templates={templates}
            isLoading={isLoadingTemplates}
            onChange={onTemplateChange}
          />
        </div>
        
        {user && templateId && (
          <UseTemplate 
            templateId={templateId} 
            onApply={handleApplyTemplate}
            label="Reload From Template"
            variant="outline"
            size="sm"
          />
        )}
      </div>

      {externalSourceUrl && (
        <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded border border-blue-100">
          <Link size={16} className="text-blue-600" />
          <span className="text-sm text-blue-800 flex-1 truncate">
            External source: {externalSourceUrl}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearExternalSource}
            className="h-8 w-8 p-0"
            title="Unlink external source"
          >
            <Unlink size={14} className="text-blue-600" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditorHeader;
