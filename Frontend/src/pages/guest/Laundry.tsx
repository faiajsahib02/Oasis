import { useState, useEffect } from 'react';
import { getLaundryMenu, getGuestLaundryRequests, createLaundryRequest } from '../../services/api';
import { LaundryItem, LaundryRequest } from '../../types';
import { getUserFromToken } from '../../utils/auth';
import { Shirt, Waves, Plus, Minus, ShoppingBag, Clock, AlertCircle } from 'lucide-react';

const LaundryPage = () => {
  const [menu, setMenu] = useState<LaundryItem[]>([]);
  const [activeRequests, setActiveRequests] = useState<LaundryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estimator State
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showEstimator, setShowEstimator] = useState(false);
  
  // Request Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();

    // Poll for request status updates every 10 seconds
    const interval = setInterval(() => {
      refreshRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshRequests = async () => {
    try {
      const requestsData = await getGuestLaundryRequests();
      const active = requestsData.filter(r => r.status !== 'DELIVERED');
      setActiveRequests(active);
    } catch (err) {
      console.error('Failed to refresh requests', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuData, requestsData] = await Promise.all([
        getLaundryMenu(),
        getGuestLaundryRequests()
      ]);
      
      // Deduplicate menu items by name
      const uniqueMenu = Array.from(new Map(menuData.map(item => [item.name, item])).values());
      setMenu(uniqueMenu);
      
      // Find all active requests (not delivered)
      const active = requestsData.filter(r => r.status !== 'DELIVERED');
      setActiveRequests(active);
      
    } catch (err) {
      console.error(err);
      setError('Failed to load laundry services.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const item = menu.find(i => i.id === Number(id));
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleSubmitRequest = async () => {
    const user = getUserFromToken();
    if (!user || !user.room_number) {
      setError('Could not identify guest room.');
      return;
    }

    setSubmitting(true);
    try {
      await createLaundryRequest({
        room_number: user.room_number,
        notes: notes
      });
      
      // Refresh data
      const requests = await getGuestLaundryRequests();
      const active = requests.filter(r => r.status !== 'DELIVERED');
      setActiveRequests(active);
      
      setIsModalOpen(false);
      setNotes('');
      setCart({}); // Clear estimator
    } catch (err) {
      console.error(err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COLLECTED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'WASHING': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'READY': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section with Background Image */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1489278353717-f64c6ee8a4d2?q=80&w=2070&auto=format&fit=crop")' 
          }}
        >
          <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 tracking-wide">
            Premium Laundry Service
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
            Professional care for your garments. Picked up from your room, returned fresh and crisp.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-accent hover:bg-accent-hover text-primary font-bold py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2 text-lg"
          >
            <ShoppingBag className="h-6 w-6" />
            Request Pickup
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 flex items-center border border-red-100">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Active Requests Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
              <Clock className="h-8 w-8 text-accent" />
              Your Requests
            </h2>
          </div>

          {activeRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Requests</h3>
              <p className="text-gray-500 mb-6">You haven't placed any laundry requests yet.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-accent hover:text-accent-hover font-medium"
              >
                Start a new request &rarr;
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Request Details</h4>
                      <p className="text-gray-900 font-medium">
                        Room {request.room_number}
                      </p>
                      {request.notes && (
                        <p className="text-gray-600 text-sm mt-2 bg-slate-50 p-3 rounded-lg">
                          "{request.notes}"
                        </p>
                      )}
                    </div>

                    {request.total_price > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-500">Total</span>
                        <span className="text-xl font-bold text-primary">
                          ${request.total_price.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Services Menu Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-primary flex items-center gap-3">
              <Shirt className="h-8 w-8 text-accent" />
              Our Services & Pricing
            </h2>
            <button
              onClick={() => setShowEstimator(!showEstimator)}
              className="text-accent hover:text-accent-hover font-medium"
            >
              {showEstimator ? 'Hide Estimator' : 'Show Estimator'}
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menu.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-accent font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>
                
                {showEstimator && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg">
                    <button 
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="p-1 hover:bg-white rounded-md transition-colors text-gray-500 hover:text-red-500"
                      disabled={!cart[item.id]}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">{cart[item.id] || 0}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors text-gray-500 hover:text-green-500"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {showEstimator && calculateTotal() > 0 && (
            <div className="fixed bottom-8 right-8 bg-white p-6 rounded-xl shadow-2xl border border-accent/20 z-40 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-8 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Estimated Total</p>
                  <p className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-accent hover:bg-accent-hover text-primary font-bold py-2 px-6 rounded-lg shadow-md transition-colors"
                >
                  Request Pickup
                </button>
              </div>
              <p className="text-xs text-gray-400 max-w-[200px]">
                *Final price will be confirmed upon weighing and inspection by our staff.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
            <h3 className="text-2xl font-serif font-bold text-primary mb-2">Request Laundry Pickup</h3>
            <p className="text-gray-500 mb-6">
              A staff member will come to your room to collect your laundry bag.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent min-h-[100px]"
                  placeholder="E.g., 'Please handle the silk shirt with care' or 'Pickup after 2 PM'"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-accent text-primary rounded-lg font-bold hover:bg-accent-hover transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Confirm Pickup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryPage;
