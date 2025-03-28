
# Document Versioning System

## Overview

The document versioning system in DawsOS allows for tracking changes to knowledge sources over time. This feature enables users to:

- View previous versions of documents
- Compare changes between versions
- Restore documents to earlier states
- Automatically save document versions during editing

## Architecture

The versioning system consists of several interconnected components:

1. **Database Storage** - Versions are stored in the `knowledge_source_versions` table
2. **Versioning Hook** - `useDocumentVersioning` provides core versioning functionality
3. **Version History UI** - Modal interface for browsing and restoring versions
4. **Autosave Integration** - Automatic version creation during document editing

### Database Schema

Versions are stored with the following structure:

```sql
CREATE TABLE knowledge_source_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_knowledge_source_versions_source_id ON knowledge_source_versions(source_id);
CREATE INDEX idx_knowledge_source_versions_created_at ON knowledge_source_versions(created_at);
```

## Core Components

### 1. useDocumentVersioning Hook

This hook provides three primary functions:

- `createVersion`: Creates a new version of a document
- `loadVersion`: Loads a specific version's content
- `restoreVersion`: Restores a document to a previous version (with automatic backup)

```typescript
const { createVersion, loadVersion, restoreVersion } = useDocumentVersioning();
```

#### Version Metadata

The versioning system supports rich metadata for each version:

```typescript
const metadata = {
  saved_from: "auto_save" | "manual_save",
  saved_by: userId,
  restore_operation: string, // For tracking restore operations
  custom_field: "any additional data"
};

await createVersion(documentId, isAutoSave, metadata);
```

### 2. VersionHistoryModal Component

The modal UI allows users to browse and interact with version history:

```typescript
<VersionHistoryModal
  documentId={documentId}
  isOpen={isHistoryOpen}
  onClose={() => setIsHistoryOpen(false)}
  onVersionRestore={handleVersionRestore}
/>
```

### 3. Version Restoration

When restoring a version:

1. The current state is automatically backed up first
2. The selected version's content replaces the current document
3. The UI is updated to reflect the restored content

## Integration with Editor

The Markdown Editor includes a History button that opens the version history modal:

```typescript
{effectiveDocumentId && (
  <Button
    variant="outline"
    size="sm"
    className="flex items-center gap-1"
    onClick={() => setIsHistoryOpen(true)}
    title="View version history"
  >
    <History size={16} />
    <span className="hidden sm:inline">History</span>
  </Button>
)}
```

## Implementation Notes

### Automatic Backups

Before restoring a version, the system automatically creates a backup of the current state:

```typescript
// Create a backup of the current state
const backupCreated = await createVersion(versionData.source_id, false, {
  restore_operation: `backup_before_restoring_${versionId}`
});
```

### Error Handling

The versioning system includes comprehensive error handling with user feedback:

```typescript
try {
  // Version operations
} catch (error) {
  console.error('Error in version operation:', error);
  toast({
    title: "Error",
    description: "Failed to complete the requested operation",
    variant: "destructive"
  });
}
```

## Future Enhancements

Planned improvements to the versioning system include:

- Visual diff comparison between versions
- Version tagging and annotation
- Branching of document versions
- Conflict resolution for simultaneous edits
