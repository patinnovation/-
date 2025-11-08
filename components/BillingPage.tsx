
import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';
import { Order, OrderStatus } from '../types';
import BillModal from './BillModal';

const BillingPage: React.FC = () => {
    const { orders } = useAppState();
    const dispatch = useAppDispatch();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const unpaidOrders = orders.filter(order => order.status === OrderStatus.Served);

    const handleMarkAsPaid = (orderId: string) => {
        dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: OrderStatus.Paid } });
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-brand-dark mb-4">รายการรอชำระเงิน</h2>
            {unpaidOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {unpaidOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-md border">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-brand-dark">โต๊ะ {order.tableNumber}</h3>
                                <p className="text-lg font-semibold text-brand-primary">{order.total} บาท</p>
                            </div>
                            <div className="flex space-x-2 mt-4">
                                <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-bold py-2 px-3 rounded"
                                >
                                    ดู/พิมพ์ใบเสร็จ
                                </button>
                                <button
                                    onClick={() => handleMarkAsPaid(order.id)}
                                    className="flex-1 bg-brand-primary hover:bg-opacity-80 text-white text-sm font-bold py-2 px-3 rounded"
                                >
                                    ชำระเงินแล้ว
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">ไม่มีรายการที่รอชำระเงิน</p>
            )}

            {selectedOrder && (
                <BillModal order={selectedOrder} onClose={() => setSelectedOrder(null)} title="ใบเสร็จรับเงิน" />
            )}
        </div>
    );
};

export default BillingPage;