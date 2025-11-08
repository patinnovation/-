import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';
import { MenuItem, OrderItem } from '../types';
import BillModal from './BillModal';

const CategoryIcon: React.FC<{ category: string; className?: string }> = ({ category, className = "w-6 h-6" }) => {
    const iconProps = {
        className,
        "aria-hidden": "true",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
    };

    switch (category) {
        case 'อาหารจานหลัก':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
            ); // SunIcon
        case 'ของทอด':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
            ); // BoltIcon
        case 'ต้มยำ & ซุป':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.287 8.287 0 0 0 3-7.284 8.25 8.25 0 0 1 3.362 2.897Z" />
                </svg>
            ); // FireIcon
        case 'ของทานเล่น':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                </svg>
            ); // SparklesIcon
        case 'ของหวาน':
            return (
                <svg {...iconProps}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 0 1 12 12m0 0a3.375 3.375 0 0 1 0 7.125M12 12a3.375 3.375 0 0 0-3.375-3.375m3.375 3.375a3.375 3.375 0 0 1 3.375-3.375" />
                </svg>
            ); // CakeIcon
        case 'เครื่องดื่ม':
            return (
                <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.251-.12.516-.239.782-.356a17.938 17.938 0 0 1 8.1 0c.266.117.531.236.782.356M9.75 16.5h.008v.008H9.75V16.5Zm.008-8.292c.266-.117.531-.236.782-.356a17.938 17.938 0 0 0 8.1 0c.266.117.531.236.782.356m0 0a2.25 2.25 0 0 1 .659 1.591v5.714a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V10.8a2.25 2.25 0 0 1 .659-1.591L5 14.5m0 0L9.75 9.75" />
                </svg>
            ); // BeakerIcon
        default:
             return (
                 <svg {...iconProps}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            ); // Circle icon for default
    }
};

const MenuItemCard: React.FC<{ item: MenuItem; onAddToCart: (item: MenuItem) => void }> = ({ item, onAddToCart }) => (
    <div className="bg-brand-surface rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col relative">
        {!item.isAvailable && (
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-lg">
                <span className="text-white text-xl font-bold">สินค้าหมด</span>
            </div>
        )}
        <img className="w-full h-40 object-cover" src={item.image} alt={item.name} />
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex items-start">
                <CategoryIcon category={item.category} className="w-5 h-5 text-brand-primary mt-1 mr-2 flex-shrink-0" />
                <h3 className="text-lg font-semibold text-brand-dark">{item.name}</h3>
            </div>
            {item.description && <p className="text-sm text-gray-500 mt-1 mb-2 flex-grow">{item.description}</p>}
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
    const { menu, categories } = useAppState();
    const dispatch = useAppDispatch();
    const location = useLocation();
    
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showBill, setShowBill] = useState<any | null>(null);
    const [showCartBill, setShowCartBill] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const tableNumber = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return parseInt(params.get('table') || '1', 10);
    }, [location.search]);
    
    const clearCart = () => {
        if (window.confirm('คุณต้องการล้างตะกร้าสินค้าทั้งหมดใช่หรือไม่?')) {
            setCart([]);
        }
    };

    const addToCart = (item: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
                );
            }
            return [...prevCart, { ...item, quantity: 1, note: '' }];
        });
    };
    
    const removeItem = (itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }
        setCart(prevCart => 
            prevCart.map(item => item.id === itemId ? { ...item, quantity } : item)
        );
    };
    
    const updateNote = (itemId: string, note: string) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId ? { ...item, note } : item
            )
        );
    };

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const handleSubmitOrder = () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            dispatch({ type: 'PLACE_ORDER', payload: { tableNumber, items: cart } });
            setShowBill({ 
                id: `BILL-${Date.now()}`, 
                items: cart, 
                total, 
                tableNumber,
                timestamp: Date.now()
            });
            setCart([]);
            setIsSubmitting(false);
        }, 1500);
    };
    
    const filteredMenu = useMemo(() => {
        if (!searchTerm) {
            return menu;
        }
        return menu.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [menu, searchTerm]);

    const CartItemDisplay: React.FC<{ item: OrderItem }> = ({ item }) => (
        <div className="bg-gray-50 p-3 rounded-lg flex flex-col gap-3 border border-gray-200">
            <div className="flex gap-3 items-start">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                <div className="flex-grow">
                    <p className="font-semibold text-brand-dark leading-tight">{item.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{item.price} บาท</p>
                    <div className="flex items-center mt-2">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 h-7 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-200 text-lg font-semibold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary focus:z-10"
                            aria-label={`Decrease quantity of ${item.name}`}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                                const newQuantity = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                                if (!isNaN(newQuantity) && newQuantity >= 0) {
                                    updateQuantity(item.id, newQuantity);
                                }
                            }}
                            className="h-7 w-12 text-center border-t border-b border-gray-300 font-semibold text-md bg-white -ml-px focus:outline-none focus:ring-1 focus:ring-brand-primary focus:z-10"
                            min="0"
                            aria-label={`Quantity for ${item.name}`}
                        />
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 h-7 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-200 text-lg font-semibold text-brand-dark focus:outline-none focus:ring-1 focus:ring-brand-primary focus:z-10 -ml-px"
                            aria-label={`Increase quantity of ${item.name}`}
                        >
                            +
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0 min-h-[4rem]">
                    <p className="text-right font-semibold text-brand-dark">{item.price * item.quantity} บาท</p>
                    <button 
                        onClick={() => {
                            if (window.confirm(`คุณต้องการนำ "${item.name}" ออกจากตะกร้าใช่หรือไม่?`)) {
                                removeItem(item.id);
                            }
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors" 
                        aria-label={`Remove ${item.name}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                      <path d="M16.75 3.25a.75.75 0 0 0-1.06 0l-7.5 7.5a.75.75 0 0 0 0 1.06l1.72 1.72a.75.75 0 0 0 1.06 0l7.5-7.5a.75.75 0 0 0 0-1.06l-1.72-1.72Z" />
                      <path d="M12.28 6.53a.75.75 0 0 0-1.06-1.06l-5.72 5.72a.75.75 0 0 0 0 1.06l1.72 1.72a.75.75 0 0 0 1.06 0l5.72-5.72ZM4.75 13.25a.75.75 0 0 0-1.06 0l-1.72 1.72a.75.75 0 0 0 0 1.06l1.72 1.72a.75.75 0 0 0 1.06 0l1.72-1.72a.75.75 0 0 0 0-1.06l-1.72-1.72Z" />
                    </svg>
                </span>
                <input
                    type="text"
                    value={item.note || ''}
                    onChange={(e) => updateNote(item.id, e.target.value)}
                    placeholder="เพิ่มหมายเหตุ..."
                    className="w-full bg-white text-brand-dark text-sm p-2 pl-10 rounded-md border border-gray-300 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
            </div>
        </div>
    );

    return (
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold text-brand-primary mb-6">เมนูอาหาร</h1>

                <div className="mb-6 relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                         <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="ค้นหาเมนู..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                </div>

                {categories.map(category => {
                    const itemsInCategory = filteredMenu.filter(item => item.category === category);
                    if (itemsInCategory.length === 0) {
                        return null;
                    }
                    return (
                        <div key={category} className="mb-8">
                            <h2 className="text-2xl font-semibold text-brand-dark border-b-2 border-brand-primary pb-2 mb-4">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {itemsInCategory.map(item => (
                                    <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-brand-surface p-6 rounded-lg shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-brand-primary">รายการสั่งซื้อ</h2>
                        {cart.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 text-xs font-bold py-1 px-3 rounded-full flex items-center gap-1 transition-colors"
                                aria-label="Clear all items from cart"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                                <span>ล้างตะกร้า</span>
                            </button>
                        )}
                    </div>
                    {cart.length === 0 ? (
                        <p className="text-gray-400">ยังไม่มีรายการอาหารในตะกร้า</p>
                    ) : (
                        <div className="space-y-4 max-h-[32rem] overflow-y-auto p-1 -mr-2">
                            {cart.map(item => <CartItemDisplay key={item.id} item={item} />)}
                        </div>
                    )}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex justify-between text-xl font-bold text-brand-dark mt-4">
                            <span>รวมทั้งหมด:</span>
                            <span>{total} บาท</span>
                        </div>
                         <button 
                            onClick={handleSubmitOrder} 
                            disabled={cart.length === 0 || isSubmitting}
                            className="w-full mt-4 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังส่งรายการ...
                                </>
                            ) : "สั่งอาหาร"}
                        </button>
                    </div>
                </div>
            </div>
            {showBill && (
                <BillModal order={showBill} onClose={() => setShowBill(null)} title="สั่งอาหารสำเร็จ!" message="นี่คือใบสรุปรายการและ QR Code สำหรับชำระเงิน" />
            )}
            {showCartBill && (
                <BillModal
                    order={{
                        id: `CART-${tableNumber}`,
                        items: cart,
                        total,
                        tableNumber,
                        timestamp: Date.now(),
                    }}
                    onClose={() => setShowCartBill(false)}
                    title="ใบสรุปรายการ (ก่อนสั่ง)"
                    message="ตรวจสอบรายการอาหารในตะกร้าของคุณ"
                />
            )}
        </div>
    );
};

export default OrderPage;