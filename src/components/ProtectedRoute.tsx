import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, profile, isAdmin, isLoading } = useAuth();

  // Only block while loading if we don't have a session yet.
  // This avoids full-page loader flashes on token refresh/tab focus.
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // For admin routes, deny access if profile is missing or not admin
  if (requireAdmin) {
    if (!profile && isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen px-4">
          <p className="text-sm text-muted-foreground text-center">
            Verifying admin access...
          </p>
        </div>
      );
    }

    if (!profile || !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
