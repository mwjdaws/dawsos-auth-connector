
# Utility Functions Documentation

## Overview

This directory contains utility functions that enhance application reliability, error handling, and performance. These utilities help mitigate various risks when developing and scaling the application.

## Edge Function Reliability (`edge-function-reliability.ts`)

Utilities for improving reliability when working with Supabase Edge Functions.

### Key Functions:

#### `withTimeout<T>` 
- **Purpose**: Prevents UI from hanging if an edge function doesn't respond in time
- **Parameters**:
  - `promise`: The promise to execute with a timeout
  - `timeoutMs`: Timeout duration in milliseconds (default: 10000ms)
  - `fallbackValue`: Optional value to return if timeout occurs
- **Returns**: Promise that resolves with the result or rejects with timeout error
- **How it works**: Sets up a race between the provided promise and a timer. If the timer wins, either returns the fallback value or rejects with a timeout error.

#### `withRetry<T>`
- **Purpose**: Automatically retries failed function calls with exponential backoff
- **Parameters**: 
  - `fn`: Function to execute with retry logic
  - `options`: Configuration for retry behavior
- **Returns**: Promise that resolves with the result or rejects after exhausting retries
- **How it works**: Attempts to execute the function multiple times with increasing delays between attempts, using exponential backoff to avoid overwhelming systems.

#### `invokeEdgeFunctionReliably<T>`
- **Purpose**: Enhanced wrapper for Supabase edge function calls with reliability features
- **Parameters**:
  - `functionName`: Name of the edge function to call
  - `payload`: Data to send to the function
  - `options`: Configuration for reliability features
- **Returns**: Promise with the function result
- **How it works**: Combines timeout protection, automatic retry, error handling, and fallback mechanisms for robust edge function calls.

## Agent Reliability (`agent-reliability.ts`)

Utilities for enhancing agent task reliability with structured retry logic, result validation, error handling, and task tracking.

### Key Functions:

#### `executeAgentTask`
- **Purpose**: Creates and submits agent tasks with reliability enhancements
- **Parameters**: 
  - `options`: Configuration for the agent task
- **Returns**: Promise with task execution result
- **How it works**: 
  - For background tasks: Creates a task record in the database and triggers processing
  - For immediate execution: Calls the appropriate edge function with retry logic
  - Logs successes and failures for tracking

#### `logAgentSuccess` / `logAgentFailure`
- **Purpose**: Records agent actions for auditing and monitoring
- **Parameters**:
  - Agent name, action, result details, and metadata
- **How they work**: Insert records into the agent_actions table for tracking performance and troubleshooting

#### `getAgentTaskStatus`
- **Purpose**: Retrieves status information for background agent tasks
- **Parameters**: 
  - `taskId`: ID of the task to check
- **Returns**: Status information including state, retry count, timestamps, and results
- **How it works**: Queries the agent_tasks table for the current state of the specified task

## Access Control (`access-control.ts`)

Utilities for maintaining robust access control with role-based checks, permission validation, and audit logging.

### Key Functions:

#### `getAllRoles`
- **Purpose**: Fetches all available roles with caching to minimize database queries
- **Returns**: Array of role objects
- **How it works**: Queries the roles table once and caches results for subsequent calls

#### `getUserRoles`
- **Purpose**: Gets the roles assigned to a specific user
- **Parameters**: 
  - `userId`: ID of the user to check
- **Returns**: Array of role names
- **How it works**: Queries the user_roles table with a join to roles

#### `hasPermission`
- **Purpose**: Checks if a user has a specific permission on a resource
- **Parameters**:
  - `userId`: ID of the user
  - `permissionType`: Type of permission (read, write, etc.)
  - `resourceType`: Type of resource
  - `resourceId`: Optional ID of specific resource
- **Returns**: Boolean indicating if permission is granted
- **How it works**: 
  - Checks for ownership (users have full permissions on their own resources)
  - Checks explicit permissions in the permissions table
  - Checks role-based permissions

#### `usePermissions` (React hook)
- **Purpose**: Provides permission checking capabilities in components
- **Returns**: Object with permission checking functions and authentication state
- **How it works**: Uses the current user from authentication context to check permissions

#### `logSecurityAudit`
- **Purpose**: Records security-related events for compliance and auditing
- **Parameters**:
  - `action`: Description of the security action
  - `resourceType`: Type of resource affected
  - `resourceId`: ID of the resource
  - `metadata`: Additional context information
- **How it works**: Inserts a record into the security_audit_logs table

## Usage Examples

### Edge Function Reliability

```typescript
// Basic usage with timeout and retry
const result = await invokeEdgeFunctionReliably(
  "process-document", 
  { documentId: "doc-123" },
  { timeoutMs: 15000, maxRetries: 3 }
);

// With fallback function
const result = await invokeEdgeFunctionReliably(
  "generate-summary",
  { text: longText },
  { 
    fallbackFn: () => ({ summary: "Summary unavailable" }),
    showErrorToast: true
  }
);
```

### Agent Reliability

```typescript
// Execute task immediately
const result = await executeAgentTask({
  agentName: "content-analyzer",
  action: "analyze-sentiment",
  knowledgeSourceId: "doc-123",
  metadata: { priority: "high" }
});

// Schedule background task
const { taskId } = await executeAgentTask({
  agentName: "content-processor",
  action: "generate-embeddings",
  knowledgeSourceId: "doc-456",
  runInBackground: true
});

// Check task status
const status = await getAgentTaskStatus(taskId);
```

### Access Control

```typescript
// Check if user can edit a resource
const canEdit = await hasPermission(
  userId,
  "write",
  "knowledge_source",
  sourceId
);

// In a React component
function EditButton({ resourceId }) {
  const { checkPermission, isAuthenticated } = usePermissions();
  const [canEdit, setCanEdit] = useState(false);
  
  useEffect(() => {
    async function checkAccess() {
      const hasAccess = await checkPermission(
        "write", 
        "knowledge_source", 
        resourceId
      );
      setCanEdit(hasAccess);
    }
    
    if (isAuthenticated) {
      checkAccess();
    }
  }, [resourceId, isAuthenticated]);
  
  if (!canEdit) return null;
  
  return <Button>Edit</Button>;
}
```
