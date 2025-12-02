import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantMenu, createRestaurantOrder, getGuestRestaurantOrders } from '../../services/api';
import { CategoryWithItems, MenuItem, RestaurantOrder } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Plus, Minus, X, UtensilsCrossed, AlertCircle, CheckCircle, Clock, ChefHat } from 'lucide-react';

const DiningPage = () => {
  const [menu, setMenu] = useState<CategoryWithItems[]>([]);
  const [orders, setOrders] = useState<RestaurantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<number>(0);
  
  // Cart State: { itemId: quantity }
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const categoryRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetchMenu();
    fetchOrders();
    // Poll for order status updates every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantMenu();
      setMenu(data);
      if (data.length > 0) {
        setActiveCategory(data[0].category.id);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getGuestRestaurantOrders();
      // Filter out delivered orders so they disappear from the active view
      const activeOrders = (data || []).filter(order => order.status !== 'DELIVERED');
      setOrders(activeOrders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const scrollToCategory = (catId: number) => {
    setActiveCategory(catId);
    const element = categoryRefs.current[catId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const updateCart = (itemId: number, delta: number) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const getCartTotal = () => {
    let count = 0;
    let total = 0;
    
    Object.entries(cart).forEach(([itemId, qty]) => {
      const item = findItem(Number(itemId));
      if (item) {
        count += qty;
        total += item.price * qty;
      }
    });
    
    return { count, total };
  };

  const findItem = (id: number): MenuItem | undefined => {
    for (const cat of menu) {
      const item = cat.items.find(i => i.id === id);
      if (item) return item;
    }
    return undefined;
  };

  const handlePlaceOrder = async () => {
    if (!user?.room_number) {
      setError('Room number not found. Please re-login.');
      return;
    }

    setSubmitting(true);
    try {
      const items = Object.entries(cart).map(([id, qty]) => ({
        item_id: Number(id),
        quantity: qty
      }));

      await createRestaurantOrder({
        room_number: user.room_number,
        notes,
        items
      });

      setOrderSuccess(true);
      setCart({});
      setNotes('');
      setIsCartOpen(false);
      
      // Refresh orders list
      fetchOrders();
      
      // Return to menu after 3 seconds
      setTimeout(() => {
        setOrderSuccess(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PREPARING': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'READY': return 'bg-green-100 text-green-800 border-green-200';
      case 'DELIVERED': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PREPARING': return <ChefHat className="h-4 w-4 mr-1" />;
      case 'READY': return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4 mr-1" />;
      default: return <Clock className="h-4 w-4 mr-1" />;
    }
  };

  if (loading && menu.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Order Received!</h2>
          <p className="text-slate-500 mb-6">
            The kitchen has received your order and will begin preparation shortly.
          </p>
          <p className="text-sm text-slate-400">Returning to menu...</p>
        </div>
      </div>
    );
  }

  const { count: cartCount, total: cartTotal } = getCartTotal();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop")' 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">In-Room Dining</h1>
            <p className="text-white/90 text-lg">Exquisite flavors delivered to your door.</p>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      )}

      {/* Active Orders Section */}
      {orders.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Orders</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-sm text-slate-500">Order #{order.id}</span>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-slate-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-900">Total</span>
                  <span className="text-sm font-bold text-amber-600">${order.total_price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Category Tabs */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4 min-w-max">
            {menu.map((cat) => (
              <button
                key={cat.category.id}
                onClick={() => scrollToCategory(cat.category.id)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors pb-1 border-b-2 ${
                  activeCategory === cat.category.id
                    ? 'text-amber-600 border-amber-600'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                {cat.category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {menu.map((cat) => (
          <div 
            key={cat.category.id} 
            ref={(el) => (categoryRefs.current[cat.category.id] = el)}
            className="scroll-mt-24"
          >
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">{cat.category.name}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="w-full h-48 sm:w-32 sm:h-auto flex-shrink-0 bg-slate-200 relative">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover absolute inset-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'; // Fallback
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 absolute inset-0">
                        <UtensilsCrossed className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-900 line-clamp-1">{item.name}</h3>
                        <span className="text-amber-600 font-bold whitespace-nowrap">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      {cart[item.id] ? (
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                          <button 
                            onClick={() => updateCart(item.id, -1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus className="h-4 w-4 text-slate-600" />
                          </button>
                          <span className="w-8 text-center font-medium text-sm">{cart[item.id]}</span>
                          <button 
                            onClick={() => updateCart(item.id, 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateCart(item.id, 1)}
                          className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-40">
          <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4">
              <div className="bg-amber-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-slate-300">Total</span>
                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-slate-100 transition-colors"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold text-slate-900">Your Order</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {Object.entries(cart).map(([itemId, qty]) => {
                const item = findItem(Number(itemId));
                if (!item) return null;
                return (
                  <div key={itemId} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-600">
                        {qty}x
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">${(item.price * qty).toFixed(2)}</span>
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button 
                          onClick={() => updateCart(item.id, -1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Minus className="h-3 w-3 text-slate-600" />
                        </button>
                        <button 
                          onClick={() => updateCart(item.id, 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Plus className="h-3 w-3 text-slate-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Special Instructions / Allergies
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., No onions, extra sauce..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none min-h-[80px]"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center text-sm">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Total Amount</span>
                <span className="text-2xl font-bold text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiningPage;
