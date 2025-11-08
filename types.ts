export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  description?: string;
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

export interface PaymentMethodsState {
  cash: boolean;
  promptPay: boolean;
  bankTransfer: {
    enabled: boolean;
    details: string;
  };
}