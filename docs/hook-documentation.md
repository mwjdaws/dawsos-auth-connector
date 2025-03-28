
# Markdown Editor Hook Documentation

## Overview

The Markdown Editor uses a composable hook architecture for state management and operations. These hooks provide a clean separation of concerns and make the editor functionality more maintainable and testable.

## Hook Architecture

### Core Orchestration Hook

**useMarkdownEditor**: The main orchestration hook that combines all other hooks to provide a unified API for the editor component.

```typescript
const {
  title,
  setTitle,
  content,
  setContent,
  templateId,
  isLoadingTemplate,
  isSaving,
  isPublishing,
  isDirty,
  isPublished,
  isLoading,
  handleSaveDraft,
  handlePublish,
  handleTemplateChange
} = useMarkdownEditor({
  initialTitle,
  initialContent,
  initialTemplateId,
  documentId,
  sourceId,
  onSaveDraft,
  onPublish
});
```

### State Management Hooks

1. **useContentState**: Manages the document content state and tracks changes.
   - Handles title, content, templateId state
   - Tracks dirty state for unsaved changes
   - Maintains published status

2. **useContentLoader**: Handles loading existing content from the database.
   - Fetches document content when sourceId is provided
   - Updates state with loaded content
   - Manages loading states

### Document Operation Hooks

1. **useDocumentOperations**: Coordinates save and publish operations.
   - Provides methods for saving drafts and publishing documents
   - Tracks operation states (isSaving, isPublishing)
   - Integrates with versioning system

2. **useDraftOperations**: Handles saving drafts to the database.
   - Performs database operations for draft saving
   - Handles error cases and validation
   - Creates versions when saving

3. **usePublishOperations**: Manages document publishing.
   - Publishes documents and updates their status
   - Triggers post-publish processes like AI enrichment
   - Handles publish-specific error cases

4. **useDocumentOperationHandlers**: Wraps operations with UI feedback.
   - Provides handler methods that include toast notifications
   - Coordinates between operations
   - Updates state after operations complete

### Feature-Specific Hooks

1. **useTemplateHandling**: Controls template selection and application.
   - Fetches template content
   - Applies templates to the current document
   - Manages template loading states

2. **useDocumentVersioning**: Manages version creation and restoration.
   - Creates document versions before changes
   - Loads specific versions
   - Restores content from previous versions

3. **useAutosave**: Provides automatic periodic saving.
   - Periodically saves drafts when changes are detected
   - Prevents saving during other operations
   - Cleans up timers when component unmounts

## State Management

The hook system tracks several states to provide feedback to the user:

- **isDirty**: Document has unsaved changes
- **isLoading**: Content is being loaded from the database
- **isSaving**: Draft is currently being saved
- **isPublishing**: Document is being published
- **isLoadingTemplate**: A template is being applied
- **isPublished**: Document has been published

## Data Flow

1. **Content Loading**: When a sourceId is provided, useContentLoader fetches the existing document.
2. **State Tracking**: useContentState maintains the current state and tracks changes.
3. **User Actions**: When the user performs actions, handler methods from useDocumentOperationHandlers are called.
4. **Operations**: Operations are performed via useDocumentOperations, which delegates to useDraftOperations or usePublishOperations.
5. **Version Creation**: Before updating documents, useDocumentVersioning creates versions of the current state.
6. **Autosave**: useAutosave periodically triggers save operations when changes are detected.

## Implementation Details

### Error Handling

Hooks implement error handling with toast notifications for user feedback:

```typescript
try {
  // Operation code
} catch (error) {
  console.error('Error operation:', error);
  toast({
    title: "Error Title",
    description: "User-friendly error message",
    variant: "destructive",
  });
}
```

### Version Creation

The system automatically creates versions before document updates:

```typescript
// Before updating the document, create a version of the current content
await createVersion(documentId, isAutoSave);
```

### Publish Process

Publishing involves multiple steps:

1. Save the current content as a draft
2. Update the published status
3. Create enriched metadata for the published version
4. Trigger AI content enrichment if available

### Autosave Implementation

Autosave uses an interval to periodically check for and save changes:

```typescript
useEffect(() => {
  const autoSaveInterval = setInterval(() => {
    if (isDirty && !isSaving && !isPublishing && documentId && isMounted.current) {
      console.log('Auto-saving document...');
      onSave();
    }
  }, 15000); // 15 seconds

  return () => {
    isMounted.current = false;
    clearInterval(autoSaveInterval);
  };
}, [isDirty, isSaving, isPublishing, documentId, onSave]);
```
