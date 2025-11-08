export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
}

export interface OrderItem extends MenuItem {
  quantity: number;
  note?: string;
}

export enum OrderStatus {
  Ordering = 'Ordering',
  Placed = 'Placed',
  Served = 'Served',
  Paid = 'Paid',
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  timestamp: number;
  total: number;
}