
# Pre-defined Templates

DawsOS comes with several pre-defined templates that provide a starting point for various types of content.

## Business Templates

### Meeting Notes

```markdown
# Meeting Notes

## Meeting Objective

## Attendees

## Agenda

## Discussion Points

## Action Items
```

### Project Plan

```markdown
# Project Plan

## Project Name

## Objective

## Scope

## Timeline

## Resources

## Risks
```

## Research Templates

### Research Summary

```markdown
# Research Summary

## Research Topic

## Abstract

## Methodology

## Findings

## Conclusion

## References
```

### Experiment Log

```markdown
# Experiment Log

## Experiment Name

## Objective

## Hypothesis

## Procedure

## Results

## Analysis
```

## Technical Templates

### Technical Design Document

```markdown
# Technical Design Document

## Title

## Overview

## Requirements

## Architecture

## Implementation Details

## Testing Plan

## Risks and Mitigations
```

### API Documentation

```markdown
# API Documentation

## API Name

## Description

## Endpoints

## Request/Response Examples

## Error Codes

## Version History
```

## General Templates

### Personal Journal

```markdown
# Personal Journal

## Date

## Mood

## Highlights

## Challenges

## Gratitude
```

### Brainstorming Notes

```markdown
# Brainstorming Notes

## Topic

## Ideas

## Pros and Cons

## Next Steps
```

## SQL Script for Pre-seeding Templates

You can use the following SQL script to pre-seed these templates into your database:

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

-- Include other templates following the same pattern...
```

For the complete SQL script, see the [knowledge-templates.md](./knowledge-templates.md) file.
