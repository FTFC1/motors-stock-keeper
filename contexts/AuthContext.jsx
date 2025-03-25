import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase, { getCurrentUser, signOut } from "../lib/supabase";

// Create authentication context
const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  isAdmin: false,
  isManager: false,
  isSalesAgent: false,
  isServiceTech: false,
});

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { user: currentUser, error } = await getCurrentUser();

          if (error) {
            console.error("Error fetching user:", error);
            setUser(null);
            setProfile(null);
          } else {
            setUser(currentUser);
            setProfile(currentUser?.profile);
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const { user: currentUser } = await getCurrentUser();
          setUser(currentUser);
          setProfile(currentUser?.profile);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      },
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // User role helpers
  const isAdmin = profile?.role === "admin";
  const isManager = profile?.role === "manager";
  const isSalesAgent = profile?.role === "sales_agent";
  const isServiceTech = profile?.role === "service_tech";

  const value = {
    user,
    profile,
    loading,
    signOut: handleSignOut,
    isAdmin,
    isManager,
    isSalesAgent,
    isServiceTech,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook for using auth context
export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
