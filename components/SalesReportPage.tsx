import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppState } from '../hooks/useAppStore';
import { Order, OrderStatus } from '../types';
import { generateSalesAnalysis } from '../services/geminiService';

const SalesReportPage: React.FC = () => {
    const { orders, menu } = useAppState();
    const [analysis, setAnalysis] = useState('');
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const paidOrders = useMemo(() => orders.filter(order => order.status === OrderStatus.Paid), [orders]);

    const salesToday = useMemo(() => {
        const today = new Date().toDateString();
        return paidOrders
            .filter(order => new Date(order.timestamp).toDateString() === today)
            .reduce((sum, order) => sum + order.total, 0);
    }, [paidOrders]);
    
    const salesThisMonth = useMemo(() => {
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        return paidOrders
            .filter(order => {
                const orderDate = new Date(order.timestamp);
                return orderDate.getMonth() === thisMonth && orderDate.getFullYear() === thisYear;
            })
            .reduce((sum, order) => sum + order.total, 0);
    }, [paidOrders]);

    const salesByDay = useMemo(() => {
        const salesMap = new Map<string, number>();
        paidOrders.forEach(order => {
            const day = new Date(order.timestamp).toLocaleDateString('th-TH');
            salesMap.set(day, (salesMap.get(day) || 0) + order.total);
        });
        return Array.from(salesMap.entries()).map(([name, sales]) => ({ name, sales })).slice(-30);
    }, [paidOrders]);

    const topSellingItems = useMemo(() => {
        const itemCounts = new Map<string, {name: string, quantity: number}>();
        paidOrders.forEach(order => {
            order.items.forEach(item => {
                const existing = itemCounts.get(item.id);
                itemCounts.set(item.id, { 
                    name: item.name, 
                    quantity: (existing?.quantity || 0) + item.quantity 
                });
            });
        });
        return Array.from(itemCounts.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    }, [paidOrders]);
    
    const handleGenerateAnalysis = async () => {
        setIsLoadingAnalysis(true);
        setAnalysis('');
        const result = await generateSalesAnalysis(paidOrders);
        setAnalysis(result);
        setIsLoadingAnalysis(false);
    };

    const exportToCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "OrderID,Table,Total,Date,Items\n";

        paidOrders.forEach(order => {
            const date = new Date(order.timestamp).toLocaleString('th-TH');
            const items = order.items.map(i => `${i.name} (x${i.quantity})`).join('; ');
            csvContent += `${order.id},${order.tableNumber},${order.total},"${date}","${items}"\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-brand-dark">ภาพรวมยอดขาย</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-gray-500">ยอดขายวันนี้</h3>
                    <p className="text-3xl font-bold text-brand-primary mt-2">{salesToday.toLocaleString()} บาท</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-gray-500">ยอดขายเดือนนี้</h3>
                    <p className="text-3xl font-bold text-brand-primary mt-2">{salesThisMonth.toLocaleString()} บาท</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-gray-500">จำนวนออเดอร์ทั้งหมด</h3>
                    <p className="text-3xl font-bold text-brand-primary mt-2">{paidOrders.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-xl font-semibold text-brand-dark mb-4">ยอดขายรายวัน</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}/>
                            <Legend />
                            <Bar dataKey="sales" fill="#2563EB" name="ยอดขาย (บาท)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border">
                    <h3 className="text-xl font-semibold text-brand-dark mb-4">5 รายการขายดี</h3>
                    <ul className="space-y-3">
                        {topSellingItems.map((item, index) => (
                             <li key={index} className="flex justify-between items-center text-brand-dark">
                                <span>{index+1}. {item.name}</span>
                                <span className="font-bold text-brand-primary">{item.quantity} จาน</span>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-semibold text-brand-dark mb-4">วิเคราะห์ยอดขายด้วย AI</h3>
                <button
                    onClick={handleGenerateAnalysis}
                    disabled={isLoadingAnalysis}
                    className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors disabled:bg-gray-400"
                >
                    {isLoadingAnalysis ? 'กำลังวิเคราะห์...' : 'สร้างบทวิเคราะห์'}
                </button>
                {analysis && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md whitespace-pre-wrap font-mono text-gray-700 border">
                        {analysis}
                    </div>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-brand-dark">ตารางสรุปยอดขาย</h3>
                    <button onClick={exportToCSV} className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                        Export to CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-brand-dark">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">โต๊ะ</th>
                                <th className="p-3">ยอดรวม</th>
                                <th className="p-3">วันที่</th>
                                <th className="p-3">รายการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paidOrders.slice().reverse().map(order => (
                                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-3">{order.tableNumber}</td>
                                    <td className="p-3">{order.total}</td>
                                    <td className="p-3">{new Date(order.timestamp).toLocaleString('th-TH')}</td>
                                    <td className="p-3 text-sm">{order.items.map(i => i.name).join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default SalesReportPage;