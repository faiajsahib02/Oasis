import { useState, useEffect } from 'react';
import { getActiveOrders, updateRestaurantOrderStatus } from '../../services/api';
import { KitchenOrder } from '../../types';
import { Clock, CheckCircle, ChefHat, Utensils } from 'lucide-react';

const KitchenDisplay = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const data = await getActiveOrders();
      setOrders(data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (orderId: number, currentStatus: string) => {
    let newStatus = '';
    if (currentStatus === 'RECEIVED') newStatus = 'PREPARING';
    else if (currentStatus === 'PREPARING') newStatus = 'READY';
    else if (currentStatus === 'READY') newStatus = 'DELIVERED';

    if (!newStatus) return;

    try {
      // Optimistic update
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ).filter(o => newStatus !== 'DELIVERED' || o.id !== orderId)); // Remove if delivered

      await updateRestaurantOrderStatus(orderId, newStatus);
      fetchOrders(); // Sync with server
    } catch (err) {
      console.error(err);
      setError('Failed to update status');
      fetchOrders(); // Revert on error
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}h ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'border-red-500 bg-red-50';
      case 'PREPARING': return 'border-amber-500 bg-amber-50';
      case 'READY': return 'border-green-500 bg-green-50';
      default: return 'border-slate-200 bg-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'bg-red-100 text-red-800';
      case 'PREPARING': return 'bg-amber-100 text-amber-800';
      case 'READY': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Live Kitchen Feed</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live Updates (10s)
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <Utensils className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900">No Active Orders</h3>
            <p className="text-slate-500">The kitchen is clear!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className={`rounded-xl border-l-4 shadow-sm p-6 flex flex-col h-full transition-all duration-300 ${getStatusColor(order.status)} bg-white`}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-200/60">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Room</span>
                    <h2 className="text-4xl font-bold text-slate-900">{order.room_number}</h2>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-1 ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimeAgo(order.created_at)}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 space-y-3 mb-6">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <span className="font-bold text-slate-900 min-w-[1.5rem]">{item.quantity}x</span>
                        <span className="text-slate-800 font-medium">{item.name}</span>
                      </div>
                    </div>
                  ))}
                  
                  {order.notes && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <span className="text-xs font-bold text-red-800 uppercase block mb-1">Notes from Guest:</span>
                      <p className="text-sm text-red-700 italic font-medium">{order.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleStatusUpdate(order.id, order.status)}
                  className={`w-full py-3 rounded-lg font-bold text-white shadow-sm transition-colors flex items-center justify-center gap-2
                    ${order.status === 'RECEIVED' ? 'bg-slate-900 hover:bg-slate-800' : ''}
                    ${order.status === 'PREPARING' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                    ${order.status === 'READY' ? 'bg-green-600 hover:bg-green-700' : ''}
                  `}
                >
                  {order.status === 'RECEIVED' && 'Start Cooking'}
                  {order.status === 'PREPARING' && 'Order Up / Ready'}
                  {order.status === 'READY' && (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Picked Up
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
