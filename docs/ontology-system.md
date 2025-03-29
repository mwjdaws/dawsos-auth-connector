
# Ontology System Documentation

This document provides an overview of the ontology system implemented in DawsOS, including database structure, available functions, and usage patterns.

## Database Structure

The ontology system is built around three primary tables and their relationships:

### 1. `ontology_terms`

Stores individual ontology terms that represent concepts or entities within the knowledge base.

**Schema:**
```sql
CREATE TABLE public.ontology_terms (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  term TEXT NOT NULL,
  description TEXT,
  domain TEXT
);
```

**Key Fields:**
- `id` (UUID, PK): Unique identifier for the term
- `term` (text): The name of the ontology term
- `description` (text, nullable): Optional description of what the term represents
- `domain` (text, nullable): Optional categorization of the term into a domain/field

### 2. `knowledge_source_ontology_terms`

Junction table that associates ontology terms with knowledge sources.

**Schema:**
```sql
CREATE TABLE public.knowledge_source_ontology_terms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  knowledge_source_id UUID NOT NULL REFERENCES knowledge_sources(id),
  ontology_term_id UUID NOT NULL REFERENCES ontology_terms(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);
```

**Key Fields:**
- `id` (UUID, PK): Unique identifier for the association
- `knowledge_source_id` (UUID, FK): Reference to the knowledge source
- `ontology_term_id` (UUID, FK): Reference to the ontology term
- `created_at` (timestamp): When the association was created
- `created_by` (UUID, FK): User who created the association

### 3. `ontology_relationships`

Defines semantic relationships between ontology terms.

**Schema:**
```sql
CREATE TABLE public.ontology_relationships (
  id UUID NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  term_id UUID REFERENCES ontology_terms(id),
  related_term_id UUID REFERENCES ontology_terms(id),
  relation_type TEXT NOT NULL
);
```

**Key Fields:**
- `id` (UUID, PK): Unique identifier for the relationship
- `term_id` (UUID, FK): Reference to the source term
- `related_term_id` (UUID, FK): Reference to the target term
- `relation_type` (text): Type of relationship between terms (e.g., "is_a", "part_of", "related_to")

## Database Functions

### `get_related_ontology_terms`

Returns ontology terms related to terms attached to a given knowledge source.

**Definition:**
```sql
CREATE OR REPLACE FUNCTION public.get_related_ontology_terms(knowledge_source_id uuid)
RETURNS TABLE(term_id uuid, term text, description text, domain text, relation_type text)
LANGUAGE sql
AS $$
  -- Get related terms through ontology_relationships
  SELECT 
    ot.id as term_id, 
    ot.term, 
    ot.description, 
    ot.domain, 
    rel.relation_type
  FROM knowledge_source_ontology_terms ksot
  JOIN ontology_relationships rel ON ksot.ontology_term_id = rel.term_id
  JOIN ontology_terms ot ON rel.related_term_id = ot.id
  WHERE ksot.knowledge_source_id = knowledge_source_id
  
  UNION
  
  -- Also include terms that are related to the source terms (reverse direction)
  SELECT 
    ot.id as term_id, 
    ot.term, 
    ot.description, 
    ot.domain, 
    rel.relation_type
  FROM knowledge_source_ontology_terms ksot
  JOIN ontology_relationships rel ON ksot.ontology_term_id = rel.related_term_id
  JOIN ontology_terms ot ON rel.term_id = ot.id
  WHERE ksot.knowledge_source_id = knowledge_source_id;
$$
```

**Usage:**
```sql
SELECT * FROM get_related_ontology_terms('12345678-1234-1234-1234-123456789012');
```

**Returns:**
A table of related ontology terms with their details and the type of relationship they have to the terms associated with the specified knowledge source.

## TypeScript Interface

The ontology system is accessed in the frontend code through several TypeScript interfaces and hooks:

### Core Types

```typescript
// Ontology Term object
export interface OntologyTerm {
  id: string;
  term: string;
  description?: string;
  domain?: string;
  associationId?: string; // ID of the association record (for removal)
}

// Related Term object (returned by get_related_ontology_terms)
export interface RelatedTerm {
  term_id: string;
  term: string;
  description: string;
  domain: string;
  relation_type: string;
}
```

## React Hooks

### `useSourceTerms`
Fetches ontology terms directly associated with a knowledge source.

**Usage:**
```typescript
const { data, isLoading, error } = useSourceTerms(sourceId);
```

### `useRelatedTerms`
Fetches ontology terms that are related to the terms associated with a knowledge source.

**Usage:**
```typescript
const { data, isLoading, error } = useRelatedTerms(sourceId);
```

### `useAllTermsAndDomains`
Fetches all available ontology terms and domains with support for filtering.

**Usage:**
```typescript
const { 
  terms,
  domains,
  searchTerm,
  setSearchTerm,
  selectedDomain,
  setSelectedDomain,
  isLoadingTerms,
  isLoadingDomains
} = useAllTermsAndDomains();
```

### `useTermMutations`
Provides functions to add or remove ontology terms from a knowledge source.

**Usage:**
```typescript
const {
  addTerm,
  removeTerm,
  addTermByName,
  isAdding,
  isRemoving
} = useTermMutations(sourceId);
```

### `useOntologyTerms`
Combines all of the above hooks into a single interface.

**Usage:**
```typescript
const {
  sourceTerms,
  relatedTerms,
  allTerms,
  domains,
  isLoading,
  isAdding,
  isRemoving,
  searchTerm,
  setSearchTerm,
  selectedDomain,
  setSelectedDomain,
  addTerm,
  removeTerm,
  addTermByName
} = useOntologyTerms(sourceId);
```

## Components

### `OntologyTermsPanel`

Main component for managing ontology terms for a knowledge source.

**Props:**
- `sourceId?: string`: ID of the knowledge source
- `editable?: boolean`: Whether the panel allows editing terms

**Features:**
- Displays terms attached to the knowledge source
- Shows related terms
- Allows browsing and adding available terms
- Supports creating new terms

### `RelationshipGraph`

Visualizes the relationships between knowledge sources and ontology terms.

**Props:**
- `width?: number`: Width of the graph
- `height?: number`: Height of the graph
- `sourceId?: string`: Optional starting point for the graph

## Usage Examples

### Viewing and Managing Terms

```tsx
// In a knowledge source editor
<OntologyTermsPanel sourceId={knowledgeSourceId} editable={true} />

// In a read-only view
<OntologyTermsPanel sourceId={knowledgeSourceId} editable={false} />
```

### Displaying the Relationship Graph

```tsx
// In a dashboard tab
<RelationshipGraphTab contentId={selectedContentId} />

// Standalone graph
<RelationshipGraphPanel sourceId={startingSourceId} />
```

### Programmatically Working with Terms

```typescript
// Using the hook in a custom component
const {
  sourceTerms,
  addTerm,
  removeTerm
} = useOntologyTerms(sourceId);

// Display terms
{sourceTerms.map(term => (
  <div key={term.id}>
    {term.term}
    <button onClick={() => removeTerm(term.associationId!)}>Remove</button>
  </div>
))}

// Add a term
<button onClick={() => addTerm(termId)}>Add Term</button>

// Add a new term by name
<button onClick={() => addTermByName('New Term', 'Domain')}>Create Term</button>
```

## Best Practices

1. **Domain Organization**: Organize terms into domains for better categorization and filtering.
2. **Relationship Modeling**: Use specific relation types to accurately model the semantic relationships between terms.
3. **Term Reuse**: Reuse existing terms when possible to maintain consistency and improve interconnections.
4. **Term Naming**: Use consistent naming conventions for terms within the same domain.
5. **Performance Consideration**: When displaying large ontology graphs, consider limiting the depth or number of relationships to maintain performance.
