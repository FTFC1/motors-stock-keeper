import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  title?: string;
}

export function PageLayout({
  children,
  requireAuth = true,
  title = "Motors Stock Manager",
}: PageLayoutProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Check if the viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll position for condensed header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show loading state if auth is being checked
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if auth is required but user is not signed in
  if (requireAuth && !isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Render page with header and sidebar if authenticated
  if (isSignedIn || !requireAuth) {
    return (
      <div className="flex min-h-screen flex-col">
        {isMobile ? (
          <MobileHeader
            title={title}
            onMenuClick={() => setIsSidebarOpen(true)}
            isScrolled={isScrolled}
          />
        ) : (
          <Header />
        )}
        <div className="flex flex-1 relative">
          {isSignedIn && (
            <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
          )}

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // This should never happen since we're handling all cases above
  return <>{children}</>;
}
