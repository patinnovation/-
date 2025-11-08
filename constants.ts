import { MenuItem } from './types';

export const MENU_CATEGORIES = ['อาหารจานเดียว', 'ของทอด', 'ต้มยำ', 'เครื่องดื่ม'];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  { id: 'm01', name: 'ข้าวกะเพราหมูสับ', price: 60, category: 'อาหารจานเดียว', image: 'https://picsum.photos/seed/padkrapow/400/300', isAvailable: true },
  { id: 'm02', name: 'ข้าวผัดทะเล', price: 80, category: 'อาหารจานเดียว', image: 'https://picsum.photos/seed/friedrice/400/300', isAvailable: true },
  { id: 'm03', name: 'ข้าวไข่เจียวหมูสับ', price: 50, category: 'อาหารจานเดียว', image: 'https://picsum.photos/seed/omelette/400/300', isAvailable: true },
  { id: 'm04', name: 'ผัดไทยกุ้งสด', price: 90, category: 'อาหารจานเดียว', image: 'https://picsum.photos/seed/padthai/400/300', isAvailable: true },
  { id: 'm05', name: 'ปีกไก่ทอดน้ำปลา', price: 120, category: 'ของทอด', image: 'https://picsum.photos/seed/friedchicken/400/300', isAvailable: true },
  { id: 'm06', name: 'หมูสามชั้นทอด', price: 100, category: 'ของทอด', image: 'https://picsum.photos/seed/friedpork/400/300', isAvailable: true },
  { id: 'm07', name: 'ต้มยำกุ้ง', price: 150, category: 'ต้มยำ', image: 'https://picsum.photos/seed/tomyum/400/300', isAvailable: true },
  { id: 'm08', name: 'ต้มข่าไก่', price: 130, category: 'ต้มยำ', image: 'https://picsum.photos/seed/tomkha/400/300', isAvailable: true },
  { id: 'm09', name: 'โค้ก', price: 20, category: 'เครื่องดื่ม', image: 'https://picsum.photos/seed/coke/400/300', isAvailable: true },
  { id: 'm10', name: 'น้ำเปล่า', price: 15, category: 'เครื่องดื่ม', image: 'https://picsum.photos/seed/water/400/300', isAvailable: true },
];

export const RESTAURANT_PROMPT_PAY_MOBILE = "0808133458";
