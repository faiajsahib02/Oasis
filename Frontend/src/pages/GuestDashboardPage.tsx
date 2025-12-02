import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGuest } from '../services/api';
import { getToken, getUserFromToken } from '../utils/auth';
import { Guest } from '../types';
import { Wifi, Phone, Clock, Utensils, Shirt, Sparkles } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="text-red-600 mb-4">{error}</div>
        <button onClick={() => navigate('/login')} className="text-amber-600 hover:underline">Back to Login</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Top Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-serif font-bold text-slate-800">
            Good Evening, <span className="text-amber-600">{guest?.name}</span>
          </h1>
          <p className="text-slate-500 mt-1">Welcome to your personal guest portal.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Hero Card */}
        <div className="relative rounded-xl overflow-hidden shadow-xl h-64 md:h-80 group">
          <img 
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
            alt="Luxury Room" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-8">
            <h2 className="text-white text-3xl md:text-4xl font-serif font-bold">Room {guest?.room_number}</h2>
            <p className="text-amber-400 text-lg font-medium">Ocean View Suite</p> {/* Mocked Room Type */}
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 border-amber-500">
            <div className="bg-amber-50 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Check-out Time</p>
              <p className="text-xl font-bold text-slate-800">11:00 AM</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 border-amber-500">
            <div className="bg-amber-50 p-3 rounded-full">
              <Wifi className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Wifi Password</p>
              <p className="text-xl font-bold text-slate-800">Guest_Secure</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 border-amber-500">
            <div className="bg-amber-50 p-3 rounded-full">
              <Phone className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Front Desk</p>
              <p className="text-xl font-bold text-slate-800">Dial 0</p>
            </div>
          </div>
        </div>

        {/* Services Preview */}
        <div>
          <h3 className="text-2xl font-serif font-bold text-slate-800 mb-6">Guest Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <button 
              onClick={() => navigate('/laundry')}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group text-left"
            >
              <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                <Shirt className="h-6 w-6 text-slate-600 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Laundry</h4>
              <p className="text-slate-500 text-sm">Same-day dry cleaning and pressing services.</p>
            </button>

            <button 
              onClick={() => navigate('/dining')}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group text-left"
            >
              <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                <Utensils className="h-6 w-6 text-slate-600 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Room Service</h4>
              <p className="text-slate-500 text-sm">24/7 dining delivered straight to your door.</p>
            </button>

            <button 
              onClick={() => navigate('/housekeeping')}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group text-left"
            >
              <div className="bg-slate-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500 transition-colors">
                <Sparkles className="h-6 w-6 text-slate-600 group-hover:text-white" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Housekeeping</h4>
              <p className="text-slate-500 text-sm">Request extra towels, toiletries, or cleaning.</p>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default GuestDashboardPage;
