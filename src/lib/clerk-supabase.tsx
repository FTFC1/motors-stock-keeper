import { createContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { supabase, createClerkSupabaseClient } from "./supabase";

/**
 * This component synchronizes the Clerk user with Supabase
 * It ensures that:
 * 1. The Supabase JWT is refreshed when needed
 * 2. User metadata is synchronized between Clerk and Supabase
 */
export function SupabaseSync() {
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const [lastSyncedUserId, setLastSyncedUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || !user) return;

    // Skip if we've already synced this user
    if (lastSyncedUserId === userId) return;

    async function syncUserWithSupabase() {
      try {
        // Get a JWT for Supabase from Clerk
        let supabaseAccessToken;
        let authClient;

        try {
          console.log("Attempting to get Supabase JWT from Clerk...");
          supabaseAccessToken = await getToken({ template: "supabase" });

          if (supabaseAccessToken) {
            console.log("Successfully retrieved Supabase JWT from Clerk");

            // Create a new client with the token in Authorization header
            // This is more reliable than trying to set a session
            authClient = createClerkSupabaseClient(supabaseAccessToken);
            console.log("Created auth client with JWT token");
          } else {
            console.warn(
              "No Supabase JWT template found in Clerk configuration",
            );
          }
        } catch (error) {
          console.error("Error getting Supabase JWT from Clerk:", error);
          console.log(
            "Using anonymous access for Supabase to avoid JWT issues",
          );
        }

        try {
          // Use the auth client if available, otherwise fall back to anon client
          const client = authClient || supabase;

          // Generate a UUID from the Clerk user ID to use as the Supabase profile ID
          // First check if the user profile already exists
          const { data: existingProfile } = await client
            .from("user_profiles")
            .select("*")
            .eq("clerk_id", userId)
            .maybeSingle();

          // Create or update the user profile in Supabase
          const userData = {
            // If the profile exists, use its ID, otherwise use null to let Supabase generate a UUID
            id: existingProfile?.id || undefined,
            first_name: user.firstName,
            last_name: user.lastName,
            clerk_id: userId, // Store the Clerk ID as a separate field
            avatar_url: user.imageUrl,
            // Add role from unsafeMetadata if available
            role: user.unsafeMetadata?.role || "user",
            updated_at: new Date().toISOString(),
          };

          // Try to upsert the user profile with RLS bypassed
          console.log("Attempting to upsert user profile...");
          const { data, error } = await client
            .from("user_profiles")
            .upsert(userData)
            .select()
            .single();

          if (error) {
            console.error("Error upserting user profile:", error);

            // If we get an RLS error, try a second approach with separate insert/update
            if (error.code === "42501") {
              console.log("RLS error detected, trying alternative approach...");

              // First check if the profile exists
              if (existingProfile) {
                // Try to update
                const { error: updateError } = await client
                  .from("user_profiles")
                  .update({
                    first_name: user.firstName,
                    last_name: user.lastName,
                    avatar_url: user.imageUrl,
                    role: user.unsafeMetadata?.role || "user",
                    updated_at: new Date().toISOString(),
                  })
                  .eq("clerk_id", userId);

                if (updateError) {
                  console.error(
                    "Error updating existing profile:",
                    updateError,
                  );
                } else {
                  console.log("Successfully updated existing profile");
                  setLastSyncedUserId(userId);
                }
              } else {
                // Try to insert
                const { error: insertError } = await client
                  .from("user_profiles")
                  .insert(userData);

                if (insertError) {
                  console.error("Error inserting new profile:", insertError);
                } else {
                  console.log("Successfully inserted new user profile");
                  setLastSyncedUserId(userId);
                }
              }
            }
          } else {
            console.log("👤 User profile created/updated in Supabase", data);
            setLastSyncedUserId(userId);
          }
        } catch (error) {
          console.error("Error managing user profile:", error);
        }
      } catch (error) {
        console.error("Error synchronizing user with Supabase:", error);
      }
    }

    syncUserWithSupabase();
  }, [userId, user, getToken, lastSyncedUserId]);

  return null;
}

// Create a context for Supabase authentication status
export const SupabaseAuthContext = createContext<{ isAuthenticated: boolean }>({
  isAuthenticated: false,
});

/**
 * Provider component that wraps the app and provides Supabase authentication status
 */
export function SupabaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!userId);
  }, [userId]);

  return (
    <SupabaseAuthContext.Provider value={{ isAuthenticated }}>
      {children}
      <SupabaseSync />
    </SupabaseAuthContext.Provider>
  );
}

/**
 * Check if a user is an admin based on their Clerk metadata
 */
export function isAdmin(user: any): boolean {
  if (!user) return false;

  // First check unsafeMetadata
  if (user.unsafeMetadata?.role === "admin") {
    return true;
  }

  // Then check publicMetadata as fallback
  if (user.publicMetadata?.role === "admin") {
    return true;
  }

  return false;
}
