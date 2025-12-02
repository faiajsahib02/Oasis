import axios from 'axios';
import { Room, Guest, LoginRequest, RegisterRequest, LaundryItem, LaundryRequest, CreateLaundryRequest, CategoryWithItems, CreateRestaurantOrder, RestaurantOrder, KitchenOrder } from '../types';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getRooms = async (status?: string) => {
  const params = status ? { status } : {};
  const response = await api.get<Room[]>('/rooms', { params });
  return response.data;
};

export const createGuest = async (guest: RegisterRequest) => {
  const response = await api.post<Guest>('/guests', guest);
  return response.data;
};

export const loginGuest = async (credentials: LoginRequest) => {
  const response = await api.post<string>('/guests/login', credentials);
  return response.data; // Returns JWT token
};

export const loginStaff = async (credentials: { id: number; password: string }) => {
  const response = await api.post<{ token: string; staff: any }>('/staff/login', { 
    staff_id: credentials.id, 
    password: credentials.password 
  });
  return response.data;
};

export const getGuest = async (id: number | string) => {
  const response = await api.get<Guest>(`/guests/${id}`);
  return response.data;
};

export const getLaundryMenu = async () => {
  const response = await api.get<LaundryItem[]>('/laundry/menu');
  return response.data;
};

export const createLaundryRequest = async (data: CreateLaundryRequest) => {
  const response = await api.post<LaundryRequest>('/laundry/requests', data);
  return response.data;
};

export const getGuestLaundryRequests = async () => {
  const response = await api.get<LaundryRequest[]>('/laundry/requests/me');
  return response.data;
};

// Staff API functions
export const getAllLaundryRequests = async () => {
  const response = await api.get<LaundryRequest[]>('/laundry/requests/all');
  return response.data;
};

export const addItemsToLaundryRequest = async (requestId: number, items: { item_id: number; quantity: number }[]) => {
  const response = await api.post(`/laundry/requests/${requestId}/items`, { items });
  return response.data;
};

export const updateLaundryStatus = async (requestId: number, status: string) => {
  const response = await api.patch(`/laundry/requests/${requestId}/status?status=${status}`);
  return response.data;
};

// Restaurant API functions
export const getRestaurantMenu = async () => {
  const response = await api.get<CategoryWithItems[]>('/restaurant/menu');
  return response.data;
};

export const createMenuItem = async (data: any) => {
  const response = await api.post('/restaurant/items', data);
  return response.data;
};

export const updateMenuItem = async (id: number, data: any) => {
  const response = await api.put(`/restaurant/items/${id}`, data);
  return response.data;
};

export const deleteMenuItem = async (id: number) => {
  const response = await api.delete(`/restaurant/items/${id}`);
  return response.data;
};

export const createRestaurantOrder = async (data: CreateRestaurantOrder) => {
  const response = await api.post<RestaurantOrder>('/restaurant/orders', data);
  return response.data;
};

export const getGuestRestaurantOrders = async () => {
  const response = await api.get<RestaurantOrder[]>('/restaurant/orders/me');
  return response.data;
};

export const getActiveOrders = async () => {
  const response = await api.get<KitchenOrder[]>('/restaurant/orders/active');
  return response.data;
};

export const updateRestaurantOrderStatus = async (orderId: number, status: string) => {
  const response = await api.patch(`/restaurant/orders/${orderId}/status?status=${status}`);
  return response.data;
};

// Housekeeping API functions
export const requestCleaning = async (roomNumber: string, status: string) => {
  const response = await api.post('/housekeeping/clean', { room_number: roomNumber, status });
  return response.data;
};

export const requestAmenity = async (guestId: number, roomNumber: string, amenity: string, quantity: number) => {
  const response = await api.post('/housekeeping/amenity', { guest_id: guestId, room_number: roomNumber, amenity, quantity });
  return response.data;
};

export const reportIssue = async (roomNumber: string, issueType: string, description: string) => {
  const response = await api.post('/housekeeping/ticket', { room_number: roomNumber, issue_type: issueType, description });
  return response.data;
};

export const getLiveHousekeepingStatus = async () => {
  const response = await api.get<{ room_number: string; status: string }[]>('/housekeeping/live');
  return response.data;
};

export const getAmenityRequests = async () => {
  const response = await api.get<{ id: number; room_number: string; item_name: string; quantity: number; status: string; created_at: string }[]>('/housekeeping/amenities');
  return response.data;
};

export const getMaintenanceTickets = async () => {
  const response = await api.get<{ id: number; room_number: string; issue_type: string; description: string; priority: string; status: string; created_at: string }[]>('/housekeeping/tickets');
  return response.data;
};

export const markRoomClean = async (roomNumber: string) => {
  const response = await api.patch(`/housekeeping/rooms/${roomNumber}/clean`);
  return response.data;
};

export const markAmenityDelivered = async (id: number) => {
  const response = await api.patch(`/housekeeping/amenities/${id}/deliver`);
  return response.data;
};

export const resolveTicket = async (id: number) => {
  const response = await api.patch(`/housekeeping/tickets/${id}/resolve`);
  return response.data;
};

// Invoice API functions
export interface InvoicePreview {
  guest_name: string;
  stay_days: number;
  room_total: number;
  laundry_total: number;
  restaurant_total: number;
  grand_total: number;
}

export interface Invoice {
  id: number;
  total_amount: number;
  created_at: string;
}

export const getInvoicePreview = async (roomNumber?: string) => {
  const url = roomNumber ? `/invoice/preview?room=${roomNumber}` : '/invoice/preview';
  const response = await api.get<InvoicePreview>(url);
  return response.data;
};

export const processCheckout = async (roomNumber?: string) => {
  const url = roomNumber ? `/invoice/checkout?room=${roomNumber}` : '/invoice/checkout';
  const response = await api.post<Invoice>(url);
  return response.data;
};

export default api;
