# Build Configuration Guide

## Production Build Configuration

The project includes a specialized TypeScript configuration for production builds in `tsconfig.build.json`. This configuration:

- Disables source maps for smaller build size
- Generates declaration files for better TypeScript integration
- Removes comments from output for smaller file sizes
- Prevents emission of files when there are errors
- Imports helpers from tslib for smaller bundles
- Disables incremental compilation for clean builds
- Excludes test files and configurations

## How to Use This Configuration

To use this production build configuration, add the following script to your package.json:

```json
"scripts": {
  "build:prod": "tsc -p tsconfig.build.json && vite build"
}
```

Then run:

```bash
npm run build:prod
```

## Integration with Vite

For more advanced build configurations with Vite, you can also reference the tsconfig.build.json in your vite.config.ts file:

```typescript
export default defineConfig(({ mode }) => ({
  // ... other configurations
  build: {
    // ... existing build options
    rollupOptions: {
      // ... existing rollup options
    },
    // Use the TypeScript configuration for production builds
    typescript: {
      tsconfig: mode === 'production' ? './tsconfig.build.json' : './tsconfig.json'
    }
  }
}));
```

## Build Process Overview

1. TypeScript compilation using optimized settings
2. Vite production build for bundling and optimization
3. Output generation in the 'dist' directory

This process ensures the most efficient and optimized production builds while maintaining development-friendly settings for local development.
