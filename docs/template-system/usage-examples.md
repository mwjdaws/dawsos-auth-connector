
# Template System Usage Examples

## Creating a New Template

```typescript
const newTemplate = {
  name: "Bug Report",
  content: "# Bug Report\n\n## Description\n\n## Steps to Reproduce\n\n## Expected Behavior\n\n## Actual Behavior\n\n## Environment\n\n## Screenshots",
  structure: {
    sections: [
      { title: "Description", content: "" },
      { title: "Steps to Reproduce", content: "" },
      { title: "Expected Behavior", content: "" },
      { title: "Actual Behavior", content: "" },
      { title: "Environment", content: "" },
      { title: "Screenshots", content: "" }
    ]
  },
  is_global: false,
  metadata: {
    category: "development",
    tags: ["bug", "issue", "report"]
  }
};

await createKnowledgeTemplate(newTemplate);
```

## Applying a Template

```typescript
// In a component
const handleApplyTemplate = async (templateId) => {
  const knowledgeSourceId = "existing-document-id";
  await applyTemplateToSource(templateId, knowledgeSourceId);
  
  // Refresh the document
  refetchDocument();
};
```

## Rendering a Template Selector

```tsx
import React from 'react';
import { useTemplates } from '@/hooks/useTemplates';
import TemplateSelector from '@/components/MarkdownEditor/TemplateSelector';

const TemplatePickerComponent = ({ onTemplateSelect }) => {
  const { templates, isLoading } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    onTemplateSelect(templateId);
  };
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-2">Choose a Template</h3>
      <TemplateSelector
        templateId={selectedTemplateId}
        templates={templates}
        isLoading={isLoading}
        onChange={handleTemplateChange}
      />
    </div>
  );
};
```

## Creating a New Knowledge Source from a Template

```typescript
const createFromTemplate = async (templateId: string, title: string) => {
  try {
    const newSource = await createKnowledgeSourceFromTemplate(templateId, {
      title: title,
      // User ID will be automatically added from the current session
    });
    
    // Navigate to the new document
    router.push(`/documents/${newSource.id}`);
    
    toast({
      title: "Document Created",
      description: `New document created from template "${title}"`,
    });
  } catch (error) {
    console.error('Failed to create document from template:', error);
    toast({
      title: "Error Creating Document",
      description: "Failed to create a new document from the template",
      variant: "destructive",
    });
  }
};
```

## Future Enhancements

Planned improvements to the template system include:

- Template categories and tags for better organization
- Template permissions for team sharing
- Variable substitution in templates
- Template versioning
- Template analytics (usage tracking)
- AI-assisted template creation
