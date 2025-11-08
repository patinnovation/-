import { MenuItem } from './types';

export const INITIAL_MENU_CATEGORIES = ['ของทานเล่น', 'อาหารจานหลัก', 'ของทอด', 'ต้มยำ & ซุป', 'ของหวาน', 'เครื่องดื่ม'];

export const MOCK_MENU_ITEMS: MenuItem[] = [
  // อาหารจานหลัก (Main Courses)
  { id: 'm01', name: 'ข้าวกะเพราหมูสับ', price: 60, category: 'อาหารจานหลัก', image: 'https://picsum.photos/seed/padkrapow/400/300', isAvailable: true, description: 'ผัดกะเพรารสจัดจ้าน เสิร์ฟพร้อมข้าวสวยร้อนๆ และไข่ดาว' },
  { id: 'm02', name: 'ข้าวผัดทะเล', price: 80, category: 'อาหารจานหลัก', image: 'https://picsum.photos/seed/friedrice/400/300', isAvailable: true, description: 'ข้าวผัดหอมกรุ่น ใส่กุ้งและปลาหมึกสดใหม่' },
  { id: 'm03', name: 'ข้าวไข่เจียวหมูสับ', price: 50, category: 'อาหารจานหลัก', image: 'https://picsum.photos/seed/omelette/400/300', isAvailable: true, description: 'ไข่เจียวฟูนุ่มสอดไส้หมูสับปรุงรส ทานกับข้าวสวย' },
  { id: 'm04', name: 'ผัดไทยกุ้งสด', price: 90, category: 'อาหารจานหลัก', image: 'https://picsum.photos/seed/padthai/400/300', isAvailable: true, description: 'เส้นจันท์เหนียวนุ่มผัดกับกุ้งสดและซอสผัดไทยสูตรพิเศษ' },
  
  // ของทอด (Fried Items)
  { id: 'm05', name: 'ปีกไก่ทอดน้ำปลา', price: 120, category: 'ของทอด', image: 'https://picsum.photos/seed/friedchicken/400/300', isAvailable: true, description: 'ปีกไก่ทอดกรอบหมักน้ำปลาอย่างดี หอมอร่อย' },
  { id: 'm06', name: 'หมูสามชั้นทอด', price: 100, category: 'ของทอด', image: 'https://picsum.photos/seed/friedpork/400/300', isAvailable: true },
  
  // ต้มยำ & ซุป (Soups)
  { id: 'm07', name: 'ต้มยำกุ้ง', price: 150, category: 'ต้มยำ & ซุป', image: 'https://picsum.photos/seed/tomyum/400/300', isAvailable: true, description: 'ซุปต้มยำรสแซ่บถึงเครื่องสมุนไพรไทย ใส่กุ้งแม่น้ำตัวโต' },
  { id: 'm08', name: 'ต้มข่าไก่', price: 130, category: 'ต้มยำ & ซุป', image: 'https://picsum.photos/seed/tomkha/400/300', isAvailable: true, description: 'ต้มข่าไก่รสกลมกล่อม หอมกะทิและข่าอ่อน' },

  // ของทานเล่น (Appetizers)
  { id: 'm11', name: 'เกี๊ยวซ่าทอด', price: 80, category: 'ของทานเล่น', image: 'https://picsum.photos/seed/gyoza/400/300', isAvailable: true },
  { id: 'm12', name: 'ปอเปี๊ยะทอด', price: 70, category: 'ของทานเล่น', image: 'https://picsum.photos/seed/springrolls/400/300', isAvailable: true },

  // ของหวาน (Desserts)
  { id: 'm13', name: 'ข้าวเหนียวมะม่วง', price: 100, category: 'ของหวาน', image: 'https://picsum.photos/seed/mangostickyrice/400/300', isAvailable: true, description: 'ของหวานยอดนิยม ข้าวเหนียวมูนหวานมันทานคู่มะม่วงสุก' },

  // เครื่องดื่ม (Beverages)
  { id: 'm09', name: 'โค้ก', price: 20, category: 'เครื่องดื่ม', image: 'https://picsum.photos/seed/coke/400/300', isAvailable: true },
  { id: 'm10', name: 'น้ำเปล่า', price: 15, category: 'เครื่องดื่ม', image: 'https://picsum.photos/seed/water/400/300', isAvailable: true },
];

export const RESTAURANT_PROMPT_PAY_MOBILE = "0808133458";