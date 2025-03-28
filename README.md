
# DawsOS Knowledge Management System

DawsOS is a comprehensive knowledge management system designed to help organizations store, organize, and retrieve valuable information efficiently.

## Features

- **Knowledge Content Management**: Create, edit, and organize markdown content
- **Tag System**: Automatically and manually tag content for better organization
- **Templates**: Use predefined templates for consistent knowledge creation
- **Metadata Management**: Store and manage additional information about content
- **Authentication**: Secure user authentication and authorization

## Documentation

Detailed documentation can be found in the `docs` directory:

- [Tag Generation System](./docs/tag-generation-system.md)
- [Database Structure](./docs/database-structure.md)
- [Tag System Usage Guide](./docs/tag-system-usage-guide.md)

## Development Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (see `.env.example`)
4. Connect to your Supabase project
5. Run the development server with `npm run dev`

## Architecture

DawsOS is built with:

- React for the frontend
- Tailwind CSS for styling
- Supabase for backend services (database, authentication, edge functions)
- TypeScript for type safety

## Troubleshooting

See the documentation files for common issues and solutions. For additional help, please check the following:

- Console logs for client-side errors
- Supabase Edge Function logs for server-side errors
- Database logs for query-related issues

## License

This project is proprietary software. All rights reserved.
