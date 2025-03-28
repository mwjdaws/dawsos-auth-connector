
# Template System Components and Hooks

## Template Management

### useTemplates Hook

The primary hook for accessing template data:

```typescript
const { 
  templates,
  isLoading,
  error,
  refetch
} = useTemplates();
```

### TemplateSelector Component

UI component for selecting and applying templates:

```typescript
<TemplateSelector
  selectedTemplateId={templateId}
  onTemplateChange={handleTemplateChange}
  disabled={isLoading}
/>
```

### TemplatesPanel Component

Dashboard panel for browsing, creating, and managing templates:

```typescript
<TemplatesPanel />
```

## Template Application

The process of applying a template:

1. User selects a template from the dropdown
2. Template content is loaded via `fetchKnowledgeTemplateById`
3. Editor content and title are updated with template values
4. Template ID is stored with the document for reference

```typescript
const handleTemplateChange = async (value: string) => {
  if (value === 'none') {
    setTemplateId(null);
    return;
  }

  setIsLoadingTemplate(true);
  try {
    const template = await fetchKnowledgeTemplateById(value);
    setTemplateId(template.id);
    setTitle(template.name);
    setContent(template.content);
    
    toast({
      title: "Template Loaded",
      description: `Template "${template.name}" has been loaded successfully`,
    });
  } catch (error) {
    console.error('Failed to load template:', error);
    toast({
      title: "Error Loading Template",
      description: "Failed to load the selected template",
      variant: "destructive",
    });
  } finally {
    setIsLoadingTemplate(false);
  }
};
```

## Custom Hooks

### useTemplateHandling

This hook encapsulates the logic for loading and applying templates to the editor:

```typescript
const {
  templateId,
  setTemplateId,
  isLoadingTemplate,
  handleTemplateChange
} = useTemplateHandling({
  setTitle,
  setContent,
  setTemplateId: externalSetTemplateId,
  setIsDirty
});
```
