import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { MenuItem, Order, OrderStatus, OrderItem, PaymentMethodsState } from '../types';
import { MOCK_MENU_ITEMS, INITIAL_MENU_CATEGORIES } from '../constants';

const LOCAL_STORAGE_KEY = 'krua-baan-ong-state';

interface AppState {
  menu: MenuItem[];
  orders: Order[];
  paymentMethods: PaymentMethodsState;
  categories: string[];
}

type Action =
  | { type: 'PLACE_ORDER'; payload: { tableNumber: number; items: OrderItem[] } }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: { itemId: string } }
  | { type: 'TOGGLE_MENU_ITEM_AVAILABILITY'; payload: { itemId: string } }
  | { type: 'UPDATE_PAYMENT_METHODS'; payload: PaymentMethodsState }
  | { type: 'SYNC_STATE'; payload: AppState }
  | { type: 'ADD_CATEGORY'; payload: { name: string } }
  | { type: 'UPDATE_CATEGORY'; payload: { oldName: string; newName: string } }
  | { type: 'DELETE_CATEGORY'; payload: { name: string } };

const defaultInitialState: AppState = {
  menu: MOCK_MENU_ITEMS,
  orders: [],
  paymentMethods: {
    cash: true,
    promptPay: true,
    bankTransfer: {
      enabled: false,
      details: '',
    },
  },
  categories: INITIAL_MENU_CATEGORIES,
};

const getInitialState = (): AppState => {
  try {
    const persistedState = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (persistedState) {
      const parsedState = JSON.parse(persistedState);
      if (!parsedState.categories) {
        parsedState.categories = INITIAL_MENU_CATEGORIES;
      }
      return parsedState;
    }
  } catch (e) {
    console.error("Failed to parse state from localStorage", e);
  }
  return defaultInitialState;
};

const AppStateContext = createContext<AppState>(defaultInitialState);
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
    case 'UPDATE_PAYMENT_METHODS':
      return { ...state, paymentMethods: action.payload };
    case 'SYNC_STATE':
        return action.payload;
    case 'ADD_CATEGORY': {
      if (state.categories.includes(action.payload.name) || !action.payload.name.trim()) {
        return state;
      }
      return { ...state, categories: [...state.categories, action.payload.name.trim()] };
    }
    case 'UPDATE_CATEGORY': {
      const { oldName, newName } = action.payload;
      if (!newName.trim() || state.categories.includes(newName.trim())) {
          return state;
      }
      return {
        ...state,
        categories: state.categories.map(cat => cat === oldName ? newName.trim() : cat),
        menu: state.menu.map(item => item.category === oldName ? { ...item, category: newName.trim() } : item)
      };
    }
    case 'DELETE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.filter(cat => cat !== action.payload.name),
      };
    }
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch(e) {
        console.error("Failed to save state to localStorage", e);
    }
  }, [state]);

  // Effect to listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
        if (event.key === LOCAL_STORAGE_KEY && event.newValue) {
            try {
                const newState = JSON.parse(event.newValue);
                dispatch({ type: 'SYNC_STATE', payload: newState });
            } catch(e) {
                console.error("Failed to parse state from storage event", e);
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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