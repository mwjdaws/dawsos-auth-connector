
# Knowledge Templates SQL Script

Below is the complete SQL script to pre-seed knowledge templates into the `knowledge_templates` table.

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

2. **Templates by Category**:
   - **Business Templates**: Meeting Notes, Project Plan
   - **Research Templates**: Research Summary, Experiment Log
   - **Technical Templates**: Technical Design Document, API Documentation
   - **General Templates**: Personal Journal, Brainstorming Notes

## Implementation Notes

When implementing this script in your application:

1. Ensure your database has the `knowledge_templates` table already created
2. Consider adding a `user_id` column for private templates
3. Run this script only once to avoid duplicate templates
4. Adapt the template content as needed for your specific use case
