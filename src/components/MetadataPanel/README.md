
# MetadataPanel Component System

## Overview

The MetadataPanel is a unified component for displaying and editing content metadata throughout the application. It offers a modular approach through composable section components.

## Components

### Main Component

- `MetadataPanel`: The primary container component that orchestrates all section components

### Section Components

- `HeaderSection`: Panel title and controls including collapse/expand functionality
- `ExternalSourceSection`: External source URL and last checked date
- `TagsSection`: Content tags with add/delete capability
- `OntologyTermsSection`: Ontology terms associated with the content
- `DomainSection`: Content domain information
- `ContentIdSection`: Display content ID
- `LoadingState`: Loading skeleton UI

## Hooks

- `useMetadataPanel`: Core hook used by the MetadataPanel component
- `useMetadataContext`: Exposes metadata state for other components to consume
- `useTagOperations`: Operations for managing tags
- `useSourceMetadata`: Operations for managing source metadata
- `usePanelState`: Manages panel UI state

## Usage

Basic usage:

```tsx
import MetadataPanel from "@/components/MetadataPanel";

function MyComponent() {
  return (
    <MetadataPanel 
      contentId="content-123"
      onMetadataChange={() => console.log("Metadata changed")}
      isCollapsible={true}
      showOntologyTerms={true}
      editable={true}
    />
  );
}
```

Advanced usage with context hook:

```tsx
import { useMetadataContext } from "@/components/MetadataPanel";

function MetadataConsumer({ contentId }) {
  const metadata = useMetadataContext(contentId);
  
  return (
    <div>
      <h3>Tags: {metadata.tags.length}</h3>
      <button onClick={metadata.handleAddTag}>Add Tag</button>
      {metadata.isLoading && <p>Loading...</p>}
    </div>
  );
}
```

## Testing

To test the MetadataPanel components:

1. Unit test each section component independently
2. Test the main MetadataPanel with various prop combinations
3. Test the metadata hooks with mock data

## Migration Note

This is the unified implementation. Legacy imports from `src/components/MarkdownViewer/MetadataPanel` are deprecated and will be removed in a future version.
