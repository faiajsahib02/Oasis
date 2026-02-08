import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuest } from '../services/api';
import { getToken, getUserFromToken } from '../utils/auth';
import { Guest } from '../types';
import { Wifi, Calendar, Utensils, Shirt, Sparkles, CreditCard, LogOut, ChevronRight, MapPin, Clock as ClockIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const GuestDashboardPage = () => {
  const navigate = useNavigate();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGuestDetails = async () => {
      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const decoded = getUserFromToken();
      if (!decoded || !decoded.sub) {
        setError('Invalid session. Please login again.');
        setLoading(false);
        return;
      }

      try {
        const data = await getGuest(decoded.sub);
        setGuest(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load guest details.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuestDetails();
  }, [navigate]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border border-slate-200 border-t-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => navigate('/login')} className="text-slate-600 hover:text-slate-900 underline">Back to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <div className="border-b border-slate-200 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm tracking-widest text-slate-500 uppercase">Guest Portal</p>
              <h1 className="text-4xl font-light text-slate-900 mt-2">{guest?.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-3xl font-light text-slate-400">Room {guest?.room_number}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Image Section */}
      <div className="w-full h-64 md:h-80 overflow-hidden bg-slate-100">
        <img 
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
          alt="Room" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Stay Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <StayInfoBox 
              label="Check-in"
              value={formatDate(guest?.check_in_date || '')}
              detail="2:00 PM"
              icon={<Calendar className="w-5 h-5" />}
            />
            <StayInfoBox 
              label="Check-out"
              value={formatDate(guest?.check_out_date || '')}
              detail="11:00 AM"
              icon={<LogOut className="w-5 h-5" />}
            />
            <StayInfoBox 
              label="Wi-Fi Network"
              value="OceanGuest_Premium"
              detail="Password: paradise2025"
              icon={<Wifi className="w-5 h-5" />}
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100"></div>

          {/* Services Section */}
          <div>
            <p className="text-xs tracking-widest text-slate-500 uppercase mb-8">Services</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MinimalServiceCard
                icon={<Utensils className="w-6 h-6" />}
                title="Dining"
                onClick={() => navigate('/dining')}
              />
              <MinimalServiceCard
                icon={<Shirt className="w-6 h-6" />}
                title="Laundry"
                onClick={() => navigate('/laundry')}
              />
              <MinimalServiceCard
                icon={<Sparkles className="w-6 h-6" />}
                title="Housekeeping"
                onClick={() => navigate('/housekeeping')}
              />
              <MinimalServiceCard
                icon={<CreditCard className="w-6 h-6" />}
                title="Bill"
                onClick={() => navigate('/bill')}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100"></div>

          {/* Amenities Highlight */}
          <div>
            <p className="text-xs tracking-widest text-slate-500 uppercase mb-8">Resort Amenities</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="py-6">
                <p className="text-2xl font-light text-slate-900">✓</p>
                <p className="text-sm text-slate-600 mt-2">Ocean View</p>
              </div>
              <div className="py-6">
                <p className="text-2xl font-light text-slate-900">✓</p>
                <p className="text-sm text-slate-600 mt-2">Spa Access</p>
              </div>
              <div className="py-6">
                <p className="text-2xl font-light text-slate-900">✓</p>
                <p className="text-sm text-slate-600 mt-2">Concierge</p>
              </div>
              <div className="py-6">
                <p className="text-2xl font-light text-slate-900">✓</p>
                <p className="text-sm text-slate-600 mt-2">24/7 Service</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t border-slate-100 pt-12">
            <p className="text-xs tracking-widest text-slate-500 uppercase mb-6">Need Assistance?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Front Desk</p>
                  <p className="text-sm text-slate-600">Dial 0 from your room</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <ClockIcon className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Hours</p>
                  <p className="text-sm text-slate-600">24 hours • 7 days</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Wifi className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">Support</p>
                  <p className="text-sm text-slate-600">Email: guest@ocean.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface StayInfoBoxProps {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}

const StayInfoBox = ({ label, value, detail, icon }: StayInfoBoxProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-slate-400">
        {icon}
        <span className="text-xs tracking-widest uppercase">{label}</span>
      </div>
      <p className="text-2xl font-light text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{detail}</p>
    </div>
  );
};

interface MinimalServiceCardProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

const MinimalServiceCard = ({ icon, title, onClick }: MinimalServiceCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group text-left p-6 border border-slate-200 hover:border-slate-900 transition-all duration-300 bg-white hover:bg-slate-50"
    >
      <div className="text-slate-400 group-hover:text-slate-900 transition-colors mb-3">
        {icon}
      </div>
      <h3 className="font-light text-slate-900 group-hover:text-slate-700">{title}</h3>
      <div className="mt-3 flex items-center text-slate-300 group-hover:text-slate-600 transition-colors">
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.button>
  );
};

export default GuestDashboardPage;
