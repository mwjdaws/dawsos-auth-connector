
# Tag System Architecture

This document outlines the architecture of the tag system, including the database schema, component structure, and data flow. It serves as a guide for developers working with the tag system.

## Database Schema

Tags are stored in the Supabase database with the following schema:

### Tags Table
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  type_id UUID REFERENCES tag_types(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  
  CONSTRAINT unique_tag_content UNIQUE (name, content_id)
);

CREATE INDEX idx_tags_content_id ON tags(content_id);
CREATE INDEX idx_tags_type_id ON tags(type_id);
CREATE INDEX idx_tags_display_order ON tags(display_order);
```

### Tag Types Table
```sql
CREATE TABLE tag_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  is_system BOOLEAN DEFAULT false
);
```

## Type System

The tag system uses the following TypeScript interfaces:

### Tag Interface
```typescript
interface Tag {
  id: string;
  name: string;
  content_id: string;
  type_id: string | null;
  type_name?: string | null;
  display_order: number;
}
```

### Tag Position Interface
```typescript
interface TagPosition {
  id: string;
  position: number;
}
```

### Tag Group Interface
```typescript
interface TagGroup {
  type_id: string | null;
  type_name: string | null;
  tags: Tag[];
}
```

## Component Architecture

The tag system consists of the following components:

### Tag Display Components
- `TagList`: Displays a list of tags
- `DraggableTagList`: Extends TagList with drag-and-drop reordering
- `TagPill`: Individual tag display component
- `GroupedTagList`: Displays tags grouped by type

### Tag Input Components
- `TagInput`: Input for creating new tags
- `TagTypeSelector`: Dropdown for selecting tag types

### Tag Panel Components
- `TagPanel`: Main component for tag CRUD operations
- `AutomaticTagTab`: UI for AI-generated tags
- `ManualTagTab`: UI for manually created tags

## Hook Architecture

The tag system uses a modular hook-based architecture:

### State Management
- `useTagState`: Manages local tag state

### Data Fetching
- `useTagFetch`: Fetches tags from the database
- `useTagsQuery`: React Query hook for tags

### Data Mutations
- `useTagMutations`: CRUD operations for tags
- `useTagReordering`: Specific hook for reordering operations

### Combined Operations
- `useTagOperations`: Combines state, fetching, and mutations
- `useTagGeneration`: Handles AI tag generation

## Data Flow

The tag system follows this data flow pattern:

1. **Initialization**:
   - `MetadataPanel` or `TagPanel` mounts
   - `useTagOperations` or relevant hooks initialize
   - Tags are fetched from the database

2. **Reading**:
   - Tags are stored in state
   - UI components render based on tag state
   - Tags may be grouped or filtered for display

3. **Writing**:
   - User performs CRUD operation (add, delete, reorder)
   - Operation is handled by relevant hook function
   - Database update is performed
   - State is updated (optimistically or after confirmation)
   - UI reflects the changes

4. **Reordering Specific Flow**:
   - User drags a tag to a new position
   - `DraggableTagList` calculates the new order
   - `handleReorderTags` is called with updated order
   - `reorderTags` function converts to `TagPosition[]`
   - Database is updated with new display_order values
   - State is updated with the new order

## Error Handling

The tag system uses centralized error handling:

- All operations are wrapped in try/catch blocks
- Errors are passed to the `handleError` utility
- Errors may trigger toast notifications
- Operation state (isLoading, error) is tracked and exposed

## Performance Considerations

- Tags are fetched only when needed
- State updates use React's batch update mechanism
- Reordering uses optimistic updates
- Components use memoization to prevent unnecessary re-renders

## Security Considerations

- All database operations go through Supabase RLS policies
- User permissions are checked before write operations
- Content access is restricted based on user roles

## Future Development

Planned enhancements to the tag system:

1. **Tag Relationships**: Allow tags to have relationships with each other
2. **Tag Analytics**: Track tag usage and popularity
3. **Enhanced Tag Types**: Add more properties to tag types (icons, hierarchies)
4. **Advanced Filtering**: Improve tag filtering capabilities
5. **Performance Optimizations**: Virtual scrolling for large tag lists

## Testing Strategy

The tag system is tested at multiple levels:

1. **Unit Tests**: Individual hooks and utilities
2. **Component Tests**: UI components with mock data
3. **Integration Tests**: Combined components and hooks
4. **E2E Tests**: Complete user flows

## Migration Path

When making changes to the tag system:

1. Update the database schema if needed
2. Ensure backward compatibility in types
3. Add deprecation notices for changed APIs
4. Update documentation
5. Run the full test suite
