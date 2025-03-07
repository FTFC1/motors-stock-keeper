import { Header } from "./Header";
import { MobileHeader } from "./MobileHeader";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
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
  const { isAuthenticated, isLoading } = useAuth();
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
  if (isLoading) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        data-oid="8.rp_s8"
      >
        <div className="flex flex-col items-center gap-2" data-oid="9yasamw">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            data-oid="g2a2hv-"
          ></div>
          <p className="text-sm text-muted-foreground" data-oid="yrmt2e9">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace data-oid=":_frpa-" />;
  }

  // Render page with header and sidebar if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col" data-oid="j01ls69">
        {isMobile ? (
          <MobileHeader
            title={title}
            onMenuClick={() => setIsSidebarOpen(true)}
            isScrolled={isScrolled}
            data-oid="i7y-xrl"
          />
        ) : (
          <Header data-oid="f:f4ykm" />
        )}
        <div className="flex flex-1 relative" data-oid="8n08-od">
          <Sidebar
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            data-oid="l.zzitx"
          />

          <main
            className="flex-1 overflow-y-auto p-4 lg:p-6"
            data-oid="4:5yfga"
          >
            <div className="mx-auto max-w-6xl" data-oid="sh.ai5c">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Just render children if no auth required
  return <>{children}</>;
}
