
# DawsOS Database Structure

## Overview

DawsOS uses a Supabase PostgreSQL database to store and manage knowledge content, tags, templates, and user data. This document outlines the database structure, relationships, and important considerations for development.

## Core Tables

### Knowledge Sources

The `knowledge_sources` table stores the primary content items in the system.

**Key Fields:**
- `id` (UUID, PK): Unique identifier
- `title` (text): Content title
- `content` (text): The actual content in markdown format
- `user_id` (UUID): Reference to the user who created the content
- `published` (boolean): Whether the content is published
- `published_at` (timestamp): When the content was published
- `metadata` (jsonb): Additional metadata about the content
- `external_source_url` (text): URL to external source if applicable
- `needs_external_review` (boolean): Flag for content needing review

### Tags

The `tags` table stores tags associated with knowledge content.

**Key Fields:**
- `id` (UUID, PK): Unique identifier
- `name` (text): The tag name
- `content_id` (text): Reference to the associated content
- `type_id` (UUID): Reference to tag type if applicable

### Tag Types

The `tag_types` table defines different categories of tags.

**Key Fields:**
- `id` (UUID, PK): Unique identifier
- `name` (text): The tag type name

### Knowledge Templates

The `knowledge_templates` table stores template structures for content creation.

**Key Fields:**
- `id` (UUID, PK): Unique identifier
- `name` (text): Template name
- `content` (text): Template content/structure
- `structure` (jsonb): Structured definition of the template
- `is_global` (boolean): Whether the template is globally available
- `user_id` (UUID): Reference to the user who created the template

## Relationships

1. **Knowledge Sources to Tags**:
   - One-to-many relationship
   - A knowledge source can have multiple tags

2. **Tags to Tag Types**:
   - Many-to-one relationship
   - Many tags can belong to one tag type

3. **Knowledge Sources to Templates**:
   - Many-to-one relationship
   - Many knowledge sources can use one template

## Error Cases and Solutions

### "Could not find the function public.get_related_tags"

**Problem**: The Tag List component tries to call a database function `public.get_related_tags` which doesn't exist.

**Solution**: You need to create this function in your Supabase database or modify the code to handle this missing function.

```sql
-- Example SQL to create the missing function
CREATE OR REPLACE FUNCTION public.get_related_tags(knowledge_source_id TEXT)
RETURNS TABLE (tag_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT t2.name
  FROM tags t1
  JOIN tags t2 ON t1.name != t2.name AND t1.content_id = t2.content_id
  WHERE t1.content_id = knowledge_source_id
  GROUP BY t2.name
  ORDER BY COUNT(*) DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
```

### "Tag creation failed with RLS policy violation"

**Problem**: Users cannot create tags due to Row Level Security policies.

**Solution**: Ensure proper RLS policies are in place for the tags table:

```sql
-- Example SQL to create appropriate RLS policies
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to tags"
  ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to insert tags"
  ON public.tags
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow users to update their own tags"
  ON public.tags
  FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM knowledge_sources ks 
    WHERE ks.id::text = content_id
  ));

CREATE POLICY "Allow users to delete their own tags"
  ON public.tags
  FOR DELETE
  USING (auth.uid() IN (
    SELECT user_id FROM knowledge_sources ks 
    WHERE ks.id::text = content_id
  ));
```

## Performance Considerations

1. **Indexing**: Consider adding indexes to frequently queried columns:
   ```sql
   CREATE INDEX idx_tags_content_id ON tags(content_id);
   CREATE INDEX idx_knowledge_sources_user_id ON knowledge_sources(user_id);
   ```

2. **Materialized Views**: For frequently accessed tag summaries:
   ```sql
   CREATE MATERIALIZED VIEW tag_summary AS
   SELECT 
     t.name,
     COUNT(*) as usage_count,
     array_agg(DISTINCT ks.id) as knowledge_source_ids
   FROM 
     tags t
     JOIN knowledge_sources ks ON t.content_id = ks.id::text
   GROUP BY 
     t.name
   ORDER BY 
     usage_count DESC;
   ```

3. **RLS Considerations**: Row Level Security policies can impact performance with complex conditions. Keep them as simple as possible.
