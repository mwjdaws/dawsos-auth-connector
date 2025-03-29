
# Edge Function Reliability Utilities

## Overview

These utilities enhance the reliability of Supabase Edge Function calls by implementing:

1. **Timeout Protection** - Prevents UI hanging when functions don't respond
2. **Automatic Retry** - Recovers from transient failures with exponential backoff
3. **Fallback Mechanisms** - Provides graceful degradation when functions fail
4. **Error Handling** - Manages and reports errors consistently

## Detailed API Documentation

### `withTimeout<T>`

Wraps a promise with timeout protection to prevent hanging UI.

```typescript
withTimeout<T>(
  promise: Promise<T>,
  timeoutMs = 10000,
  fallbackValue?: T
): Promise<T>
```

#### Parameters:
- `promise: Promise<T>` - The original promise to execute
- `timeoutMs: number` - Timeout duration in milliseconds (default: 10000ms)
- `fallbackValue?: T` - Optional value to return if timeout occurs

#### Returns:
- `Promise<T>` - Promise that resolves with the result or rejects with timeout error

#### Example:
```typescript
// With rejection on timeout
try {
  const result = await withTimeout(
    fetchData(), 
    5000
  );
  // Use result
} catch (error) {
  // Handle timeout or other errors
}

// With fallback value on timeout
const result = await withTimeout(
  fetchData(),
  5000,
  { status: "timeout", data: [] }
);
// Result will be the fallback value if timeout occurs
```

#### How It Works:
- Sets up a race between the original promise and a timeout timer
- If the original promise resolves before the timeout, its result is returned
- If the timeout occurs first, either returns the fallback value or rejects with an error
- Properly cleans up the timeout to prevent memory leaks

### `withRetry<T>`

Automatically retries failed function calls with exponential backoff.

```typescript
withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
    onRetry?: (attempt: number, error: Error) => void;
    shouldRetry?: (error: Error) => boolean;
  }
): Promise<T>
```

#### Parameters:
- `fn: () => Promise<T>` - Function to execute with retry logic
- `options` - Configuration object:
  - `maxRetries?: number` - Maximum number of retry attempts (default: 3)
  - `initialDelayMs?: number` - Initial delay between retries in ms (default: 500)
  - `maxDelayMs?: number` - Maximum delay between retries in ms (default: 5000)
  - `onRetry?: (attempt: number, error: Error) => void` - Callback on retry
  - `shouldRetry?: (error: Error) => boolean` - Function to determine if retry should occur

#### Returns:
- `Promise<T>` - Promise that resolves with the result or rejects after all retries fail

#### Example:
```typescript
// Basic usage
const result = await withRetry(
  () => fetchApiData()
);

// Advanced configuration
const result = await withRetry(
  () => fetchApiData(),
  {
    maxRetries: 5,
    initialDelayMs: 200,
    maxDelayMs: 3000,
    onRetry: (attempt, error) => {
      console.warn(`Retry ${attempt} after error: ${error.message}`);
      analytics.trackRetry(attempt, error);
    },
    shouldRetry: (error) => {
      // Only retry on network errors or 5xx status codes
      return error.name === 'NetworkError' || 
             (error.status && error.status >= 500);
    }
  }
);
```

#### How It Works:
- Attempts to execute the function
- If it fails and retries are available, waits for the specified delay
- Increases the delay with each attempt (exponential backoff)
- Continues until success or maximum retries reached
- Uses the shouldRetry function to decide if an error should trigger a retry

### `invokeEdgeFunctionReliably<T>`

Enhanced wrapper for Supabase Edge Function calls with reliability features.

```typescript
invokeEdgeFunctionReliably<T>(
  functionName: string,
  payload?: any,
  options?: {
    timeoutMs?: number;
    maxRetries?: number;
    fallbackFn?: () => Promise<T> | T;
    showErrorToast?: boolean;
  }
): Promise<T>
```

#### Parameters:
- `functionName: string` - Name of the edge function to call
- `payload?: any` - Data to send to the function
- `options` - Configuration object:
  - `timeoutMs?: number` - Timeout duration in ms (default: 10000)
  - `maxRetries?: number` - Maximum number of retry attempts (default: 2)
  - `fallbackFn?: () => Promise<T> | T` - Function to provide fallback data
  - `showErrorToast?: boolean` - Whether to display error toast (default: true)

#### Returns:
- `Promise<T>` - Promise with the function result

#### Example:
```typescript
// Basic usage
const tags = await invokeEdgeFunctionReliably(
  "generate-tags",
  { contentId: "doc-123" }
);

// With custom configuration
const summary = await invokeEdgeFunctionReliably(
  "summarize-content",
  { text: longText, maxLength: 200 },
  {
    timeoutMs: 20000,
    maxRetries: 3,
    fallbackFn: () => ({
      summary: "This content could not be summarized automatically.",
      isAutomated: false
    }),
    showErrorToast: false // Handle error display manually
  }
);
```

#### How It Works:
- Dynamically imports the Supabase client to avoid edge function issues
- Wraps the edge function call with timeout protection
- Applies retry logic with exponential backoff
- Handles errors and shows toast notifications if configured
- Uses fallback function if provided when all retries fail
- Returns result data or throws an error

## Integration with Other Utilities

These utilities work well with other reliability patterns in the codebase:

- **Agent Reliability**: Uses edge function reliability for agent task execution
- **Batch Processing**: Can wrap batch operations with retry and timeout
- **Error Handling**: Integrates with the application's error handling system

## Performance Considerations

- Use appropriate timeout values based on the expected execution time of the function
- Consider the impact of retries on backend resources and adjust accordingly
- For critical operations, always provide fallback functions to ensure graceful degradation
