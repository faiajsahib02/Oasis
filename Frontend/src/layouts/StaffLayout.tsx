import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StaffNavbar from '../components/StaffNavbar';

const StaffLayout = () => {
  const { isStaff, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isStaff) {
    return <Navigate to="/stafflogin" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <StaffNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default StaffLayout;
