import { useState, useEffect, useRef } from 'react';
import { getLiveHousekeepingStatus, markRoomClean, getAmenityRequests, getMaintenanceTickets, markAmenityDelivered, resolveTicket } from '../../services/api';
import { CheckCircle, AlertCircle, Moon, XCircle, Loader2, Filter, Package, Wrench, Clock } from 'lucide-react';

interface RoomStatus {
  room_number: string;
  status: string;
}

interface AmenityRequest {
  id: number;
  room_number: string;
  item_name: string;
  quantity: number;
  status: string;
  created_at: string;
}

interface MaintenanceTicket {
  id: number;
  room_number: string;
  issue_type: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
}

const HousekeepingMap = () => {
  const [rooms, setRooms] = useState<RoomStatus[]>([]);
  const [amenities, setAmenities] = useState<AmenityRequest[]>([]);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const ws = useRef<WebSocket | null>(null);

  // 1. Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, amenitiesData, ticketsData] = await Promise.all([
          getLiveHousekeepingStatus(),
          getAmenityRequests(),
          getMaintenanceTickets()
        ]);
        setRooms(roomsData || []);
        setAmenities(amenitiesData || []);
        setTickets(ticketsData || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. WebSocket Connection
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://localhost:8080/ws');
      ws.current = socket;

      socket.onopen = () => console.log('Connected to Housekeeping WebSocket');

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'ROOM_UPDATE') {
            const { room_number, status } = message.payload;
            setRooms(prevRooms => {
              const exists = prevRooms.find(r => r.room_number === room_number);
              if (exists) {
                return prevRooms.map(r => r.room_number === room_number ? { ...r, status } : r);
              } else {
                return [...prevRooms, { room_number, status }].sort((a, b) => a.room_number.localeCompare(b.room_number));
              }
            });
          } else if (message.type === 'NEW_TASK') {
             // Refresh from server to get proper IDs instead of appending
             getAmenityRequests().then(data => setAmenities(data || []));
          } else if (message.type === 'NEW_TICKET') {
             getMaintenanceTickets().then(data => setTickets(data || []));
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message", err);
        }
      };

      socket.onclose = () => setTimeout(connectWebSocket, 3000);
      socket.onerror = () => socket.close();
    };

    connectWebSocket();
    return () => ws.current?.close();
  }, []);

  // 3. Handle Interaction
  const handleRoomClick = async (room: RoomStatus) => {
    if (room.status === 'REQUESTED_CLEANING') {
      if (window.confirm(`Mark Room ${room.room_number} as Cleaned?`)) {
        setRooms(prev => prev.map(r => r.room_number === room.room_number ? { ...r, status: 'CLEAN' } : r));
        try {
          await markRoomClean(room.room_number);
        } catch (error) {
          console.error("Failed to update room status", error);
        }
      }
    }
  };

  const handleDeliverAmenity = async (id: number) => {
    try {
      await markAmenityDelivered(id);
      setAmenities(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Failed to mark amenity as delivered", error);
    }
  };

  const handleResolveTicket = async (id: number) => {
    try {
      await resolveTicket(id);
      setTickets(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to resolve ticket", error);
    }
  };

  // 4. Stats & Filtering
  const stats = {
    total: rooms.length,
    clean: rooms.filter(r => r.status === 'CLEAN').length,
    dirty: rooms.filter(r => r.status === 'DIRTY').length,
    requested: rooms.filter(r => r.status === 'REQUESTED_CLEANING').length,
    dnd: rooms.filter(r => r.status === 'DND').length,
  };

  const filteredRooms = filter === 'ALL' ? rooms : rooms.filter(r => r.status === filter);

  // 5. Design Helpers
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'CLEAN':
        return {
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-800',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Clean'
        };
      case 'REQUESTED_CLEANING':
        return {
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800',
          icon: <AlertCircle className="w-5 h-5 animate-pulse" />,
          label: 'Requested'
        };
      case 'DND':
        return {
          color: 'text-rose-600',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          badge: 'bg-rose-100 text-rose-800',
          icon: <Moon className="w-5 h-5" />,
          label: 'Do Not Disturb'
        };
      case 'DIRTY':
      default:
        return {
          color: 'text-slate-500',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          badge: 'bg-slate-100 text-slate-600',
          icon: <XCircle className="w-5 h-5" />,
          label: 'Dirty'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Housekeeping Live Map</h1>
            <p className="text-slate-500 mt-1">Real-time room status monitoring and management</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-sm font-medium text-slate-600">{stats.clean} Clean</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-sm font-medium text-slate-600">{stats.requested} Requested</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-sm font-medium text-slate-600">{stats.dnd} DND</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['ALL', 'CLEAN', 'DIRTY', 'REQUESTED_CLEANING', 'DND'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${filter === f 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}
              `}
            >
              {f === 'ALL' ? 'All Rooms' : f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredRooms.map((room) => {
            const config = getStatusConfig(room.status);
            const isActionable = room.status === 'REQUESTED_CLEANING';

            return (
              <div
                key={room.room_number}
                onClick={() => handleRoomClick(room)}
                className={`
                  group relative bg-white rounded-xl shadow-sm border border-slate-200 
                  overflow-hidden transition-all duration-300 
                  ${isActionable ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 ring-2 ring-transparent hover:ring-amber-400' : ''}
                `}
              >
                {/* Status Strip */}
                <div className={`h-1.5 w-full ${config.bg.replace('bg-', 'bg-').replace('50', '500')}`}></div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-2xl font-serif font-bold text-slate-800">
                      {room.room_number}
                    </span>
                    <div className={`p-2 rounded-full ${config.bg} ${config.color}`}>
                      {config.icon}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${config.badge}
                    `}>
                      {config.label}
                    </span>
                    
                    {/* Floor/Type placeholder if we had that data */}
                    <span className="text-xs text-slate-400">Suite</span>
                  </div>
                </div>

                {/* Action Overlay for Requested Rooms */}
                {isActionable && (
                  <div className="absolute inset-0 bg-amber-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                    <span className="bg-white text-amber-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      Mark Clean
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 mb-12">
            <Filter className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No rooms found</h3>
            <p className="text-slate-500">Try adjusting your filters</p>
          </div>
        )}

        {/* Requests & Issues Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 border-t border-slate-200 pt-12">
          
          {/* Amenity Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Amenity Requests
              </h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                {amenities.length} Pending
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {amenities.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No pending requests</div>
              ) : (
                amenities.map((req) => (
                  <div key={req.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">Room {req.room_number}</span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-slate-600 text-sm font-medium">{req.item_name}</span>
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(req.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                          Qty: {req.quantity}
                        </span>
                        <button 
                          onClick={() => handleDeliverAmenity(req.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 hover:border-blue-400 px-3 py-1 rounded transition-colors"
                        >
                          Deliver
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Maintenance Tickets */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-serif font-bold text-lg text-slate-800 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-600" />
                Maintenance Issues
              </h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">
                {tickets.length} Open
              </span>
            </div>
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No open tickets</div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Room {ticket.room_number}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          ticket.priority === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{ticket.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{ticket.issue_type}</span>
                      <button 
                        onClick={() => handleResolveTicket(ticket.id)}
                        className="text-orange-600 hover:text-orange-800 text-xs font-medium border border-orange-200 hover:border-orange-400 px-3 py-1 rounded transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HousekeepingMap;
