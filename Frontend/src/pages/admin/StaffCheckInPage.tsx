import { useState, useEffect } from 'react';
import { getRooms, createGuest } from '../../services/api';
import { Room } from '../../types';
import Button from '../../components/Button';
import { UserPlus, BedDouble, Phone, User, Calendar } from 'lucide-react';

const StaffCheckInPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    room_number: '',
    check_in_date: today,
    check_out_date: ''
  });

  useEffect(() => {
    const fetchVacantRooms = async () => {
      try {
        const data = await getRooms('VACANT');
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load vacant rooms.');
      } finally {
        setLoading(false);
      }
    };

    fetchVacantRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await createGuest(formData);
      setSuccess(`Guest ${formData.name} checked in successfully to Room ${formData.room_number}!`);
      setFormData({ name: '', phone_number: '', room_number: '', check_in_date: today, check_out_date: '' });
      // Refresh room list
      const data = await getRooms('VACANT');
      setRooms(data);
    } catch (err) {
      console.error(err);
      setError('Failed to check in guest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <UserPlus className="h-10 w-10 text-accent mr-3" />
          <h1 className="text-3xl font-serif font-bold text-primary">Staff Check-In</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="phone"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                placeholder="555-1234"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">Select Room</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BedDouble className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="room"
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                value={formData.room_number}
                onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                disabled={loading}
              >
                <option value="">Select a vacant room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.room_number}>
                    Room {room.room_number} - {room.type} (${room.price})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-700 mb-1">Check-In Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="check_in_date"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                  value={formData.check_in_date}
                  onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="check_out_date"
                  required
                  min={formData.check_in_date}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                  value={formData.check_out_date}
                  onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || loading}
          >
            {submitting ? 'Checking In...' : 'Check In Guest'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StaffCheckInPage;
