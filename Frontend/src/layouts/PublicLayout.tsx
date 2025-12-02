import { Link, Outlet } from 'react-router-dom';
import { Menu, X, Hotel } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-accent" />
              <span className="font-serif text-2xl font-bold tracking-wider">Ocean Paradise</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/rooms" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">Rooms</Link>
              <Link to="/about" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">About</Link>
              <Link to="/login" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">Guest Login</Link>
              <Link to="/stafflogin" className="hover:text-accent transition-colors px-3 py-2 rounded-md text-sm font-medium">Staff Access</Link>
              <Link to="/contact" className="bg-accent hover:bg-accent-hover text-primary font-bold px-4 py-2 rounded-md transition-colors">Book Now</Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/rooms" className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Rooms</Link>
            <Link to="/about" className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium">About</Link>
            <Link to="/login" className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Guest Login</Link>
            <Link to="/staff/check-in" className="hover:text-accent block px-3 py-2 rounded-md text-base font-medium">Staff Access</Link>
            <Link to="/contact" className="block w-full text-center bg-accent text-primary font-bold px-4 py-2 rounded-md mt-4">Book Now</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-primary-light text-gray-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-white text-lg font-serif font-bold mb-4">Ocean Paradise</h3>
        <p className="text-sm">Experience the pinnacle of luxury and relaxation at our 5-star oceanfront resort.</p>
      </div>
      <div>
        <h3 className="text-white text-lg font-serif font-bold mb-4">Contact</h3>
        <p className="text-sm">123 Ocean Drive, Paradise City</p>
        <p className="text-sm">+1 (555) 123-4567</p>
        <p className="text-sm">info@oceanparadise.com</p>
      </div>
      <div>
        <h3 className="text-white text-lg font-serif font-bold mb-4">Links</h3>
        <ul className="space-y-2 text-sm">
          <li><Link to="/privacy" className="hover:text-accent">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-accent">Terms of Service</Link></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-gray-700 text-center text-xs">
      &copy; {new Date().getFullYear()} Ocean Paradise Hotel. All rights reserved.
    </div>
  </footer>
);

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
