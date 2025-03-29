
# Test Script Information

Add the following script to your package.json:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui",
"test:coverage": "vitest run --coverage"
```

How to use:
- Run `npm test` to run tests once
- Run `npm run test:watch` for watch mode
- Run `npm run test:ui` for UI mode (if vitest-ui is installed)
- Run `npm run test:coverage` for coverage reports
