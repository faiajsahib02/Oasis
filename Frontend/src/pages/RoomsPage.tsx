import { useEffect, useState } from 'react';
import { getRooms } from '../services/api';
import { Room } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { Loader2, Filter } from 'lucide-react';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getRooms(filter);
        setRooms(data);
      } catch (err) {
        setError('Failed to load rooms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VACANT': return 'bg-green-100 text-green-800';
      case 'OCCUPIED': return 'bg-red-100 text-red-800';
      case 'CLEANING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-primary mb-2">Our Rooms</h1>
            <p className="text-gray-600">Browse our luxurious accommodations.</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center bg-white rounded-md shadow-sm p-1 border border-gray-200">
              <Filter className="w-4 h-4 text-gray-500 ml-2 mr-2" />
              <select 
                className="bg-transparent border-none focus:ring-0 text-sm text-gray-700 py-1 pr-8"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="CLEANING">Cleaning</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => setFilter(filter)} variant="outline">Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder Image - In real app, map room type to image */}
                  <img 
                    src={`https://source.unsplash.com/800x600/?hotel,room,${room.type}`} 
                    alt={room.type}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(room.status)}`}>
                    {room.status}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary">{room.type}</h3>
                      <p className="text-sm text-gray-500">Room {room.room_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-accent">${room.price}</p>
                      <p className="text-xs text-gray-400">/ night</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                      <span className="flex items-center">King Bed</span>
                      <span className="flex items-center">Ocean View</span>
                      <span className="flex items-center">Free Wi-Fi</span>
                      <span className="flex items-center">Room Service</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={room.status !== 'VACANT'}
                      variant={room.status === 'VACANT' ? 'primary' : 'ghost'}
                    >
                      {room.status === 'VACANT' ? 'Book Now' : 'Unavailable'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
