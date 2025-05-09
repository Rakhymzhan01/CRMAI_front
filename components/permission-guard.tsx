// components/permission-guard.tsx
"use client"

import { useAuth } from "@/lib/auth-context"
import { hasPermission, hasAnyPermission, Permission } from "@/lib/permissions"
import { Icons } from "@/components/icons"

interface PermissionGuardProps {
  permission?: Permission
  anyPermission?: Permission[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  anyPermission,
  fallback,
  children,
}: PermissionGuardProps) {
  const { user } = useAuth()
  
  // Check if user has the required permissions
  const hasAccess = permission 
    ? hasPermission(user, permission)
    : anyPermission 
      ? hasAnyPermission(user, anyPermission)
      : true // No permission check required

  if (!hasAccess) {
    // Return fallback or default access denied message
    return fallback || (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.alertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-sm text-gray-500">You don't have permission to access this resource.</p>
      </div>
    )
  }

  return <>{children}</>
}