
# DawsOS Application Architecture

## Overview

DawsOS is an AI-augmented knowledge management system designed to facilitate the creation, organization, and retrieval of knowledge sources. The application follows a modern web architecture with React on the frontend and Supabase for backend services.

## System Architecture

### Frontend Architecture

The application uses a component-based architecture built with:

- **React**: UI library for building the component hierarchy
- **TypeScript**: For type safety and improved developer experience
- **TailwindCSS**: For utility-based styling
- **Shadcn UI**: For pre-styled component library
- **React Router**: For client-side routing
- **TanStack Query**: For remote state management and data fetching

#### Core Frontend Components

1. **Pages**: Top-level components that represent routes
   - Dashboard
   - Auth
   - Markdown Viewer
   - Create Knowledge

2. **Layouts**: Structural components for consistent UI
   - DashboardContainer
   - AuthLayout

3. **Feature Components**: Business logic components
   - MarkdownEditor
   - RelationshipGraph
   - TagGenerator
   - MetadataPanel

4. **UI Components**: Reusable presentation components
   - Button
   - Card
   - Dialog

### State Management

The application uses a hybrid approach to state management:

1. **Local Component State**: Using React's `useState` and `useReducer` hooks
2. **Remote/Server State**: Using TanStack Query for data fetching, caching, and state management
3. **Context API**: For auth state and other cross-cutting concerns
4. **Specialized Hooks**: Custom hooks that encapsulate business logic and state

### Backend Architecture (Supabase)

Supabase provides the serverless backend infrastructure:

1. **Database**: PostgreSQL for structured data storage
2. **Authentication**: User management and access control
3. **Edge Functions**: Serverless functions for custom logic
4. **Storage**: File storage capabilities (if needed)
5. **Realtime**: For live updates and subscriptions

#### Database Schema

Key tables in the system include:

- `knowledge_sources`: Core documents in the system
- `tags`: Keywords associated with knowledge sources
- `ontology_terms`: Structured vocabulary terms
- `knowledge_templates`: Templates for structured content
- `knowledge_source_versions`: Version history for knowledge sources
- `note_links`: Connections between knowledge sources

#### Edge Functions

Edge functions handle operations requiring AI processing or complex business logic:

- `generate-tags`: Automatically generates tags for content
- `check-external-source`: Validates external references
- `batch-ontology-enrichment`: Processes content for ontology terms
- `suggest-ontology-terms`: AI-powered term suggestions

### Authentication & Authorization

The system uses Supabase Auth with:

1. **Email/Password Authentication**: For basic login
2. **Row-Level Security (RLS)**: For fine-grained access control
3. **User Roles**: Basic role-based access

### API Layer

The API layer consists of:

1. **Service Functions**: Abstractions over Supabase queries
   - Located in `src/services/api/`
   - Organized by entity (e.g., knowledgeSources.ts, templates.ts)

2. **Custom Hooks**: React hooks that wrap service functions
   - Located in `src/hooks/`
   - Provide loading, error, and data states

## Module Architecture

### Dashboard Module

The dashboard serves as the main interface for content management:

- **Entry Point**: `src/pages/Dashboard/index.tsx`
- **Components**:
  - `DashboardHeader`: System status and actions
  - `DashboardTabs`: Tab navigation between features
  - `ContentManagement`: Core content editing
  - `TagGeneratorTab`: Automated tag creation

### Markdown Viewer/Editor Module

For creating and viewing knowledge sources:

- **Components**:
  - `MarkdownEditor`: Full-featured content editor
  - `MarkdownViewer`: Content display with rendered markdown
  - `TemplateSelector`: Template application

- **Hooks**:
  - `useMarkdownEditor`: Orchestrates editor functionality
  - `useContentState`: Manages document content
  - `useTemplateHandling`: Template application logic

### Relationship Graph Module

Visualizes connections between knowledge sources:

- **Entry Point**: `src/components/MarkdownViewer/RelationshipGraph/RelationshipGraph.tsx`
- **Components**:
  - `GraphRenderer`: Core D3/ForceGraph rendering
  - `GraphControls`: User interaction controls
  - `GraphHeader`: Graph meta information

- **Hooks**:
  - `useRelationshipGraph`: Main orchestration hook
  - `useGraphData`: Data fetching and processing
  - `useGraphState`: State management

### Metadata Module

Manages metadata for knowledge sources:

- **Entry Point**: `src/components/MetadataPanel/MetadataPanel.tsx`
- **Components**:
  - `TagsSection`: Tag management UI
  - `OntologyTermsSection`: Term management
  - `ExternalSourceSection`: External references

- **Hooks**:
  - `useMetadataPanel`: Orchestration hook
  - `useTagOperations`: Tag CRUD operations

## Data Flow

### Knowledge Creation Flow

1. User creates content via `MarkdownEditor`
2. Content is saved as draft via `useDraftHandler`
3. Tags are generated through the `TagGenerator`
4. User adds/edits metadata in `MetadataPanel`
5. Knowledge source is published via `usePublishHandler`
6. Relationship graph is updated to include new knowledge

### Knowledge Consumption Flow

1. User navigates to a knowledge source
2. `MarkdownViewer` renders the content with `ContentPanel`
3. `MetadataPanel` displays associated metadata
4. `RelationshipGraph` shows connections to other knowledge

## Error Handling

The application implements comprehensive error handling:

1. **Component-Level**: Using ErrorBoundary components
2. **API-Level**: TanStack Query's error handling
3. **Edge Function**: Structured error responses
4. **Global Notifications**: Toast messages for user feedback

## Performance Optimizations

Key performance strategies include:

1. **Code Splitting**: Lazy loading of routes and heavy components
2. **Memoization**: Using React.memo and useMemo for expensive components
3. **Virtualization**: For large lists or datasets
4. **Debouncing/Throttling**: For frequent user inputs
5. **Query Caching**: TanStack Query's intelligent caching

## Security Considerations

The application implements several security measures:

1. **Authentication**: Supabase Auth with secure session management
2. **Authorization**: Row-Level Security for data access control
3. **Input Validation**: Client and server-side validation
4. **API Security**: Edge functions with proper access controls

## Testing Strategy

The application uses a multi-layered testing approach:

1. **Unit Tests**: For isolated component and hook testing
2. **Integration Tests**: For feature workflows
3. **E2E Tests**: For critical user journeys

## Deployment Architecture

The application deployment consists of:

1. **Frontend**: Deployed as a static site
2. **Backend**: Supabase project with database, auth, and edge functions
3. **CI/CD**: Automated build and deployment pipeline

## Extension Points

The system is designed to be extensible through:

1. **Plugin Architecture**: For additional features
2. **Agent System**: For autonomous background tasks
3. **API Integration**: For third-party services
4. **Template System**: For customizable content structures

## Future Considerations

Potential areas for future development:

1. **Collaborative Editing**: Real-time multi-user editing
2. **Advanced AI Features**: More sophisticated content analysis
3. **Mobile Application**: Native mobile experience
4. **Analytics Dashboard**: Usage metrics and insights
5. **Advanced Search**: Semantic search capabilities
