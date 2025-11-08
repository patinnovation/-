
import React from 'react';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';
import { Order, OrderStatus } from '../types';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const dispatch = useAppDispatch();

    const handleServeOrder = () => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.id, status: OrderStatus.Served } });
    };
    
    // Extract note from the first item
    const note = order.items.find(item => item.note)?.note;

    return (
        <div className="bg-brand-surface rounded-lg shadow-xl p-6 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-brand-primary">โต๊ะ {order.tableNumber}</h3>
                    <span className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</span>
                </div>
                <ul className="space-y-2 mb-4">
                    {order.items.map(item => (
                        <li key={item.id} className="flex justify-between text-brand-dark">
                            <span>{item.name}</span>
                            <span className="font-semibold">x{item.quantity}</span>
                        </li>
                    ))}
                </ul>
                {note && (
                    <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-400 rounded-r-lg">
                        <p className="text-yellow-800 font-semibold">หมายเหตุ:</p>
                        <p className="text-yellow-900">{note}</p>
                    </div>
                )}
            </div>
            <button
                onClick={handleServeOrder}
                className="w-full mt-6 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
            >
                พร้อมเสิร์ฟ
            </button>
        </div>
    );
};

const KitchenPage: React.FC = () => {
    const { orders } = useAppState();
    const activeOrders = orders.filter(order => order.status === OrderStatus.Placed);

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-brand-primary mb-6">รายการอาหาร (ครัว)</h1>
            {activeOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeOrders.sort((a, b) => a.timestamp - b.timestamp).map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-brand-surface rounded-lg shadow-md">
                    <p className="text-2xl text-gray-400">ไม่มีรายการสั่งซื้อในขณะนี้</p>
                </div>
            )}
        </div>
    );
};

export default KitchenPage;