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
  CheckCircle, 
  AlertCircle,
  Minus,
  Plus,
  ChevronRight
} from 'lucide-react';

const AMENITIES = [
  { id: 'TOWEL', name: 'Towels', icon: Bath },
  { id: 'SHAMPOO', name: 'Shampoo', icon: Droplets },
  { id: 'WATER', name: 'Water', icon: Droplets },
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
    
    const newStatus = status === roomStatus ? 'CLEAN' : status;
    setRoomStatus(newStatus);

    try {
      await requestCleaning(user.room_number, newStatus);
      showNotification('success', `Room status updated`);
    } catch (err) {
      console.error(err);
      setRoomStatus(roomStatus);
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
      await Promise.all(itemsToRequest.map(([item, qty]) => 
        requestAmenity(user.id, user.room_number!, item, qty)
      ));
      
      setAmenityCounts({});
      showNotification('success', 'Request sent to housekeeping');
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
    <div className="min-h-screen bg-white pb-20">
      {/* Notification Toast */}
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
          {notification.message}
        </motion.div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm tracking-widest text-slate-500 uppercase">Room Control</p>
          <h1 className="text-4xl font-bold text-slate-900 mt-2">Housekeeping</h1>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-64 md:h-80 overflow-hidden bg-slate-100">
        <img 
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
          alt="Housekeeping" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Section A: Room Status */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs tracking-widest text-slate-500 uppercase mb-6 font-semibold">Room Status</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Status Indicator */}
            <div className={`p-6 rounded-lg border transition-all ${
              roomStatus === 'DND' 
                ? 'bg-slate-900 border-slate-900 text-white' 
                : roomStatus === 'REQUESTED_CLEANING'
                  ? 'bg-slate-100 border-slate-300'
                  : 'bg-white border-slate-200'
            }`}>
              <p className={`text-xs tracking-widest uppercase mb-2 font-semibold ${roomStatus === 'DND' ? 'text-slate-300' : 'text-slate-500'}`}>
                Current
              </p>
              <h2 className="text-2xl font-bold">
                {roomStatus === 'DND' ? 'Do Not Disturb' : roomStatus === 'REQUESTED_CLEANING' ? 'Cleaning In Progress' : 'Ready to Serve'}
              </h2>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange('REQUESTED_CLEANING')}
                className={`p-6 rounded-lg border transition-all text-center ${
                  roomStatus === 'REQUESTED_CLEANING'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Sun className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                <span className="font-bold text-sm">Make Up Room</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange('DND')}
                className={`p-6 rounded-lg border transition-all text-center ${
                  roomStatus === 'DND'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Moon className="h-6 w-6 mx-auto mb-2" />
                <span className="font-bold text-sm">Do Not Disturb</span>
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Divider */}
        <div className="h-px bg-slate-100"></div>

        {/* Section B: Amenities Request */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-xs tracking-widest text-slate-500 uppercase mb-6 font-semibold">Request Amenities</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {AMENITIES.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex justify-center mb-3">
                  <item.icon className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm text-center mb-3">{item.name}</h3>
                <div className="flex items-center justify-center space-x-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateAmenityCount(item.id, -1)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-300 hover:text-slate-600"
                  >
                    <Minus className="h-4 w-4" />
                  </motion.button>
                  <span className="font-bold w-4 text-center text-sm">{amenityCounts[item.id] || 0}</span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateAmenityCount(item.id, 1)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-300 hover:text-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRequestAmenities}
              disabled={loading || Object.values(amenityCounts).every(v => v === 0)}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              Send Request <ChevronRight className="h-4 w-4 ml-2" />
            </motion.button>
          </div>
        </motion.section>

        {/* Divider */}
        <div className="h-px bg-slate-100"></div>

        {/* Section C: Report an Issue */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="text-xs tracking-widest text-slate-500 uppercase mb-6 font-semibold">Maintenance Request</p>
          <form onSubmit={handleSubmitTicket} className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white font-semibold"
              >
                {ISSUE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white font-semibold"
              />
            </div>
            <div className="flex justify-end pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !description}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center"
              >
                Submit <ChevronRight className="h-4 w-4 ml-2" />
              </motion.button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
};

export default HousekeepingPage;
