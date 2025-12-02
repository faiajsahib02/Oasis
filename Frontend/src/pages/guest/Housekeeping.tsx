import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { requestCleaning, requestAmenity, reportIssue } from '../../services/api';
import { motion } from 'framer-motion';
import { 
  BedDouble, 
  Moon, 
  Sun, 
  Bath, 
  Droplets, 
  Coffee, 
  Pill, 
  Wrench, 
  CheckCircle, 
  AlertCircle,
  Minus,
  Plus
} from 'lucide-react';

const AMENITIES = [
  { id: 'TOWEL', name: 'Towels', icon: Bath },
  { id: 'SHAMPOO', name: 'Shampoo', icon: Droplets },
  { id: 'WATER', name: 'Water', icon: Droplets }, // Using Droplets as placeholder if no Water icon
  { id: 'PILLOW', name: 'Pillows', icon: BedDouble },
  { id: 'COFFEE', name: 'Coffee', icon: Coffee },
];

const ISSUE_TYPES = ['AC', 'Plumbing', 'Electric', 'Other'];

const HousekeepingPage = () => {
  const { user } = useAuth();
  const [roomStatus, setRoomStatus] = useState<'CLEAN' | 'REQUESTED_CLEANING' | 'DND'>('CLEAN');
  const [amenityCounts, setAmenityCounts] = useState<{ [key: string]: number }>({});
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStatusChange = async (status: 'REQUESTED_CLEANING' | 'DND') => {
    if (!user?.room_number) return;
    
    // Toggle logic: if clicking the same status, revert to CLEAN (or just keep it?)
    // Let's assume clicking "Make Up Room" sets it to REQUESTED_CLEANING.
    // If it's already REQUESTED_CLEANING, maybe we don't do anything or revert.
    // For now, direct set.
    
    const newStatus = status === roomStatus ? 'CLEAN' : status;
    setRoomStatus(newStatus); // Optimistic update

    try {
      await requestCleaning(user.room_number, newStatus);
      showNotification('success', `Room status updated to ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      console.error(err);
      setRoomStatus(roomStatus); // Revert
      showNotification('error', 'Failed to update room status');
    }
  };

  const updateAmenityCount = (id: string, delta: number) => {
    setAmenityCounts(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  const handleRequestAmenities = async () => {
    if (!user?.room_number || !user?.id) return;

    const itemsToRequest = Object.entries(amenityCounts).filter(([_, count]) => count > 0);
    if (itemsToRequest.length === 0) return;

    setLoading(true);
    try {
      // Send requests in parallel
      await Promise.all(itemsToRequest.map(([item, qty]) => 
        requestAmenity(user.id, user.room_number!, item, qty)
      ));
      
      setAmenityCounts({});
      showNotification('success', 'Housekeeping notified of your request');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to request amenities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.room_number) return;

    setLoading(true);
    try {
      await reportIssue(user.room_number, issueType, description);
      setDescription('');
      showNotification('success', 'Maintenance ticket submitted');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Notification Toast */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          {notification.message}
        </motion.div>
      )}

      {/* Section A: Room Status (Hero) */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6">Housekeeping Control</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Indicator */}
            <div className={`p-6 rounded-xl border-2 flex items-center justify-between transition-colors ${
              roomStatus === 'DND' 
                ? 'bg-red-50 border-red-200' 
                : roomStatus === 'REQUESTED_CLEANING'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Current Status</p>
                <h2 className={`text-2xl font-bold mt-1 ${
                  roomStatus === 'DND' ? 'text-red-700' : roomStatus === 'REQUESTED_CLEANING' ? 'text-green-700' : 'text-slate-700'
                }`}>
                  {roomStatus === 'DND' ? 'Do Not Disturb' : roomStatus === 'REQUESTED_CLEANING' ? 'Cleaning Requested' : 'Standard Service'}
                </h2>
              </div>
              <div className={`p-3 rounded-full ${
                roomStatus === 'DND' ? 'bg-red-100 text-red-600' : roomStatus === 'REQUESTED_CLEANING' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {roomStatus === 'DND' ? <Moon className="h-8 w-8" /> : <Sun className="h-8 w-8" />}
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleStatusChange('REQUESTED_CLEANING')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  roomStatus === 'REQUESTED_CLEANING'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-600'
                }`}
              >
                <Sun className="h-8 w-8 mb-2" />
                <span className="font-medium">Make Up Room</span>
              </button>

              <button
                onClick={() => handleStatusChange('DND')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  roomStatus === 'DND'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600'
                }`}
              >
                <Moon className="h-8 w-8 mb-2" />
                <span className="font-medium">Do Not Disturb</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section B: Amenities Request */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Need something extra?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {AMENITIES.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-3">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-slate-900 mb-3">{item.name}</h3>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => updateAmenityCount(item.id, -1)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-semibold w-4">{amenityCounts[item.id] || 0}</span>
                  <button 
                    onClick={() => updateAmenityCount(item.id, 1)}
                    className="p-1 rounded-full hover:bg-blue-50 text-blue-500 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleRequestAmenities}
              disabled={loading || Object.values(amenityCounts).every(v => v === 0)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Request Items'}
            </button>
          </div>
        </section>

        {/* Section C: Report an Issue */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-slate-500" />
              Maintenance Request
            </h2>
          </div>
          <form onSubmit={handleSubmitTicket} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ISSUE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the issue..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !description}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default HousekeepingPage;
