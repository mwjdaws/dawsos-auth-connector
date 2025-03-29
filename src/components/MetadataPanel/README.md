
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
- Loading and error states
- Modular section components that can be used independently
- Type safety with comprehensive TypeScript interfaces
- Shared state management via `useMetadataContext` hook

## Available Sections

The MetadataPanel is composed of modular sections that can be imported separately if needed:

- `HeaderSection`: Panel title and controls
- `ExternalSourceSection`: External source URL and last checked date
- `TagsSection`: Content tags with add/delete functionality
- `OntologyTermsSection`: Ontology terms associated with the content
- `DomainSection`: Content domain information
- `ContentIdSection`: Display content ID
- `LoadingState`: Loading skeleton UI

## Accessing Metadata State

To access metadata state outside the MetadataPanel component, use the `useMetadataContext` hook:

```tsx
import { useMetadataContext } from "@/components/MetadataPanel";

function MyComponent({ contentId }) {
  const metadata = useMetadataContext(contentId);
  
  // Access metadata state
  console.log(metadata.tags);
  
  // Perform operations
  metadata.handleAddTag();
  metadata.handleDeleteTag(tagId);
  
  // Refresh metadata
  metadata.refreshMetadata();
}
```
