
# Knowledge Templates Documentation

Below is a SQL script to pre-seed knowledge templates into the `knowledge_templates` table, incorporating the columns `structure`, `is_global`, `created_at`, and `updated_at`. These templates include predefined structures for business, research, technical, and general use cases.

## SQL Script: Pre-Seed Knowledge Templates

```sql
-- Insert predefined knowledge templates into the knowledge_templates table
INSERT INTO knowledge_templates (id, name, content, structure, is_global, created_at, updated_at)
VALUES
-- Business Templates
(gen_random_uuid(), 'Meeting Notes', 
'# Meeting Notes

## Meeting Objective

## Attendees

## Agenda

## Discussion Points

## Action Items',
'{
  "sections": [
    { "title": "Meeting Objective", "content": "" },
    { "title": "Attendees", "content": "" },
    { "title": "Agenda", "content": "" },
    { "title": "Discussion Points", "content": "" },
    { "title": "Action Items", "content": "" }
  ]
}', 
TRUE, now(), now()),

(gen_random_uuid(), 'Project Plan', 
'# Project Plan

## Project Name

## Objective

## Scope

## Timeline

## Resources

## Risks',
'{
  "sections": [
    { "title": "Project Name", "content": "" },
    { "title": "Objective", "content": "" },
    { "title": "Scope", "content": "" },
    { "title": "Timeline", "content": "" },
    { "title": "Resources", "content": "" },
    { "title": "Risks", "content": "" }
  ]
}', 
TRUE, now(), now()),

-- Research Templates
(gen_random_uuid(), 'Research Summary', 
'# Research Summary

## Research Topic

## Abstract

## Methodology

## Findings

## Conclusion

## References',
'{
  "sections": [
    { "title": "Research Topic", "content": "" },
    { "title": "Abstract", "content": "" },
    { "title": "Methodology", "content": "" },
    { "title": "Findings", "content": "" },
    { "title": "Conclusion", "content": "" },
    { "title": "References", "content": "" }
  ]
}', 
TRUE, now(), now()),

(gen_random_uuid(), 'Experiment Log', 
'# Experiment Log

## Experiment Name

## Objective

## Hypothesis

## Procedure

## Results

## Analysis',
'{
  "sections": [
    { "title": "Experiment Name", "content": "" },
    { "title": "Objective", "content": "" },
    { "title": "Hypothesis", "content": "" },
    { "title": "Procedure", "content": "" },
    { "title": "Results", "content": "" },
    { "title": "Analysis", "content": "" }
  ]
}', 
TRUE, now(), now()),

-- Technical Templates
(gen_random_uuid(), 'Technical Design Document', 
'# Technical Design Document

## Title

## Overview

## Requirements

## Architecture

## Implementation Details

## Testing Plan

## Risks and Mitigations',
'{
  "sections": [
    { "title": "Title", "content": "" },
    { "title": "Overview", "content": "" },
    { "title": "Requirements", "content": "" },
    { "title": "Architecture", "content": "" },
    { "title": "Implementation Details", "content": "" },
    { "title": "Testing Plan", "content": "" },
    { "title": "Risks and Mitigations", "content": "" }
  ]
}', 
TRUE, now(), now()),

(gen_random_uuid(), 'API Documentation', 
'# API Documentation

## API Name

## Description

## Endpoints

## Request/Response Examples

## Error Codes

## Version History',
'{
  "sections": [
    { "title": "API Name", "content": "" },
    { "title": "Description", "content": "" },
    { "title": "Endpoints", "content": "" },
    { "title": "Request/Response Examples", "content": "" },
    { "title": "Error Codes", "content": "" },
    { "title": "Version History", "content": "" }
  ]
}', 
TRUE, now(), now()),

-- General Templates
(gen_random_uuid(), 'Personal Journal', 
'# Personal Journal

## Date

## Mood

## Highlights

## Challenges

## Gratitude',
'{
  "sections": [
    { "title": "Date", "content": "" },
    { "title": "Mood", "content": "" },
    { "title": "Highlights", "content": "" },
    { "title": "Challenges", "content": "" },
    { "title": "Gratitude", "content": "" }
  ]
}', 
TRUE, now(), now()),

(gen_random_uuid(), 'Brainstorming Notes', 
'# Brainstorming Notes

## Topic

## Ideas

## Pros and Cons

## Next Steps',
'{
  "sections": [
    { "title": "Topic", "content": "" },
    { "title": "Ideas", "content": "" },
    { "title": "Pros and Cons", "content": "" },
    { "title": "Next Steps", "content": "" }
  ]
}', 
TRUE, now(), now());
```

## Explanation of the Script

1. **Columns**:
   - **`id`**: A unique identifier for each template, generated using `gen_random_uuid()`.
   - **`name`**: The name of the template (e.g., "Meeting Notes", "Research Summary").
   - **`content`**: The markdown content of the template with section headers.
   - **`structure`**: A JSON object defining the sections and placeholders for the template.
   - **`is_global`**: Set to `TRUE` to make the templates available to all users.
   - **`created_at`** and **`updated_at`**: Timestamps for when the template was created and last updated.

2. **Templates**:
   - **Business Templates**:
     - `Meeting Notes`: For documenting meeting objectives, attendees, agenda, and action items.
     - `Project Plan`: For planning projects with objectives, scope, timeline, and risks.
   - **Research Templates**:
     - `Research Summary`: For summarizing research topics, methodology, findings, and references.
     - `Experiment Log`: For documenting experiments with objectives, hypotheses, procedures, and results.
   - **Technical Templates**:
     - `Technical Design Document`: For technical designs, including architecture, requirements, and risks.
     - `API Documentation`: For documenting APIs with endpoints, examples, and error codes.
   - **General Templates**:
     - `Personal Journal`: For daily journaling with sections for mood, highlights, and gratitude.
     - `Brainstorming Notes`: For capturing ideas, pros/cons, and next steps during brainstorming sessions.

3. **JSON Structure**:
   - Each template's `structure` is stored as a JSON object with `sections`. Each section has a `title` and an empty `content` field.

## How These Templates Fit into the Application

1. **Dynamic Content Creation**:
   - The `structure` column allows templates to be dynamically rendered in the markdown editor or content creation interface.
   - Users can select a template and pre-fill the editor with its sections.

2. **Global Availability**:
   - The `is_global` column ensures these templates are available to all users, providing a consistent starting point for content creation.

3. **Version Tracking**:
   - The `created_at` and `updated_at` columns enable tracking of when templates were added or modified.

## Implementation Notes

1. **Frontend Integration**:
   - Add a dropdown or modal in the editor to allow users to select and apply these templates.
   - Fetch templates using the `fetchKnowledgeTemplates` function and filter by `is_global`.

2. **Custom Templates**:
   - Allow users to create their own templates and save them to the `knowledge_templates` table with `is_global = FALSE`.

3. **Template Previews**:
   - Display a preview of the template structure before applying it.

## Usage in Code

The following services are used to interact with templates:

- `fetchKnowledgeTemplates`: Retrieves all templates with pagination
- `fetchKnowledgeTemplateById`: Retrieves a specific template by ID
- `createKnowledgeTemplate`: Creates a new template
- `updateKnowledgeTemplate`: Updates an existing template
- `deleteKnowledgeTemplate`: Deletes a template
- `applyTemplateToSource`: Applies a template to an existing knowledge source
- `createKnowledgeSourceFromTemplate`: Creates a new knowledge source from a template

These can be imported from:
```javascript
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
