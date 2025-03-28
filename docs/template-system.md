
# Template System Documentation

## Overview

The template system in DawsOS provides a way to create, manage, and apply structured content templates to knowledge sources. Templates help users maintain consistency in their documentation and reduce the effort required to create new content.

## Core Concepts

### Template Structure

Each template consists of:

- **Name**: A descriptive title
- **Content**: The markdown template content
- **Structure**: A JSON representation of the template's structure
- **Global Flag**: Whether the template is available to all users
- **Metadata**: Additional information about the template

### Template Types

Templates can be categorized as:

1. **Global Templates**: Available to all users, typically pre-defined by administrators
2. **User Templates**: Created by individual users for their own use
3. **Organization Templates**: Shared within a specific organization or team

## Components and Hooks

### Template Management

#### useTemplates Hook

The primary hook for accessing template data:

```typescript
const { 
  templates,
  isLoading,
  error,
  refetch
} = useTemplates();
```

#### TemplateSelector Component

UI component for selecting and applying templates:

```typescript
<TemplateSelector
  selectedTemplateId={templateId}
  onTemplateChange={handleTemplateChange}
  disabled={isLoading}
/>
```

#### TemplatesPanel Component

Dashboard panel for browsing, creating, and managing templates:

```typescript
<TemplatesPanel />
```

### Template Application

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

## API and Database

### Database Schema

Templates are stored in the `knowledge_templates` table:

```sql
CREATE TABLE knowledge_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  structure JSONB,
  is_global BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);
```

### API Functions

The template system exposes several API functions:

```typescript
import { 
  fetchKnowledgeTemplates,
  fetchKnowledgeTemplateById,
  createKnowledgeTemplate,
  updateKnowledgeTemplate,
  deleteKnowledgeTemplate,
  applyTemplateToSource,
  createKnowledgeSourceFromTemplate
} from '@/services/api';
```

#### Function Details

- `fetchKnowledgeTemplates`: Retrieves all templates with pagination
- `fetchKnowledgeTemplateById`: Retrieves a specific template by ID
- `createKnowledgeTemplate`: Creates a new template
- `updateKnowledgeTemplate`: Updates an existing template
- `deleteKnowledgeTemplate`: Deletes a template
- `applyTemplateToSource`: Applies a template to an existing knowledge source
- `createKnowledgeSourceFromTemplate`: Creates a new knowledge source from a template

## Pre-defined Templates

DawsOS comes with several pre-defined templates:

### Business Templates
- Meeting Notes
- Project Plan

### Research Templates
- Research Summary
- Experiment Log

### Technical Templates
- Technical Design Document
- API Documentation

### General Templates
- Personal Journal
- Brainstorming Notes

## Template Structure Format

Templates use a structured JSON format to define their sections:

```json
{
  "sections": [
    { "title": "Meeting Objective", "content": "" },
    { "title": "Attendees", "content": "" },
    { "title": "Agenda", "content": "" },
    { "title": "Discussion Points", "content": "" },
    { "title": "Action Items", "content": "" }
  ]
}
```

This structure can be used to:
- Generate the markdown content
- Provide structured editing experiences
- Validate that required sections are completed

## Usage Examples

### Creating a New Template

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

### Applying a Template

```typescript
// In a component
const handleApplyTemplate = async (templateId) => {
  const knowledgeSourceId = "existing-document-id";
  await applyTemplateToSource(templateId, knowledgeSourceId);
  
  // Refresh the document
  refetchDocument();
};
```

## Implementation Notes

### Template Filtering

Templates can be filtered by various criteria:

```typescript
const filteredTemplates = templates.filter(template => {
  if (filterType === "global") return template.is_global;
  if (filterType === "personal") return !template.is_global;
  return true; // "all" filter
});
```

### Template Preview

The system provides a preview of templates before application:

```typescript
<TemplatePreview
  template={selectedTemplate}
  onApply={() => handleApplyTemplate(selectedTemplate.id)}
/>
```

## Future Enhancements

Planned improvements to the template system include:

- Template categories and tags for better organization
- Template permissions for team sharing
- Variable substitution in templates
- Template versioning
- Template analytics (usage tracking)
- AI-assisted template creation
