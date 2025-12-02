import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Hotel, LogOut, Shirt, Users, ChefHat, Utensils, Brush, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StaffNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/stafflogin');
  };

  const isActive = (path: string) => location.pathname === path;

  const getLinkClass = (path: string) => {
    const baseClass = "px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2";
    return `${baseClass} ${isActive(path) 
      ? "bg-slate-800 text-white" 
      : "hover:text-white hover:bg-slate-800"}`;
  };

  const getMobileLinkClass = (path: string) => {
    const baseClass = "block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2";
    return `${baseClass} ${isActive(path)
      ? "bg-slate-800 text-white"
      : "hover:text-white hover:bg-slate-800"}`;
  };

  return (
    <nav className="bg-slate-900 text-amber-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-amber-500" />
              <span className="font-serif text-2xl font-bold tracking-wider text-white">Ocean <span className="text-amber-500">Admin</span></span>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/admin/laundry" className={getLinkClass('/admin/laundry')}>
                <Shirt className="h-4 w-4" />
                Laundry Manager
              </Link>
              <Link to="/admin/housekeeping" className={getLinkClass('/admin/housekeeping')}>
                <Brush className="h-4 w-4" />
                Housekeeping
              </Link>
              <Link to="/admin/kitchen" className={getLinkClass('/admin/kitchen')}>
                <ChefHat className="h-4 w-4" />
                Kitchen Display
              </Link>
              <Link to="/admin/menu" className={getLinkClass('/admin/menu')}>
                <Utensils className="h-4 w-4" />
                Menu Manager
              </Link>
              <Link to="/admin/register" className={getLinkClass('/admin/register')}>
                <Users className="h-4 w-4" />
                Register Guest
              </Link>
              <Link to="/admin/checkout" className={getLinkClass('/admin/checkout')}>
                <CreditCard className="h-4 w-4" />
                Checkout
              </Link>
              
              <div className="ml-4 border-l border-slate-700 pl-4 flex items-center gap-4">
                <span className="text-sm text-slate-400">
                  {user?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-amber-500 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-3 py-2 text-sm text-slate-400 border-b border-slate-700 mb-2">
              Logged in as {user?.name}
            </div>
            <Link to="/admin/laundry" className={getMobileLinkClass('/admin/laundry')}>
              <Shirt className="h-4 w-4" />
              Laundry Manager
            </Link>
            <Link to="/admin/housekeeping" className={getMobileLinkClass('/admin/housekeeping')}>
              <Brush className="h-4 w-4" />
              Housekeeping
            </Link>
            <Link to="/admin/kitchen" className={getMobileLinkClass('/admin/kitchen')}>
              <ChefHat className="h-4 w-4" />
              Kitchen Display
            </Link>
            <Link to="/admin/menu" className={getMobileLinkClass('/admin/menu')}>
              <Utensils className="h-4 w-4" />
              Menu Manager
            </Link>
            <Link to="/admin/register" className={getMobileLinkClass('/admin/register')}>
              <Users className="h-4 w-4" />
              Register Guest
            </Link>
            <Link to="/admin/checkout" className={getMobileLinkClass('/admin/checkout')}>
              <CreditCard className="h-4 w-4" />
              Checkout
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full text-left flex items-center text-amber-500 hover:text-white px-3 py-2 rounded-md text-base font-medium mt-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default StaffNavbar;
