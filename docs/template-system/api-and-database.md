
# Template System API and Database

## Database Schema

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
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id)
);
```

## API Functions

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

### Function Details

- `fetchKnowledgeTemplates`: Retrieves all templates with pagination
- `fetchKnowledgeTemplateById`: Retrieves a specific template by ID
- `createKnowledgeTemplate`: Creates a new template
- `updateKnowledgeTemplate`: Updates an existing template
- `deleteKnowledgeTemplate`: Deletes a template
- `applyTemplateToSource`: Applies a template to an existing knowledge source
- `createKnowledgeSourceFromTemplate`: Creates a new knowledge source from a template

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
