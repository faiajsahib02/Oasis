import { Outlet } from 'react-router-dom';
import GuestNavbar from '../components/GuestNavbar';

const GuestLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GuestNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
