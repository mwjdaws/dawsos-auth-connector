
# Tag Generation System

## Overview

The tag generation system in DawsOS allows automatic and manual creation of tags for knowledge content. It leverages OpenAI's API through Supabase Edge Functions to automatically generate relevant tags based on content analysis.

## Architecture

The system consists of the following components:

1. **Frontend Components**
   - `TagPanel` - Main container component for the tag system
   - `TagGenerator` - Component for generating tags from content
   - `TagList` - Component for displaying generated tags
   - `ManualTagCreator` - Component for manually creating tags
   - `GroupedTagList` - Component for displaying tags grouped by type

2. **Hooks**
   - `useTagGeneration` - Core hook for generating tags from content
   - `useTagValidator` - Validation utilities for tag data
   - `useTagCache` - Caching mechanism for tag operations
   - `useSaveTags` - Hook for saving tags to the database
   - `useTagManagement` - Hook for managing tags in the metadata panel

3. **Edge Functions**
   - `generate-tags` - Processes content and generates tags using OpenAI
   - `get-related-tags` - Retrieves related tags for a given content ID

4. **Database Structure**
   - `tags` table - Stores tag data with content_id references
   - `tag_types` table - Defines different types of tags
   - `tag_relations` table - Defines relationships between tags

## Flow Diagram

```
Content Text → TagGenerator → useTagGeneration → generate-tags Edge Function → OpenAI 
                                                                               ↓
User Interface ← TagList ← Tag Data Storage ← Database Insert ← Generated Tags
```

## Tag Generation Process

1. User enters or loads content in the TagGenerator component
2. Content is sent to the generate-tags Edge Function
3. The Edge Function processes the content with OpenAI
4. Generated tags are returned to the frontend
5. Tags are displayed in the TagList component
6. User can save tags to the database with TagSaver

## Manual Tag Creation

1. User enters a tag name in the ManualTagCreator
2. User selects a tag type from the dropdown
3. Tag is saved directly to the database
4. Tag appears in the GroupedTagList component

## Handling Content IDs

All tags are associated with a `content_id` which links them to specific knowledge sources.

1. Temporary content IDs (prefixed with 'temp-') are created for content that hasn't been saved yet
2. Permanent content IDs are created when content is saved to the database
3. Content ID validation occurs throughout the system to ensure data integrity

## Common Issues and Solutions

### Error: "Edge Function returned a non-2xx status code"

This error typically occurs when:
- The Edge Function encountered an internal error
- The Edge Function doesn't exist
- The database function referenced by the Edge Function doesn't exist

**Solution**: Check the Edge Function logs in the Supabase dashboard and ensure all required database functions are created.

### Error: "Failed to generate tags"

This error may occur when:
- The OpenAI API key is invalid or missing
- The content provided is too short
- The OpenAI service is unavailable

**Solution**: Verify your OpenAI API key and ensure the content provided is substantial enough for tag generation.
