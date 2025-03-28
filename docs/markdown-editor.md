
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
- **External Source Links**: Link documents to external source references

## Component Architecture

The Markdown Editor follows a modular component architecture:

### Core Components

1. **MarkdownEditor**: The main container component that orchestrates all functionality
2. **EditorHeader**: Contains title input, template selection, and external source URL input
3. **EditorToolbar**: Contains UI controls for fullscreen and version history

### Editor Layouts

1. **SplitEditor**: Side-by-side editing and preview for regular mode
2. **FullscreenEditor**: Tabbed interface for editing in fullscreen mode

### Content Components

1. **MarkdownContent**: The editable markdown input area
2. **MarkdownPreview**: Renders the markdown as formatted HTML

### Action Components

1. **EditorActions**: Buttons for saving drafts and publishing
2. **VersionHistoryModal**: UI for browsing and restoring versions
3. **TemplateSelector**: Dropdown for selecting and applying templates

For detailed information about the hook architecture and state management, please see [hook-documentation.md](./hook-documentation.md).

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

### External Sources

The editor supports linking documents to external references through the external source URL field:

```typescript
<Input
  id="externalSource"
  value={externalSourceUrl}
  onChange={(e) => setExternalSourceUrl(e.target.value)}
  placeholder="https://example.com/reference-document"
  className="w-full"
  type="url"
/>
```

When viewing content, external source links are displayed prominently with clickable links to allow users to reference the original source material.

## Usage

### Basic Usage

```typescript
<MarkdownEditor
  initialTitle="My Document"
  initialContent="# Hello World"
  initialTemplateId={null}
  initialExternalSourceUrl="https://example.com/reference"
  onSaveDraft={(id, title, content, templateId, externalSourceUrl) => {
    // Handle draft saving
  }}
  onPublish={(id, title, content, templateId, externalSourceUrl) => {
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

The editor supports two primary UI modes controlled by the `isFullscreen` state:

- **Split Editor Mode (Default)**: Side-by-side editing and preview
- **Fullscreen Mode**: Tabbed interface that switches between edit and preview

## Implementation Notes

### Autosave

The editor automatically saves drafts when content changes using the `useAutosave` hook:

```typescript
useAutosave(
  isDirty && !isTemp, 
  30000, // 30 seconds interval
  () => handleSaveDraft(false, true) // isManualSave=false, isAutoSave=true
);
```

### Loading States

The editor shows appropriate loading states when fetching content or templates:

```typescript
if (isLoading) {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-10 w-full" />
      {/* Additional loading UI */}
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
- External content change detection
