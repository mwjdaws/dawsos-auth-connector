
# Agent Reliability Utilities

## Overview

These utilities enhance the reliability of AI agent tasks with:

1. **Structured Retry Logic** - Recovers from transient failures
2. **Result Validation** - Ensures agent outputs meet quality standards
3. **Error Handling** - Manages and recovers from failures
4. **Task Tracking** - Monitors and logs agent activities
5. **Background Processing** - Handles long-running operations asynchronously

## Detailed API Documentation

### Types

```typescript
// Agent task status
export type AgentTaskStatus = 
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "retry_scheduled";

// Agent task priority
export type AgentTaskPriority = "high" | "medium" | "low";

// Agent task options
export interface AgentTaskOptions {
  agentName: string;
  action: string;
  knowledgeSourceId?: string;
  metadata?: Record<string, any>;
  priority?: AgentTaskPriority;
  maxRetries?: number;
  runInBackground?: boolean;
}

// Agent task result
export interface AgentTaskResult {
  success: boolean;
  taskId?: string;
  data?: any;
  error?: string;
  executionTime?: number;
}
```

### `executeAgentTask`

Creates and submits an agent task with reliability enhancements.

```typescript
executeAgentTask(options: AgentTaskOptions): Promise<AgentTaskResult>
```

#### Parameters:
- `options: AgentTaskOptions` - Configuration for the agent task:
  - `agentName: string` - Name of the agent to execute
  - `action: string` - Action for the agent to perform
  - `knowledgeSourceId?: string` - Optional ID of knowledge source
  - `metadata?: Record<string, any>` - Additional context for the agent
  - `priority?: AgentTaskPriority` - Task priority (default: "medium")
  - `maxRetries?: number` - Maximum retry attempts (default: 3)
  - `runInBackground?: boolean` - Whether to run as background task (default: false)

#### Returns:
- `Promise<AgentTaskResult>` - Result of the task execution

#### Example:
```typescript
// Execute immediately
const result = await executeAgentTask({
  agentName: "content-analyzer",
  action: "analyze-sentiment",
  knowledgeSourceId: "doc-123",
  metadata: { 
    includeKeyPhrases: true,
    minimumConfidence: 0.7
  }
});

// Execute as background task
const { taskId } = await executeAgentTask({
  agentName: "content-enricher",
  action: "generate-embeddings",
  knowledgeSourceId: "doc-456",
  priority: "low",
  runInBackground: true
});
```

#### How It Works:
- For background tasks:
  1. Creates a task record in the database
  2. Assigns priority and status
  3. Triggers the task processor via edge function
  4. Returns task ID for status checking
- For immediate execution:
  1. Calls the execute-agent-task edge function
  2. Applies timeout and retry protections
  3. Logs success or failure
  4. Returns result data

### `logAgentSuccess` / `logAgentFailure`

Records agent actions for auditing and monitoring.

```typescript
logAgentSuccess(
  agentName: string,
  action: string,
  knowledgeSourceId?: string,
  confidence?: number,
  metadata?: Record<string, any>
): Promise<void>

logAgentFailure(
  agentName: string,
  action: string,
  error: string,
  knowledgeSourceId?: string,
  metadata?: Record<string, any>
): Promise<void>
```

#### Parameters:
- `agentName: string` - Name of the agent
- `action: string` - Action performed
- `knowledgeSourceId?: string` - ID of knowledge source (if applicable)
- `confidence?: number` - Confidence score of the result (for success)
- `error: string` - Error message (for failure)
- `metadata?: Record<string, any>` - Additional context information

#### Example:
```typescript
// Log successful action
await logAgentSuccess(
  "tag-generator",
  "generate-tags",
  "doc-123",
  0.85,
  { tagCount: 12, executionTime: 1250 }
);

// Log failed action
await logAgentFailure(
  "summarizer",
  "generate-summary",
  "API rate limit exceeded",
  "doc-456",
  { attemptCount: 3 }
);
```

#### How It Works:
- Inserts a record into the agent_actions table
- Sets the success flag appropriately
- Includes all context information for analysis
- Handles its own errors silently to avoid cascading failures

### `getAgentTaskStatus`

Retrieves status information for background agent tasks.

```typescript
getAgentTaskStatus(taskId: string): Promise<{
  status: AgentTaskStatus;
  retryCount: number;
  lastAttempt?: Date;
  nextAttempt?: Date;
  error?: string;
  result?: any;
}>
```

#### Parameters:
- `taskId: string` - ID of the task to check

#### Returns:
- Object with task status information:
  - `status: AgentTaskStatus` - Current status of the task
  - `retryCount: number` - Number of retry attempts
  - `lastAttempt?: Date` - Timestamp of last attempt
  - `nextAttempt?: Date` - Timestamp of scheduled retry
  - `error?: string` - Error message if failed
  - `result?: any` - Task result data if completed

#### Example:
```typescript
// Check status of background task
const status = await getAgentTaskStatus(taskId);

if (status.status === "completed") {
  // Use the result
  console.log("Task completed:", status.result);
} else if (status.status === "processing") {
  // Show progress indicator
  console.log(`Task in progress, attempt ${status.retryCount + 1}`);
} else if (status.status === "failed") {
  // Handle failure
  console.error("Task failed:", status.error);
}
```

#### How It Works:
- Queries the agent_tasks table for the specified task ID
- Maps database fields to a structured response object
- Handles database errors gracefully
- Returns a consistent format regardless of task state

## Integration Patterns

### Background Task Workflow

```typescript
// 1. Submit background task
const { taskId, success } = await executeAgentTask({
  agentName: "document-processor",
  action: "extract-entities",
  knowledgeSourceId: documentId,
  runInBackground: true,
  priority: "high"
});

if (!success) {
  // Handle submission failure
  return;
}

// 2. Poll for task completion (or use push notification if available)
const checkStatus = async () => {
  const status = await getAgentTaskStatus(taskId);
  
  if (status.status === "completed") {
    // Process completed result
    updateUI(status.result);
    return true;
  } else if (status.status === "failed") {
    // Handle failure
    showError(status.error);
    return true;
  }
  
  // Task still in progress
  return false;
};

// Simple polling implementation
const poll = async (interval = 2000, timeout = 30000) => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const isDone = await checkStatus();
    if (isDone) return;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  // Timeout reached
  showError("Task processing timeout");
};

poll();
```

### Immediate Execution with Fallback

```typescript
try {
  // Try to execute agent task immediately
  const result = await executeAgentTask({
    agentName: "content-analyzer",
    action: "analyze-sentiment",
    knowledgeSourceId: documentId,
    maxRetries: 2
  });
  
  if (result.success) {
    // Use the result
    updateSentimentUI(result.data);
  } else {
    // Fall back to simpler processing
    const basicSentiment = await performBasicSentimentAnalysis(documentId);
    updateSentimentUI(basicSentiment, { isBasic: true });
  }
} catch (error) {
  // Handle unexpected errors
  console.error("Failed to analyze sentiment:", error);
  showErrorNotification("Could not analyze sentiment at this time");
}
```

## Performance Considerations

- **Background vs. Immediate**: Use background processing for non-critical tasks to improve perceived performance
- **Priority Levels**: Assign appropriate priority based on user expectations and resource needs
- **Retry Strategies**: Set reasonable retry counts and consider the cost of repeated execution
- **Monitoring**: Use the logged agent actions for performance analysis and optimization
