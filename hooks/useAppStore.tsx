import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { MenuItem, Order, OrderStatus, OrderItem } from '../types';
import { MOCK_MENU_ITEMS } from '../constants';

interface AppState {
  menu: MenuItem[];
  orders: Order[];
}

type Action =
  | { type: 'PLACE_ORDER'; payload: { tableNumber: number; items: OrderItem[] } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: { itemId: string } }
  | { type: 'TOGGLE_MENU_ITEM_AVAILABILITY'; payload: { itemId: string } };

const initialState: AppState = {
  menu: MOCK_MENU_ITEMS,
  orders: [],
};

const AppStateContext = createContext<AppState>(initialState);
const AppDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'PLACE_ORDER': {
      const { tableNumber, items } = action.payload;
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        tableNumber,
        items,
        status: OrderStatus.Placed,
        timestamp: Date.now(),
        total,
      };
      return { ...state, orders: [...state.orders, newOrder] };
    }
    case 'UPDATE_ORDER_STATUS': {
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };
    }
    case 'ADD_MENU_ITEM':
      return { ...state, menu: [...state.menu, action.payload] };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menu: state.menu.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_MENU_ITEM':
      return {
        ...state,
        menu: state.menu.filter(item => item.id !== action.payload.itemId),
      };
    case 'TOGGLE_MENU_ITEM_AVAILABILITY':
      return {
        ...state,
        menu: state.menu.map(item =>
          item.id === action.payload.itemId
            ? { ...item, isAvailable: !item.isAvailable }
            : item
        ),
      };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
export const useAppDispatch = () => {
    const context = useContext(AppDispatchContext);
    if (context === undefined) {
        throw new Error('useAppDispatch must be used within an AppProvider');
    }
    return context;
};