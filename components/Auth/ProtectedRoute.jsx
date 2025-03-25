import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Spinner, Center, Text } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";

// Protected route wrapper that requires authentication
export default function ProtectedRoute({
  children,
  requiredRoles = [], // Array of allowed roles, empty means any authenticated user
}) {
  const { user, profile, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push("/login");
    }

    // If user exists and roles are required, check permissions
    if (!loading && user && profile && requiredRoles.length > 0) {
      // Admins can access everything
      if (isAdmin) return;

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.includes(profile.role);

      if (!hasRequiredRole) {
        // Redirect to unauthorized page if user doesn't have required role
        router.push("/unauthorized");
      }
    }
  }, [user, profile, loading, requiredRoles, router, isAdmin]);

  // Show loading state
  if (loading) {
    return (
      <Center height="100vh">
        <Box textAlign="center">
          <Spinner size="xl" color="blue.500" mb={4} />
          <Text>Loading...</Text>
        </Box>
      </Center>
    );
  }

  // If no user or required roles not met, don't render children
  if (
    !user ||
    (requiredRoles.length > 0 &&
      !isAdmin &&
      !requiredRoles.includes(profile?.role))
  ) {
    return null;
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
}
