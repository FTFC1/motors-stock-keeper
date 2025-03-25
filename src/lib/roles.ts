import { UserResource } from "@clerk/types";

// Define available roles
export type UserRole = "admin" | "manager" | "user";

// Check if user has a specific role
export function hasRole(user: UserResource | null | undefined, role: UserRole): boolean {
  if (!user) return false;
  
  // Check unsafe metadata for role
  const userRole = user.unsafeMetadata?.role as UserRole | undefined;
  
  // For admin role, also check the email address as a fallback
  if (role === "admin" && !userRole) {
    const email = user.primaryEmailAddress?.emailAddress;
    if (email && email === "nicholas.f@mikano-intl.com") {
      return true;
    }
  }
  
  return userRole === role;
}

// Helper function to check if user is admin
export function isAdmin(user: UserResource | null | undefined): boolean {
  return hasRole(user, "admin");
}

// Helper function to check if user is manager
export function isManager(user: UserResource | null | undefined): boolean {
  return hasRole(user, "manager");
} 