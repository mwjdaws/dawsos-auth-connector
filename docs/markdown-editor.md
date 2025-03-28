
# Markdown Editor Documentation

## Overview

The Markdown Editor is a core component of DawsOS that provides a rich editing experience for creating and modifying knowledge sources. It features a side-by-side editing and preview layout, template application, version history, and autosave functionality.

## Key Features

- **Real-time Markdown Preview**: As users type in the editor, they see a live preview of the rendered markdown
- **Template Integration**: Apply knowledge templates to quickly create structured documents
- **Version History**: Track changes and restore previous versions
- **Autosave**: Automatically saves drafts periodically to prevent data loss
- **Fullscreen Mode**: Toggle between standard and fullscreen editing
- **Split Editor**: Side-by-side editing and preview in standard mode
- **Tabbed Interface**: Switch between edit and preview tabs in fullscreen mode

## Component Architecture

The Markdown Editor follows a modular component architecture:

1. **MarkdownEditor**: The main container component that orchestrates all functionality
2. **EditorHeader**: Contains title input and template selection
3. **EditorToolbar**: Contains UI controls for fullscreen and version history
4. **SplitEditor**: Side-by-side editing and preview for regular mode
5. **FullscreenEditor**: Tabbed interface for editing in fullscreen mode
6. **MarkdownContent**: The editable markdown input area
7. **MarkdownPreview**: Renders the markdown as formatted HTML
8. **EditorActions**: Buttons for saving drafts and publishing
9. **VersionHistoryModal**: UI for browsing and restoring versions

## Hook Architecture

The editor uses a composable hook system for state management and operations:

1. **useMarkdownEditor**: The main orchestration hook that combines all other hooks
2. **useContentState**: Manages the document content state (title, content, etc.)
3. **useContentLoader**: Handles loading existing content from the database
4. **useDocumentOperations**: Coordinates save and publish operations
5. **useDraftOperations**: Handles saving drafts to the database
6. **usePublishOperations**: Manages document publishing
7. **useTemplateHandling**: Controls template selection and application
8. **useDocumentVersioning**: Manages version creation and restoration
9. **useAutosave**: Provides automatic periodic saving
10. **useDocumentOperationHandlers**: Wraps operations with UI feedback

## Integration Points

### Templates

The editor connects to the template system via the `useTemplates` hook:

```typescript
const { templates, isLoading: isLoadingTemplates } = useTemplates();
```

Templates can be applied to pre-populate the editor with structured content, making it easier to create consistently formatted documents.

### Versioning

Version history is accessed through the History button and handled by the `VersionHistoryModal`:

```typescript
<VersionHistoryModal
  documentId={effectiveDocumentId}
  isOpen={isHistoryOpen}
  onClose={() => setIsHistoryOpen(false)}
  onVersionRestore={handleVersionRestore}
/>
```

This allows users to view previous versions of a document and restore them if needed.

### State Management

The editor's state is managed through the modular hook system, with `useMarkdownEditor` as the orchestration point:

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

## Usage

### Basic Usage

```typescript
<MarkdownEditor
  initialTitle="My Document"
  initialContent="# Hello World"
  initialTemplateId={null}
  onSaveDraft={(id, title, content, templateId) => {
    // Handle draft saving
  }}
  onPublish={(id, title, content, templateId) => {
    // Handle publishing
  }}
/>
```

### Loading Existing Content

To load and edit existing content, provide the `sourceId`:

```typescript
<MarkdownEditor
  sourceId="existing-document-id"
  onSaveDraft={handleSaveDraft}
  onPublish={handlePublish}
/>
```

### UI Modes

The editor supports two primary UI modes:

#### Split Editor Mode (Default)
Side-by-side editing and preview for regular usage.

```typescript
<SplitEditor 
  content={content} 
  setContent={setContent} 
/>
```

#### Fullscreen Mode
Tabbed interface that switches between edit and preview.

```typescript
<FullscreenEditor
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  content={content}
  setContent={setContent}
/>
```

## Editor States

The editor manages several states to provide feedback to the user:

- **isDirty**: Document has unsaved changes
- **isLoading**: Content is being loaded from the database
- **isSaving**: Draft is currently being saved
- **isPublishing**: Document is being published
- **isLoadingTemplate**: A template is being applied
- **isPublished**: Document has been published

```typescript
// In render:
<EditorActions 
  onSaveDraft={handleSaveDraft}
  onPublish={handlePublish}
  isSaving={isSaving}
  isPublishing={isPublishing}
  isLoadingTemplate={isLoadingTemplate}
  isDirty={isDirty}
  isPublished={isPublished}
/>
```

## Implementation Notes

### Autosave

The editor automatically saves drafts when content changes:

```typescript
useAutosave({
  isDirty,
  isSaving,
  isPublishing,
  documentId: documentId || sourceId,
  onSave: () => handleSaveDraft(true)
});
```

### Version Creation

The system automatically creates versions when saving:

```typescript
// Before updating the document, create a version of the current content
await createVersion(documentId, isAutoSave);
```

### Loading States

The editor shows appropriate loading states when fetching content or templates:

```typescript
if (isLoading) {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-10 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[500px] w-full" />
        <Skeleton className="h-[500px] w-full" />
      </div>
      <Skeleton className="h-10 w-48 ml-auto" />
    </div>
  );
}
```

## Future Enhancements

Planned improvements to the Markdown Editor include:

- Collaborative editing with real-time presence
- Rich text toolbar for common markdown formatting
- Image and file uploads
- Table editor
- Spell checking and grammar suggestions
