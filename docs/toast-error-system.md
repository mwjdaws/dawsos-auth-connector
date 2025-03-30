
# Toast Error Notification System

This document outlines the toast error notification system implemented in the DawsOS application.

## Overview

The toast notification system provides user feedback for various operations, including errors, warnings, and success messages. The system is designed to be:

- Non-intrusive
- Helpful
- Temporary
- Context-aware

## Key Components

### 1. Toast Hook (`use-toast.ts`)

The core mechanism that manages toast state and provides methods to add, update, and dismiss toasts.

Key features:
- Automatic toast removal after 5 seconds (configurable)
- Toast deduplication
- Limit on maximum visible toasts
- Route change detection to clear irrelevant toasts

### 2. Error Handler (`handle.tsx`)

Centralized error handling utility that standardizes error processing and displays appropriate toast notifications.

Key features:
- Error categorization
- Context logging
- Customizable notification settings
- Deduplication of error messages
- Support for action callbacks

### 3. Toaster Component (`toaster.tsx`)

React component that renders toasts in the UI with appropriate styling and interaction.

Key features:
- Limit on maximum visible toasts
- Memory leak prevention
- Responsive layout

## Usage

### Basic Toast

```tsx
import { toast } from "@/hooks/use-toast";

toast({
  title: "Operation Successful",
  description: "Your changes have been saved.",
});
```

### Error Toast

```tsx
import { toast } from "@/hooks/use-toast";

toast({
  title: "Error",
  description: "Failed to save changes.",
  variant: "destructive",
});
```

### With Action

```tsx
import { toast } from "@/hooks/use-toast";

toast({
  title: "Connection Lost",
  description: "You've been disconnected from the server.",
  variant: "destructive",
  action: (
    <ToastAction altText="Retry" onClick={reconnect}>
      Retry
    </ToastAction>
  ),
});
```

### Centralized Error Handling

```tsx
import { handleError } from "@/utils/errors";

try {
  // Operation that might fail
} catch (error) {
  handleError(error, "Failed to load data", {
    level: "warning",
    context: { requestId: "123" },
    preventDuplicate: true,
  });
}
```

## Best Practices

1. Use toasts sparingly to avoid overwhelming users
2. Keep toast messages concise and actionable
3. Use different variants (default, destructive) appropriately
4. Always provide clear error recovery options when possible
5. Use the centralized error handling system for consistency
6. Set appropriate context data for debugging purposes
7. Implement preventDuplicate for operations that might trigger multiple similar errors
