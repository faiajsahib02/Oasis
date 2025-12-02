import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Hotel, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const GuestNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-amber-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-amber-500" />
              <span className="font-serif text-2xl font-bold tracking-wider text-white">Ocean <span className="text-amber-500">Guest</span></span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/dashboard" className="hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
              <Link to="/laundry" className="hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Laundry</Link>
              <Link to="/dining" className="hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Dining</Link>
              <Link to="/housekeeping" className="hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">Housekeeping</Link>
              <Link to="/bill" className="hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">My Bill</Link>
              <button 
                onClick={handleLogout}
                className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
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
            <Link to="/dashboard" className="hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>
            <Link to="/laundry" className="hover:text-white block px-3 py-2 rounded-md text-base font-medium">Laundry</Link>
            <Link to="/dining" className="hover:text-white block px-3 py-2 rounded-md text-base font-medium">Dining</Link>
            <Link to="/housekeeping" className="hover:text-white block px-3 py-2 rounded-md text-base font-medium">Housekeeping</Link>
            <Link to="/bill" className="hover:text-white block px-3 py-2 rounded-md text-base font-medium">My Bill</Link>
            <button 
              onClick={handleLogout}
              className="w-full text-left flex items-center text-amber-500 hover:text-white px-3 py-2 rounded-md text-base font-medium"
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

export default GuestNavbar;
