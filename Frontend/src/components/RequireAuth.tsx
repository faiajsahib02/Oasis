import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  role?: UserRole;
}

const RequireAuth = ({ children, role }: RequireAuthProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login based on attempted path
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/staff')) {
      return <Navigate to="/stafflogin" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    // Role mismatch
    if (user?.role === 'staff') {
      return <Navigate to="/admin/laundry" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default RequireAuth;
