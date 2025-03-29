
/**
 * Access Control Utilities
 * 
 * Provides utilities for maintaining robust access control with:
 * - Role-based access checks
 * - Permission validation
 * - Audit logging for security operations
 */

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { handleError } from "./errors";

/**
 * Permission types available in the system
 */
export type PermissionType = 
  | "read"
  | "write"
  | "delete"
  | "admin"
  | "manage_users"
  | "manage_terms"
  | "manage_metadata";

/**
 * Resource types that can have permissions
 */
export type ResourceType =
  | "knowledge_source"
  | "ontology_term"
  | "tag"
  | "template"
  | "user";

/**
 * Structure for role information
 */
export interface Role {
  id: string;
  name: string;
}

/**
 * Cached roles to minimize database queries
 */
let roleCache: Role[] | null = null;

/**
 * Fetches all available roles
 */
export async function getAllRoles(): Promise<Role[]> {
  // Use cache if available
  if (roleCache) return roleCache;
  
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("id, name");
      
    if (error) throw error;
    
    // Cache the result
    roleCache = data;
    return data;
  } catch (error) {
    handleError(
      error,
      "Failed to fetch roles",
      { level: "warning", silent: true }
    );
    return [];
  }
}

/**
 * Gets the roles assigned to a user
 * Note: user_roles table might not exist; this function is mocked
 */
export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    // Since user_roles table doesn't exist in the schema, return default roles
    console.log("Note: user_roles table doesn't exist; returning default role");
    return ["user"];
    
    // If table existed, we would do:
    /*
    const { data, error } = await supabase
      .from("user_roles")
      .select("role, roles(name)")
      .eq("user_id", userId);
      
    if (error) throw error;
    
    return data.map(role => role.roles.name);
    */
  } catch (error) {
    handleError(
      error,
      "Failed to get user roles",
      { level: "warning", silent: true, context: { userId } }
    );
    return [];
  }
}

/**
 * Checks if a user has a specific permission on a resource
 */
export async function hasPermission(
  userId: string,
  permissionType: PermissionType,
  resourceType: ResourceType,
  resourceId?: string
): Promise<boolean> {
  try {
    // Special case for user's own resources
    if (resourceId && resourceType === "knowledge_source") {
      const { data } = await supabase
        .from("knowledge_sources")
        .select("user_id")
        .eq("id", resourceId)
        .single();
        
      // Users always have full permission on their own resources
      if (data && data.user_id === userId) {
        return true;
      }
    }
    
    // Check explicit permissions
    const query = supabase
      .from("permissions")
      .select("id")
      .eq("permission_type", permissionType)
      .eq("resource_type", resourceType);
      
    if (resourceId) {
      query.eq("resource_id", resourceId);
    }
    
    const { data: permissions } = await query;
    
    if (permissions && permissions.length > 0) {
      return true;
    }
    
    // Check role-based permissions
    const userRoles = await getUserRoles(userId);
    
    // Admin role has all permissions
    if (userRoles.includes("admin")) {
      return true;
    }
    
    // Role-specific checks
    if (permissionType === "read" && (
      userRoles.includes("user") || 
      userRoles.includes("moderator")
    )) {
      return true;
    }
    
    if ((permissionType === "write" || permissionType === "delete") && 
      userRoles.includes("moderator")
    ) {
      return true;
    }
    
    // No permission found
    return false;
  } catch (error) {
    handleError(
      error,
      "Permission check failed",
      { level: "warning", silent: true }
    );
    return false;
  }
}

/**
 * Hook for checking permissions in components
 */
export function usePermissions() {
  const { user } = useAuth();
  
  const checkPermission = async (
    permissionType: PermissionType,
    resourceType: ResourceType,
    resourceId?: string
  ): Promise<boolean> => {
    if (!user) return false;
    return hasPermission(user.id, permissionType, resourceType, resourceId);
  };
  
  return {
    checkPermission,
    isAuthenticated: !!user,
    userId: user?.id,
  };
}

/**
 * Logs a security audit event
 * Note: security_audit_logs table might not exist; this function is mocked
 */
export async function logSecurityAudit(
  action: string,
  resourceType: ResourceType,
  resourceId: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    console.log("Security audit log (mocked):", {
      action,
      resourceType,
      resourceId,
      metadata,
      timestamp: new Date().toISOString()
    });
    
    // If the security_audit_logs table existed, we would do:
    /*
    const { user } = useAuth();
    
    await supabase
      .from("security_audit_logs")
      .insert({
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        user_id: user?.id,
        metadata,
        ip_address: "client-side", // Note: actual IP address should be set server-side
      });
    */
  } catch (error) {
    console.error("Failed to log security audit:", error);
    // Don't throw errors for logging failures
  }
}
