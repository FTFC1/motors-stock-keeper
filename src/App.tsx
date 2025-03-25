import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import { SupabaseSync } from "@/lib/clerk-supabase";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { SearchProvider } from './context/SearchContext';

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Simple protected route component that doesn't require a separate file
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    // Set a timeout to prevent infinite loading if auth service is unreachable
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.warn(
          "Authentication service is taking too long, may be unreachable",
        );
        setAuthTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!isLoaded && !authTimeout) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If we've timed out or auth failed, redirect to login
  if (authTimeout || !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Create query client for React Query
const queryClient = new QueryClient();

// Error boundary component
function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-6">There was an error loading the application.</p>
      <button
        className="px-4 py-2 bg-primary text-white rounded-md"
        onClick={() => window.location.reload()}
      >
        Try again
      </button>
    </div>
  );
}

// Basic login page that doesn't require Clerk to load
function BasicLoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">RT Inventory</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Loading authentication service...
            </p>
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              If the login form doesn't appear, please try refreshing the page
            </p>
            <button
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <div className="text-center pt-2">
              <a href="/" className="text-sm text-primary hover:underline">
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper that handles routes differently based on path
function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("/login");

  // Skip Clerk entirely for login page
  if (isLoginPage) {
    return <Login />;
  }

  return (
    <>
      <ClerkLoading>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ClerkLoading>

      <ClerkLoaded>
        {/* Only sync with Supabase if not on login page */}
        <SupabaseSync />

        <Routes>
          <Route path="/" element={<Index />} />

          {/* Login page is handled separately above */}
          <Route path="/login/*" element={<Navigate to="/login" replace />} />

          <Route
            path="/signup/*"
            element={
              <SignedOut>
                <Signup />
              </SignedOut>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ClerkLoaded>
    </>
  );
}

const App = () => {
  return (
    <SearchProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Define routes at the top level so login page doesn't depend on Clerk */}
            <Routes>
              <Route path="/login/*" element={<Login />} />
              <Route path="/*" element={<AppContent />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SearchProvider>
  );
};

export default App;
