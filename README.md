
# DawsOS - AI-Augmented Knowledge Management System

## Project Overview

DawsOS is an advanced knowledge management system designed to enhance how users interact with and organize information. Built with modern web technologies, DawsOS leverages artificial intelligence to provide intelligent tagging, content categorization, and knowledge organization features.

## Core Features

- **AI-Powered Tag Generation**: Automatically generate relevant tags for content using OpenAI's GPT models
- **Knowledge Templates**: Use and create templates for consistent knowledge structuring
- **Markdown Support**: Edit and view content with full markdown capabilities
- **Document Versioning**: Track changes, view history, and restore previous versions of documents
- **Real-time Collaboration**: Work with team members in real-time on knowledge resources
- **Intelligent Metadata**: Enhance content with rich metadata for better discoverability
- **Tag Relationships**: Create meaningful connections between tagged content

## Technical Architecture

DawsOS is built with a modern tech stack:

- **Frontend**: React with TypeScript, using Vite for fast development
- **UI Components**: Shadcn UI with Tailwind CSS for a clean, responsive interface
- **State Management**: React Query for efficient data fetching and state management
- **Backend**: Supabase for authentication, database, and serverless functions
- **AI Integration**: OpenAI API for intelligent tag generation and content analysis

## Application Structure

The application is organized into several key components:

### Tag Generation System

- Uses AI to analyze content and suggest relevant tags
- Provides caching and validation for improved performance
- Handles retries and fallbacks for reliability

### Content Management

- Markdown editing and viewing with preview
- Metadata panel for viewing and editing content attributes
- Knowledge source version tracking and restoration

### Template System

- Create, use, and manage knowledge templates
- Apply templates to standardize knowledge structure
- Filter and browse existing templates

### Versioning System

- Automatic and manual version creation
- Version history browsing and restoration
- Metadata-rich version tracking

## Getting Started

To get started with DawsOS, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd dawsos
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file based on `.env.example` with your Supabase and OpenAI API credentials.

4. **Run the application**:
   ```
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:5173` to view the application.

## Key Modules

### Tag Generation

The tag generation system uses a modular approach:

- `useTagGenerationCore`: Main hook for tag generation logic
- `useTagValidator`: Validates input before processing
- `useTagCache`: Caches previous results for improved performance
- `useTagGenerationProcess`: Handles the actual tag generation process

### Document Versioning

The document versioning system provides:

- `useDocumentVersioning`: Core hook for version operations
- `VersionHistoryModal`: UI for browsing and restoring versions
- Automatic backup creation before version restoration

### Dashboard

The dashboard provides a central interface with:

- Tag Generator for creating tags from content
- Markdown Viewer for viewing content with metadata
- Markdown Editor with version history tracking
- Metadata Panel for editing content attributes
- Templates Panel for managing knowledge templates

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
