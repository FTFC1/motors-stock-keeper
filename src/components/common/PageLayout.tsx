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
        data-oid="k5unp83"
      >
        <div className="flex flex-col items-center gap-2" data-oid="m.5_t4-">
          <div
            className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"
            data-oid="rjn7yvh"
          ></div>
          <p className="text-sm text-muted-foreground" data-oid="-cpdzhs">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace data-oid="fhhsegy" />;
  }

  // Render page with header and sidebar if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col" data-oid="ante.br">
        {isMobile ? (
          <MobileHeader
            title={title}
            onMenuClick={() => setIsSidebarOpen(true)}
            isScrolled={isScrolled}
            data-oid="z2jomhj"
          />
        ) : (
          <Header data-oid="alcacha" />
        )}
        <div className="flex flex-1 relative" data-oid="pg1d4l-">
          <Sidebar
            isOpen={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            data-oid="dn78-0p"
          />

          <main
            className="flex-1 overflow-y-auto p-4 lg:p-6"
            data-oid="7l4f30n"
          >
            <div className="mx-auto max-w-6xl" data-oid=".0x23qm">
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
