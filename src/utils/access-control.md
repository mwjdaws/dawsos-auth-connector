
# Access Control Utilities

## Overview

These utilities maintain robust access control with:

1. **Role-Based Access Checks** - Permission management based on user roles
2. **Permission Validation** - Resource-level permission checking
3. **Audit Logging** - Tracking of security-related operations
4. **Performance Optimization** - Caching and efficient permission checks

## Detailed API Documentation

### Types

```typescript
// Permission types
export type PermissionType = 
  | "read"
  | "write"
  | "delete"
  | "admin"
  | "manage_users"
  | "manage_terms"
  | "manage_metadata";

// Resource types
export type ResourceType =
  | "knowledge_source"
  | "ontology_term"
  | "tag"
  | "template"
  | "user";

// Role information
export interface Role {
  id: string;
  name: string;
}
```

### `getAllRoles`

Fetches all available roles with caching to minimize database queries.

```typescript
getAllRoles(): Promise<Role[]>
```

#### Returns:
- `Promise<Role[]>` - Array of role objects with id and name

#### Example:
```typescript
// Get all available roles
const roles = await getAllRoles();

// Display roles in a select input
const RoleSelector = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  
  useEffect(() => {
    const fetchRoles = async () => {
      const availableRoles = await getAllRoles();
      setRoles(availableRoles);
    };
    
    fetchRoles();
  }, []);
  
  return (
    <select>
      {roles.map(role => (
        <option key={role.id} value={role.id}>
          {role.name}
        </option>
      ))}
    </select>
  );
};
```

#### How It Works:
- Checks for cached roles first to minimize database queries
- Queries the roles table if cache is empty
- Stores results in module-level cache for subsequent calls
- Handles errors gracefully with appropriate logging

### `getUserRoles`

Gets the roles assigned to a specific user.

```typescript
getUserRoles(userId: string): Promise<string[]>
```

#### Parameters:
- `userId: string` - ID of the user to check

#### Returns:
- `Promise<string[]>` - Array of role names assigned to the user

#### Example:
```typescript
// Check if user has admin role
const userRoles = await getUserRoles(userId);
const isAdmin = userRoles.includes("admin");

if (isAdmin) {
  // Show admin controls
} else {
  // Show regular user interface
}
```

#### How It Works:
- Queries the user_roles table with a join to the roles table
- Maps results to an array of role names
- Handles errors gracefully with appropriate logging

### `hasPermission`

Checks if a user has a specific permission on a resource.

```typescript
hasPermission(
  userId: string,
  permissionType: PermissionType,
  resourceType: ResourceType,
  resourceId?: string
): Promise<boolean>
```

#### Parameters:
- `userId: string` - ID of the user
- `permissionType: PermissionType` - Type of permission (read, write, etc.)
- `resourceType: ResourceType` - Type of resource
- `resourceId?: string` - Optional ID of specific resource

#### Returns:
- `Promise<boolean>` - Whether the user has the requested permission

#### Example:
```typescript
// Check if user can edit a specific knowledge source
const canEdit = await hasPermission(
  userId,
  "write",
  "knowledge_source",
  sourceId
);

// Check if user can manage users (general permission)
const canManageUsers = await hasPermission(
  userId,
  "manage_users",
  "user"
);

if (canEdit) {
  // Show edit button
}

if (canManageUsers) {
  // Show user management interface
}
```

#### How It Works:
1. First checks for resource ownership (users always have full permissions on their own resources)
2. Then checks for explicit permissions in the permissions table
3. Finally checks role-based permissions (admin role has all permissions)
4. Returns true if any check passes, false otherwise
5. Handles errors gracefully, defaulting to false (deny by default)

### `usePermissions` (React hook)

Provides permission checking capabilities in React components.

```typescript
usePermissions(): {
  checkPermission: (
    permissionType: PermissionType,
    resourceType: ResourceType,
    resourceId?: string
  ) => Promise<boolean>;
  isAuthenticated: boolean;
  userId?: string;
}
```

#### Returns:
- Object with:
  - `checkPermission: Function` - Function to check permissions
  - `isAuthenticated: boolean` - Whether user is authenticated
  - `userId?: string` - Current user ID if authenticated

#### Example:
```typescript
// In a React component
function ResourceActions({ resourceId, resourceType }) {
  const { checkPermission, isAuthenticated } = usePermissions();
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  
  useEffect(() => {
    // Skip permission checks if not authenticated
    if (!isAuthenticated) return;
    
    async function checkPermissions() {
      const [editPermission, deletePermission] = await Promise.all([
        checkPermission("write", resourceType, resourceId),
        checkPermission("delete", resourceType, resourceId)
      ]);
      
      setCanEdit(editPermission);
      setCanDelete(deletePermission);
    }
    
    checkPermissions();
  }, [resourceId, resourceType, isAuthenticated]);
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div className="actions">
      {canEdit && <EditButton resourceId={resourceId} />}
      {canDelete && <DeleteButton resourceId={resourceId} />}
    </div>
  );
}
```

#### How It Works:
- Uses the authentication context to get current user
- Provides a convenient wrapper around the hasPermission function
- Includes authentication state for conditional rendering
- Returns the current user ID for additional checks if needed

### `logSecurityAudit`

Records security-related events for compliance and auditing.

```typescript
logSecurityAudit(
  action: string,
  resourceType: ResourceType,
  resourceId: string,
  metadata?: Record<string, any>
): Promise<void>
```

#### Parameters:
- `action: string` - Description of the security action
- `resourceType: ResourceType` - Type of resource affected
- `resourceId: string` - ID of the resource
- `metadata?: Record<string, any>` - Additional context information

#### Example:
```typescript
// Log security event for permission change
await logSecurityAudit(
  "grant_permission",
  "knowledge_source",
  sourceId,
  {
    grantedTo: targetUserId,
    permission: "write",
    grantedBy: adminUserId
  }
);

// Log security event for sensitive action
await logSecurityAudit(
  "export_sensitive_data",
  "user",
  "*", // All users
  {
    exportFormat: "csv",
    fields: ["email", "name", "role"],
    excludeFields: ["password", "securityQuestions"]
  }
);
```

#### How It Works:
- Uses the current authenticated user from context
- Inserts a record into the security_audit_logs table
- Records timestamp, user, and action details
- Handles its own errors silently to avoid interrupting user flow

## Integration Patterns

### Conditional Rendering Based on Permissions

```tsx
function ProtectedContent({ resourceId }) {
  const { checkPermission, isAuthenticated } = usePermissions();
  const [canView, setCanView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function checkAccess() {
      setIsLoading(true);
      try {
        const hasAccess = await checkPermission(
          "read",
          "knowledge_source",
          resourceId
        );
        setCanView(hasAccess);
      } catch (error) {
        console.error("Permission check failed:", error);
        setCanView(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isAuthenticated) {
      checkAccess();
    } else {
      setCanView(false);
      setIsLoading(false);
    }
  }, [resourceId, isAuthenticated]);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!canView) {
    return <AccessDenied />;
  }
  
  return <SensitiveContent resourceId={resourceId} />;
}
```

### Permission-Aware API Calls

```typescript
async function updateResource(resourceId, data) {
  const { checkPermission } = usePermissions();
  
  // Check permission before making API call
  const canUpdate = await checkPermission("write", "knowledge_source", resourceId);
  
  if (!canUpdate) {
    throw new Error("Permission denied: Cannot update this resource");
  }
  
  try {
    // Proceed with update
    const { data: updatedData, error } = await supabase
      .from("knowledge_sources")
      .update(data)
      .eq("id", resourceId)
      .single();
      
    if (error) throw error;
    
    // Log the successful update for audit
    await logSecurityAudit(
      "update_resource",
      "knowledge_source",
      resourceId,
      { fields: Object.keys(data) }
    );
    
    return updatedData;
  } catch (error) {
    console.error("Failed to update resource:", error);
    throw error;
  }
}
```

## Performance Considerations

- **Caching Roles**: The role cache minimizes database queries for common operations
- **Permission Hierarchies**: The permission check cascade is optimized to check ownership first
- **Batching Checks**: Consider batching multiple permission checks in a single database query for complex UIs
- **Audit Log Performance**: The security audit logging is designed to not block user operations
