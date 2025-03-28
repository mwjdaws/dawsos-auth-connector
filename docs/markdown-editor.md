
# Markdown Editor Documentation

## Overview

The Markdown Editor is a core component of DawsOS that provides a rich editing experience for creating and modifying knowledge sources. It features a side-by-side editing and preview layout, template application, version history, and autosave functionality.

## Key Features

- **Real-time Markdown Preview**: As users type in the editor, they see a live preview of the rendered markdown
- **Template Integration**: Apply knowledge templates to quickly create structured documents
- **Version History**: Track changes and restore previous versions
- **Autosave**: Automatically saves drafts periodically to prevent data loss
- **Fullscreen Mode**: Toggle between standard and fullscreen editing

## Component Architecture

The Markdown Editor is composed of several modular components:

1. **MarkdownEditor**: The main container component
2. **EditorHeader**: Contains title input and template selection
3. **MarkdownContent**: The editable markdown input area
4. **MarkdownPreview**: Renders the markdown as formatted HTML
5. **EditorActions**: Buttons for saving drafts and publishing
6. **VersionHistoryModal**: UI for browsing and restoring versions

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

The editor's state is managed through the `useMarkdownEditor` hook, which provides:

- Content state (title, content, templateId)
- Loading and saving states
- Functions for saving drafts and publishing
- Template handling logic

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

### Fullscreen Mode

The editor supports toggling between regular and fullscreen modes:

```typescript
const [isFullscreen, setIsFullscreen] = useState(false);

const toggleFullscreen = () => {
  setIsFullscreen(!isFullscreen);
};

// In render:
<Button onClick={toggleFullscreen}>
  {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
</Button>
```

## Hooks

### useMarkdownEditor

This is the primary hook that powers the editor functionality:

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

### useDocumentVersioning

Handles version creation, loading, and restoration:

```typescript
const {
  createVersion,
  loadVersion,
  restoreVersion
} = useDocumentVersioning();
```

## Styling

The Markdown Editor uses a combination of Tailwind CSS classes and Shadcn UI components for a clean, responsive interface:

- Grid layout for side-by-side editing and preview
- Responsive design that adapts to different screen sizes
- Tabs for switching between edit and preview modes in fullscreen

## Implementation Notes

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

### Dirty State Tracking

The editor tracks whether the content has been modified since the last save:

```typescript
// Track changes to mark document as dirty when content changes
useEffect(() => {
  if (title !== lastSavedTitle || content !== lastSavedContent) {
    setIsDirty(true);
  } else {
    setIsDirty(false);
  }
}, [title, content, lastSavedTitle, lastSavedContent]);
```

## Future Enhancements

Planned improvements to the Markdown Editor include:

- Collaborative editing with real-time presence
- Rich text toolbar for common markdown formatting
- Image and file uploads
- Table editor
- Spell checking and grammar suggestions
