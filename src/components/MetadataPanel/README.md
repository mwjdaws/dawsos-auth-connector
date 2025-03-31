
# MetadataPanel Component

This is the unified MetadataPanel component for displaying and editing content metadata across the application. It provides a modular, type-safe approach to displaying metadata with consistent styling and behavior.

## Usage

```tsx
import MetadataPanel from "@/components/MetadataPanel";

<MetadataPanel 
  contentId="content-123" 
  onMetadataChange={() => {}} 
  isCollapsible={true}
  showOntologyTerms={true}
  editable={true}
/>
```

## Features

- Display and edit content metadata (tags, external sources, ontology terms)
- Collapsible panel with refresh functionality
- Tag drag-and-drop reordering with database persistence
- Loading and error states
- Modular section components that can be used independently
- Type safety with comprehensive TypeScript interfaces
- Shared state management via `useMetadataContext` hook

## Available Sections

The MetadataPanel is composed of modular sections that can be imported separately if needed:

- `HeaderSection`: Panel title and controls
- `ExternalSourceSection`: External source URL and last checked date
- `TagsSection`: Content tags with add/delete/reorder functionality
- `OntologyTermsSection`: Ontology terms associated with the content
- `DomainSection`: Content domain information
- `ContentIdSection`: Display content ID
- `LoadingState`: Loading skeleton UI

## Tag System

The MetadataPanel includes a complete tag management system with:

- Tag creation with optional type assignment
- Tag deletion with confirmation
- Tag reordering via drag-and-drop
- Tag filtering and grouping by type
- Database syncing for all operations

### Using Tag Reordering

Tag reordering is implemented using the `DraggableTagList` component:

```tsx
<DraggableTagList
  tags={tags}
  onReorder={handleReorderTags}
  editable={editable}
  onDelete={handleDeleteTag}
/>
```

This component uses `@dnd-kit` for drag-and-drop functionality and automatically updates the `display_order` field in the database when tags are reordered.

### Tag Hooks

The following hooks are available for working with tags:

- `useTagOperations`: Main hook for all tag operations
- `useTagState`: Manages tag state (loading, error, etc.)
- `useTagFetch`: Fetches tags from the database
- `useTagMutations`: Performs tag CRUD operations
- `useTagReordering`: Handles tag reordering logic

## Accessing Metadata State

To access metadata state outside the MetadataPanel component, use the `useMetadataContext` hook:

```tsx
import { useMetadataContext } from "@/components/MetadataPanel";

function MyComponent({ contentId }) {
  const metadata = useMetadataContext(contentId);
  
  // Access metadata state
  console.log(metadata.tags);
  
  // Perform operations
  metadata.handleAddTag("new-tag");
  metadata.handleDeleteTag(tagId);
  metadata.handleReorderTags(updatedTags);
  
  // Refresh metadata
  metadata.handleRefresh();
}
```

## Error Handling

The MetadataPanel uses centralized error handling through the `handleError` utility:

```tsx
try {
  // Perform operation
} catch (err) {
  handleError(
    err,
    "User-friendly error message",
    { level: "warning", technical: false }
  );
}
```

## Performance Considerations

- Tags are fetched only when needed and cached in state
- Reordering operations use optimistic UI updates for responsiveness
- Loading states are displayed during asynchronous operations
- Components are memoized to prevent unnecessary re-renders
