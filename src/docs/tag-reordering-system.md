# Tag Reordering System

This document describes the tag reordering system implemented in our application. The system allows users to manually reorder tags using drag-and-drop functionality, with the order persisted to the database.

## Overview

The tag reordering system consists of:

1. **Database Schema**: A `display_order` column in the `tags` table
2. **Data Types**: Unified `Tag` interface and related types
3. **UI Components**: Draggable tag list with drag-and-drop functionality
4. **API Operations**: Backend operations to update tag order

## Database Schema

Tags are stored in the `tags` table with a `display_order` column:

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  content_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  type_id UUID REFERENCES tag_types(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  
  CONSTRAINT unique_tag_content UNIQUE (name, content_id)
);
```

## Data Types

We use the following type definitions:

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

Used for reordering operations:

```typescript
interface TagPosition {
  id: string;
  position: number;
}
```

## Component Architecture

### DraggableTagList Component

This component renders a list of tags that can be reordered using drag and drop. It uses the `@dnd-kit` library for drag-and-drop functionality.

```tsx
<DraggableTagList
  tags={tags}
  onReorder={handleReorderTags}
  editable={editable}
  onDelete={handleDeleteTag}
/>
```

### useTagOperations Hook

The main hook that combines tag state, fetching, and mutations:

```tsx
const { 
  tags,
  handleAddTag,
  handleDeleteTag,
  handleReorderTags,
  // ...other properties and methods
} = useTagOperations(contentId);
```

### useTagMutations Hook

Handles database operations for tags, including reordering:

```typescript
const { 
  reorderTags,
  isReordering
  // ...other mutations
} = useTagMutations({ contentId, setTags, tags });
```

## Drag-and-Drop Workflow

1. User drags a tag to a new position
2. `onDragEnd` callback is triggered in the `DraggableTagList` component
3. New tag order is calculated using the `arrayMove` utility
4. `handleReorderTags` is called with the updated tag array
5. Tag positions are extracted and sent to the backend via `reorderTags` function
6. Backend updates the `display_order` column for each tag

## API Operations

The reordering operation is performed using a batch update:

```typescript
const { data, error } = await supabase
  .from('tags')
  .upsert(
    positions.map((pos) => ({
      id: pos.id,
      display_order: pos.position
    })),
    { onConflict: 'id' }
  );
```

## Best Practices for Tag Reordering

1. Always update the entire sequence of tags at once to maintain consistency
2. Use optimistic UI updates to make the interface feel responsive
3. Handle errors gracefully with proper error messages and rollback mechanisms
4. Use sequential integers for `display_order` to make sorting predictable
5. Re-sequence the `display_order` values periodically to avoid sparse ranges

## Future Improvements

Potential enhancements to the tag reordering system:

1. Add animations for smoother visual feedback during drag operations
2. Implement keyboard accessibility for reordering
3. Add batch reordering based on alphabetical or custom criteria
4. Implement drag limits based on tag groups or categories
5. Add multi-select capabilities for reordering multiple tags at once
