
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function PageLayout({ children, requireAuth = true }: PageLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading state if auth is being checked
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if auth is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render page with header and sidebar if authenticated
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  // Just render children if no auth required
  return <>{children}</>;
}
