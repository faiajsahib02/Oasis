export interface Room {
  id: number;
  room_number: string;
  type: string;
  status: 'VACANT' | 'OCCUPIED' | 'CLEANING';
  price: number;
}

export interface Guest {
  id: number;
  name: string;
  phone_number: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
  created_at: string;
}

export interface LoginRequest {
  room_number: string;
  phone_number: string;
}

export interface RegisterRequest {
  name: string;
  phone_number: string;
  room_number: string;
  check_in_date: string;
  check_out_date: string;
}

export interface DecodedToken {
  sub: number; // Guest ID
  name: string;
  phone_number: string;
  room_number: string;
  exp: number;
}

export interface LaundryItem {
  id: number;
  name: string;
  price: number;
  is_dry_clean: boolean;
}

export interface LaundryRequest {
  id: number;
  guest_id: number;
  room_number: string;
  status: 'PENDING' | 'COLLECTED' | 'WASHING' | 'READY' | 'DELIVERED';
  total_price: number;
  notes: string;
  created_at: string;
}

export interface CreateLaundryRequest {
  room_number: string;
  notes: string;
}

// Restaurant Types
export interface MenuCategory {
  id: number;
  name: string;
  priority: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  image_url?: string;
}

export interface CreateMenuItem {
  category_id: number;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  image_url: string;
}

export interface CategoryWithItems {
  category: MenuCategory;
  items: MenuItem[];
}

export interface OrderItemInput {
  item_id: number;
  quantity: number;
}

export interface CreateRestaurantOrder {
  room_number: string;
  notes: string;
  items: OrderItemInput[];
}

export interface RestaurantOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface RestaurantOrder {
  id: number;
  guest_id: number;
  room_number: string;
  notes: string;
  status: string;
  total_price: number;
  created_at: string;
  items: RestaurantOrderItem[];
}

export interface KitchenOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface KitchenOrder extends RestaurantOrder {
  items: KitchenOrderItem[];
}
