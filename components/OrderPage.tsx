import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';
import { MenuItem, OrderItem } from '../types';
import { MENU_CATEGORIES } from '../constants';
import BillModal from './BillModal';

const MenuItemCard: React.FC<{ item: MenuItem; onAddToCart: (item: MenuItem) => void }> = ({ item, onAddToCart }) => (
    <div className="bg-brand-surface rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col relative">
        {!item.isAvailable && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-lg">
                <span className="text-white text-xl font-bold">สินค้าหมด</span>
            </div>
        )}
        <img className="w-full h-40 object-cover" src={item.image} alt={item.name} />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-brand-dark">{item.name}</h3>
            <p className="text-gray-500 mt-1">{item.price} บาท</p>
            <div className="mt-auto pt-4">
                 <button 
                    onClick={() => onAddToCart(item)} 
                    className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!item.isAvailable}
                 >
                    {item.isAvailable ? 'เพิ่มลงตะกร้า' : 'สินค้าหมด'}
                </button>
            </div>
        </div>
    </div>
);


const OrderPage: React.FC = () => {
    const { menu } = useAppState();
    const dispatch = useAppDispatch();
    const location = useLocation();
    
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showBill, setShowBill] = useState<any | null>(null);

    const tableNumber = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return parseInt(params.get('table') || '1', 10);
    }, [location.search]);

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        setCart(prevCart => {
            if (quantity <= 0) {
                return prevCart.filter(item => item.id !== itemId);
            }
            return prevCart.map(item => item.id === itemId ? { ...item, quantity } : item);
        });
    };
    
    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const handleSubmitOrder = () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        // Add note to the first item for simplicity
        const itemsWithNote = cart.map((item, index) => index === 0 ? {...item, note } : item);
        
        // Simulate API call
        setTimeout(() => {
            dispatch({ type: 'PLACE_ORDER', payload: { tableNumber, items: itemsWithNote } });
            setShowBill({ 
                id: `BILL-${Date.now()}`, 
                items: itemsWithNote, 
                total, 
                tableNumber,
                timestamp: Date.now()
            });
            setCart([]);
            setNote('');
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-brand-primary mb-6">เมนูอาหาร</h1>
                {MENU_CATEGORIES.map(category => (
                    <div key={category} className="mb-8">
                        <h2 className="text-2xl font-semibold text-brand-dark border-b-2 border-brand-primary pb-2 mb-4">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {menu.filter(item => item.category === category).map(item => (
                                <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-brand-surface p-6 rounded-lg shadow-2xl">
                    <h2 className="text-2xl font-bold text-brand-primary mb-4">รายการสั่งซื้อ</h2>
                    {cart.length === 0 ? (
                        <p className="text-gray-400">ยังไม่มีรายการอาหารในตะกร้า</p>
                    ) : (
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-brand-dark">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.price} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300">+</button>
                                        <p className="w-20 text-right">{item.price * item.quantity} บาท</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <textarea 
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="หมายเหตุเพิ่มเติม (เช่น ไม่ใส่ผัก, เผ็ดน้อย)"
                            className="w-full bg-gray-100 text-brand-dark p-2 rounded-md border border-gray-300 focus:ring-brand-primary focus:border-brand-primary"
                        />
                        <div className="flex justify-between text-xl font-bold text-brand-dark mt-4">
                            <span>รวมทั้งหมด:</span>
                            <span>{total} บาท</span>
                        </div>
                         <button 
                            onClick={handleSubmitOrder} 
                            disabled={cart.length === 0 || isSubmitting}
                            className="w-full mt-6 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังส่งรายการ...
                                </>
                            ) : "ส่งรายการอาหาร"}
                        </button>
                    </div>
                </div>
            </div>
            {showBill && (
                <BillModal order={showBill} onClose={() => setShowBill(null)} title="สั่งอาหารสำเร็จ!" message="นี่คือใบสรุปรายการและ QR Code สำหรับชำระเงิน" />
            )}
        </div>
    );
};

export default OrderPage;