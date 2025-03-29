
# DawsOS Web Application Architecture

## Overview

DawsOS is an AI-augmented knowledge management system designed to enhance the way users interact with information. Built with React, TypeScript, Supabase, and OpenAI GPT-4, this application provides a seamless experience for managing knowledge sources and templates.

## Core Concepts

### Knowledge Sources
Central to DawsOS is the concept of "knowledge sources" - documents containing information that can be tagged, enriched with metadata, and connected to other knowledge sources to form a knowledge graph.

### Metadata
Each knowledge source has associated metadata:
- Tags: Keywords or phrases that categorize the content
- Ontology Terms: Structured vocabulary terms that relate to the content
- External Sources: Links to original content if the knowledge was imported

### Knowledge Graph
The system builds relationships between knowledge sources through tags, ontology terms, and explicit connections, forming a navigable knowledge graph.

## System Architecture

### Frontend Architecture

The application follows a component-based architecture with React, organized into:

1. **Pages**: Top-level route components
2. **Components**: Reusable UI elements
3. **Hooks**: Custom React hooks for state and logic
4. **Utils**: Utility functions
5. **Types**: TypeScript type definitions

### Backend Architecture

DawsOS uses Supabase for its backend:

1. **Database**: PostgreSQL for storing knowledge sources, tags, and metadata
2. **Authentication**: User management and access control
3. **Edge Functions**: Serverless functions for AI processing
4. **Realtime**: Live updates for collaborative features

### Integration Architecture

The system integrates with:

1. **OpenAI**: For AI-powered tag generation and content enrichment
2. **External Content Sources**: For importing and validating external references

## Key Components

### Dashboard System

#### Dashboard Page (`src/pages/Dashboard.tsx`)
The main interface for interacting with knowledge sources. Features:
- Content management (creating, viewing, editing knowledge sources)
- Tab-based interface for different functionalities
- Debug panel for system diagnostics

#### Dashboard Header (`src/components/Dashboard/DashboardHeader.tsx`)
Displays system statistics and status information:
- Knowledge source counts
- System health indicators
- Action buttons for global operations

#### Dashboard User Info (`src/components/Dashboard/DashboardUserInfo.tsx`)
Shows the current user information and controls:
- User authentication status
- Debug panel toggle
- User-specific actions

#### Content Management (`src/components/Dashboard/ContentManagement.tsx`)
Handles the content creation and manipulation workflow:
- Knowledge source selection
- Tab management
- Operation handlers for saving, publishing, etc.

### Tab System

#### Dashboard Tabs (`src/components/Dashboard/Tabs/DashboardTabs.tsx`)
Manages the tab-based interface with:
- Tag Generator
- Markdown Viewer
- Markdown Editor
- Metadata Panel
- Templates
- Knowledge Graph

#### Tab Content Components
Each tab has dedicated components:
- `TagGeneratorTab`: For creating and managing tags
- `MarkdownViewerTab`: For viewing content with rendered markdown
- `MarkdownEditorTab`: For editing content
- `MetadataTab`: For viewing and editing metadata
- `TemplatesTab`: For managing templates
- `RelationshipGraphTab`: For visualizing the knowledge graph

### Metadata System

#### Metadata Panel (`src/components/MetadataPanel/MetadataPanel.tsx`)
Comprehensive UI for viewing and editing content metadata:
- Tags
- External sources
- Ontology terms
- Content identification

#### Metadata Sections
The panel is divided into functional sections:
- `HeaderSection`: Controls for refreshing and collapsing
- `ExternalSourceSection`: Displays and manages external references
- `TagsSection`: Interface for tag management
- `OntologyTermsSection`: Shows related ontology terms
- `ContentIdSection`: Displays the content identifier

#### Metadata Hooks
Custom hooks manage the metadata state and operations:
- `useMetadataPanel`: Main orchestration hook
- `useTagOperations`: Manages tag state and CRUD operations
- `useSourceMetadata`: Handles external source information
- `usePanelState`: Controls panel UI state

### Content Editing System

#### Markdown Editor (`src/components/MarkdownEditor/MarkdownEditor.tsx`)
Feature-rich editor for creating and modifying content:
- Split-pane editing with preview
- Template application
- Version history
- Content saving and publishing

#### Editor Components
The editor is composed of:
- `EditorHeader`: Title input and template selection
- `EditorToolbar`: Editing tools and mode toggles
- `SplitEditor`: Side-by-side editing layout
- `FullscreenEditor`: Immersive editing mode

#### Editor Hooks
State management for the editor:
- `useMarkdownEditor`: Main orchestration hook
- `useContentState`: Manages document content and changes
- `useContentLoader`: Loads existing content
- `useDocumentOperations`: Handles save and publish operations
- `useTemplateHandling`: Manages template application
- `useAutosave`: Periodic automatic saving

### Tag Management System

#### Tag Panel (`src/components/TagPanel/index.tsx`)
Interface for generating and managing tags:
- Content-based tag generation
- Manual tag creation
- Tag organization and filtering

#### Tag Components
The system includes:
- `TagGenerator`: Creates tags from content
- `TagList`: Displays tags for a knowledge source
- `TagSaver`: Persists tags to the database
- `ManualTagCreator`: Interface for manual tag entry
- `GroupedTagList`: Organized tag visualization

#### Tag Hooks
Specialized hooks for tag operations:
- `useTagGeneration`: AI-powered tag creation
- `useSaveTags`: Database persistence
- `useTagQuery`: Retrieval and filtering

### Knowledge Graph System

#### Relationship Graph (`src/components/MarkdownViewer/RelationshipGraph/RelationshipGraph.tsx`)
Interactive visualization of knowledge connections:
- Node-based representation of knowledge sources
- Edge-based representation of relationships
- Interactive navigation and filtering

#### Graph Components
The visualization includes:
- `GraphRenderer`: Core rendering engine
- `GraphHeader`: Controls and information
- `GraphSearch`: Finding specific nodes
- `GraphZoomControl`: Navigation aids
- `GraphControls`: Interface for manipulating the view

#### Graph Hooks
Data management for the graph:
- `useGraphData`: Retrieves relationship data
- `useGraphLayout`: Controls visualization parameters
- `useGraphInteraction`: Manages user interactions

### Template System

#### Templates Panel (`src/components/TemplatesPanel`)
Interface for creating and using document templates:
- Template browsing and selection
- Template creation and editing
- Template application to documents

#### Template Hooks
Managing template operations:
- `useTemplates`: Retrieves available templates
- `useTemplateHandling`: Applies templates to content

## State Management

### Component State
Local state within components using React's `useState` and `useReducer`

### Context State
Shared state across component trees:
- `MetadataContext`: Metadata state and operations
- `AuthContext`: User authentication information

### Remote State
Data from external sources managed with React Query:
- `useKnowledgeSourcesQuery`: Retrieves knowledge sources
- `useTagsQuery`: Manages tag data
- `useOntologyTermsQuery`: Handles ontology term data

## Data Flow

### Knowledge Creation Workflow
1. User creates or imports content via the editor
2. AI suggests tags and ontology terms
3. User edits and approves metadata
4. Content is saved as a draft or published
5. Knowledge graph is updated with new relationships

### Knowledge Consumption Workflow
1. User browses or searches for content
2. Selected content is displayed with associated metadata
3. Related content is suggested based on tags and ontology terms
4. User can navigate the knowledge graph for contextual information

## Testing Architecture

The application uses Vitest for testing with:
- Component tests for UI elements
- Hook tests for state management
- Integration tests for workflows
- Mocks for external services

### Test Structure
- `__tests__` directories contain test files
- `setup` folders contain test utilities
- Mock implementations for isolating components

## Extension Points

### Agent System
The application includes an agent system for background processing:
- `agent_tasks` table for tracking operations
- `agent_actions` table for recording completed steps

### External Integrations
The system is designed to integrate with:
- External content repositories
- AI services for content enrichment
- Analytics systems for usage tracking

## Conclusion

DawsOS represents a sophisticated knowledge management system built with modern web technologies. Its component-based architecture provides flexibility and extensibility, while its integration with AI services enhances the user's ability to organize and discover information. The application demonstrates effective use of React patterns, TypeScript for type safety, and Supabase for backend services, creating a cohesive system for knowledge management.
