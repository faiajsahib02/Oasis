import { useState, useEffect } from 'react';
import { getAllLaundryRequests, getLaundryMenu, addItemsToLaundryRequest, updateLaundryStatus } from '../../services/api';
import { LaundryItem, LaundryRequest } from '../../types';
import { Shirt, Clock, CheckCircle, Package, Truck, Plus, Minus, X, DollarSign, AlertCircle, Sparkles } from 'lucide-react';

interface ItemQuantity {
  [itemId: number]: number;
}

const LaundryManager = () => {
  const [requests, setRequests] = useState<LaundryRequest[]>([]);
  const [menu, setMenu] = useState<LaundryItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<LaundryRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Billing Modal State
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<ItemQuantity>({});
  const [submittingBill, setSubmittingBill] = useState(false);

  useEffect(() => {
    fetchData();

    // Poll for new requests every 10 seconds
    const interval = setInterval(() => {
      refreshRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const refreshRequests = async () => {
    try {
      const requestsData = await getAllLaundryRequests();
      setRequests(requestsData);
    } catch (err) {
      console.error('Failed to refresh requests', err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestsData, menuData] = await Promise.all([
        getAllLaundryRequests(),
        getLaundryMenu()
      ]);
      setRequests(requestsData);
      // Deduplicate menu by name
      const uniqueMenu = Array.from(new Map(menuData.map(item => [item.name, item])).values());
      setMenu(uniqueMenu);
    } catch (err) {
      console.error(err);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: number, newStatus: string) => {
    try {
      setError('');
      await updateLaundryStatus(requestId, newStatus);
      // Refresh data
      const updatedRequests = await getAllLaundryRequests();
      setRequests(updatedRequests);
      // Update selected request
      const updated = updatedRequests.find(r => r.id === requestId);
      setSelectedRequest(updated || null);
    } catch (err) {
      console.error(err);
      setError('Failed to update status.');
    }
  };

  // Billing Modal Handlers
  const openBillingModal = () => {
    setItemQuantities({});
    setShowBillingModal(true);
  };

  const closeBillingModal = () => {
    setShowBillingModal(false);
    setItemQuantities({});
  };

  const incrementItem = (itemId: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const decrementItem = (itemId: number) => {
    setItemQuantities(prev => {
      const current = prev[itemId] || 0;
      if (current <= 0) return prev;
      const newVal = current - 1;
      if (newVal === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newVal };
    });
  };

  const getTotalItems = () => {
    return Object.values(itemQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getEstimatedTotal = () => {
    return Object.entries(itemQuantities).reduce((sum, [itemId, qty]) => {
      const item = menu.find(m => m.id === Number(itemId));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleConfirmBill = async () => {
    if (!selectedRequest || getTotalItems() === 0) return;

    setSubmittingBill(true);
    setError('');
    try {
      // Prepare items payload
      const payload = Object.entries(itemQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([itemId, qty]) => ({
          item_id: Number(itemId),
          quantity: qty
        }));

      // Add items to request
      await addItemsToLaundryRequest(selectedRequest.id, payload);

      // Auto-advance to WASHING status
      await updateLaundryStatus(selectedRequest.id, 'WASHING');

      // Close modal and refresh
      closeBillingModal();
      const updatedRequests = await getAllLaundryRequests();
      setRequests(updatedRequests);
      const updated = updatedRequests.find(r => r.id === selectedRequest.id);
      setSelectedRequest(updated || null);
    } catch (err) {
      console.error(err);
      setError('Failed to submit bill.');
    } finally {
      setSubmittingBill(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'COLLECTED': 'bg-blue-100 text-blue-800 border-blue-300',
      'WASHING': 'bg-indigo-100 text-indigo-800 border-indigo-300',
      'READY': 'bg-green-100 text-green-800 border-green-300',
      'DELIVERED': 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-800 text-white py-4 px-6 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center">
          <Shirt className="h-6 w-6 mr-3" />
          Staff Laundry Portal
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage guest laundry requests</p>
      </div>

      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Column: Incoming Feed */}
        <div className="w-1/3 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Incoming Requests
            </h2>
            <p className="text-sm text-slate-500">{requests.filter(r => r.status !== 'DELIVERED').length} active</p>
          </div>

          <div className="divide-y divide-slate-100">
            {requests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No laundry requests yet.
              </div>
            ) : (
              requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => {
                    setSelectedRequest(req);
                    setError('');
                  }}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                    selectedRequest?.id === req.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-800">Room {req.room_number}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(req.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  {req.notes && (
                    <p className="text-sm text-slate-600 mt-2 truncate">"{req.notes}"</p>
                  )}
                  {req.total_price > 0 && (
                    <p className="text-sm font-bold text-green-600 mt-2">
                      Total: ${req.total_price.toFixed(2)}
                    </p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Work Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedRequest ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Package className="h-16 w-16 mb-4" />
              <p className="text-lg">Select a request to view details</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Request Details Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Request #{selectedRequest.id}</h2>
                    <p className="text-slate-500">Room {selectedRequest.room_number}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-bold rounded-full border ${getStatusBadge(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-slate-500">Created</p>
                    <p className="font-medium">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-slate-500">Current Bill</p>
                    <p className="font-medium text-green-600">${selectedRequest.total_price.toFixed(2)}</p>
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-medium text-yellow-800">Guest Notes:</p>
                    <p className="text-sm text-yellow-700 mt-1">"{selectedRequest.notes}"</p>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Actions
                </h3>

                <div className="flex flex-wrap gap-3">
                  {/* PENDING → Mark Collected */}
                  {selectedRequest.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'COLLECTED')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Mark Collected
                    </button>
                  )}

                  {/* COLLECTED → Process Laundry (opens billing modal) */}
                  {selectedRequest.status === 'COLLECTED' && (
                    <button
                      onClick={openBillingModal}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Process Laundry
                    </button>
                  )}

                  {/* WASHING → Mark Ready */}
                  {selectedRequest.status === 'WASHING' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'READY')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Mark Ready
                    </button>
                  )}

                  {/* READY → Mark Delivered */}
                  {selectedRequest.status === 'READY' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'DELIVERED')}
                      className="px-4 py-2 bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Delivered
                    </button>
                  )}

                  {selectedRequest.status === 'DELIVERED' && (
                    <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </span>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Pending</span>
                    <span>Collected</span>
                    <span>Washing</span>
                    <span>Ready</span>
                    <span>Delivered</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{
                        width:
                          selectedRequest.status === 'PENDING' ? '10%' :
                          selectedRequest.status === 'COLLECTED' ? '30%' :
                          selectedRequest.status === 'WASHING' ? '55%' :
                          selectedRequest.status === 'READY' ? '80%' : '100%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center text-red-600 text-sm bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Billing Modal */}
      {showBillingModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Process Laundry - Room {selectedRequest.room_number}
                </h2>
                <p className="text-slate-400 text-sm">Add items to generate the bill</p>
              </div>
              <button
                onClick={closeBillingModal}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body - Menu Grid */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              <div className="grid grid-cols-2 gap-3">
                {menu.map((item) => {
                  const qty = itemQuantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        qty > 0 
                          ? 'border-amber-400 bg-amber-50' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-slate-800">{item.name}</p>
                          <p className="text-amber-600 font-medium">${item.price.toFixed(2)}</p>
                          {item.is_dry_clean && (
                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                              Dry Clean
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end gap-3 mt-3">
                        <button
                          onClick={() => decrementItem(item.id)}
                          disabled={qty === 0}
                          className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className={`w-8 text-center font-bold text-lg ${qty > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                          {qty}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-slate-500">Total Items</p>
                  <p className="text-2xl font-bold text-slate-800">{getTotalItems()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Estimated Bill</p>
                  <p className="text-2xl font-bold text-green-600">${getEstimatedTotal().toFixed(2)}</p>
                </div>
              </div>

              <button
                onClick={handleConfirmBill}
                disabled={getTotalItems() === 0 || submittingBill}
                className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submittingBill ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Confirm & Start Washing
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaundryManager;
