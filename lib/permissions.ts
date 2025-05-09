// lib/permissions.ts
import { User } from "@/types/user"

export enum Permission {
  // Shop permissions
  ViewShops = "view:shops",
  CreateShop = "create:shop",
  EditShop = "edit:shop",
  DeleteShop = "delete:shop",
  
  // Employee permissions
  ViewEmployees = "view:employees",
  AddEmployee = "add:employee",
  RemoveEmployee = "remove:employee",
  
  // Inventory permissions
  ViewInventory = "view:inventory",
  AddItem = "add:item",
  EditItem = "edit:item",
  DeleteItem = "delete:item",
  
  // User management
  ViewUsers = "view:users",
  CreateUser = "create:user",
  EditUser = "edit:user",
  DeleteUser = "delete:user",
}

// Define role-based permissions
const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    // Admin has all permissions
    Permission.ViewShops, Permission.CreateShop, Permission.EditShop, Permission.DeleteShop,
    Permission.ViewEmployees, Permission.AddEmployee, Permission.RemoveEmployee,
    Permission.ViewInventory, Permission.AddItem, Permission.EditItem, Permission.DeleteItem,
    Permission.ViewUsers, Permission.CreateUser, Permission.EditUser, Permission.DeleteUser,
  ],
  owner: [
    // Owner can manage their own shops, employees, and inventory
    Permission.ViewShops, Permission.CreateShop, Permission.EditShop,
    Permission.ViewEmployees, Permission.AddEmployee, Permission.RemoveEmployee,
    Permission.ViewInventory, Permission.AddItem, Permission.EditItem, Permission.DeleteItem,
  ],
  user: [
    // Basic user with limited permissions
    Permission.ViewShops,
    Permission.ViewInventory,
  ],
}

/**
 * Check if a user has a specific permission
 * @param user - The user object
 * @param permission - The permission to check
 * @returns boolean indicating if the user has the permission
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false
  
  // Get permissions for the user's role
  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  
  return rolePermissions.includes(permission)
}

/**
 * Check if a user has any of the specified permissions
 * @param user - The user object
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if the user has any of the permissions
 */
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(user, permission))
}

/**
 * Check if a user has all of the specified permissions
 * @param user - The user object
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if the user has all of the permissions
 */
// lib/permissions.ts (continued)
/**
 * Check if a user has all of the specified permissions
 * @param user - The user object
 * @param permissions - Array of permissions to check
 * @returns boolean indicating if the user has all of the permissions
 */
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(user, permission))
  }
  
  /**
   * Get all permissions for a given role
   * @param role - User role
   * @returns Array of permissions for the role
   */
  export const getPermissionsForRole = (role: string): Permission[] => {
    return ROLE_PERMISSIONS[role] || []
  }
  
  /**
   * Check if a role has a specific permission
   * @param role - User role
   * @param permission - Permission to check
   * @returns boolean indicating if the role has the permission
   */
  export const roleHasPermission = (role: string, permission: Permission): boolean => {
    const permissions = ROLE_PERMISSIONS[role] || []
    return permissions.includes(permission)
  }