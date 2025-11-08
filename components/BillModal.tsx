import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Order, OrderItem } from '../types';
import { RESTAURANT_PROMPT_PAY_MOBILE } from '../constants';
import { generatePromptPayQR } from '../utils/promptpay';
import { useAppState } from '../hooks/useAppStore';

interface BillModalProps {
    order: Partial<Order> & { items: OrderItem[] };
    onClose: () => void;
    title: string;
    message?: string;
}

const BillModal: React.FC<BillModalProps> = ({ order, onClose, title, message }) => {
    const billRef = useRef<HTMLDivElement>(null);
    const { paymentMethods } = useAppState();
    const promptPayQRData = generatePromptPayQR(RESTAURANT_PROMPT_PAY_MOBILE, order.total);

    const handlePrint = () => {
        if (billRef.current) {
            html2canvas(billRef.current, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a5');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`bill-${order.id}.pdf`);
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-2xl max-w-sm w-full">
                <div ref={billRef} className="p-6 bg-white text-black">
                    <div className="text-center mb-4">
                        <h2 className="text-xl font-bold">ครัวบ้านโอ่ง</h2>
                        <p className="text-sm">ใบเสร็จ/ใบสรุปรายการ</p>
                    </div>
                    <p><strong>โต๊ะ:</strong> {order.tableNumber}</p>
                    <p><strong>วันที่:</strong> {new Date(order.timestamp || Date.now()).toLocaleString('th-TH')}</p>
                    <p><strong>เลขที่:</strong> {order.id}</p>
                    <hr className="my-3 border-gray-400" />
                    <div className="space-y-1">
                        {order.items.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-3 border-gray-400" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>รวมทั้งสิ้น</span>
                        <span>{order.total?.toFixed(2)} บาท</span>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                         { (paymentMethods.promptPay || (paymentMethods.bankTransfer.enabled && paymentMethods.bankTransfer.details) || paymentMethods.cash) && 
                            <p className="text-center font-bold text-sm">ช่องทางการชำระเงิน</p> 
                        }

                        {paymentMethods.promptPay && (
                            <div className="flex flex-col items-center border p-3 rounded-md">
                                <p className="font-semibold mb-2">PromptPay</p>
                                <QRCodeSVG value={promptPayQRData} size={150} />
                            </div>
                        )}

                        {paymentMethods.bankTransfer.enabled && paymentMethods.bankTransfer.details && (
                            <div className="border p-3 rounded-md">
                                <p className="font-semibold mb-2 text-center">โอนผ่านบัญชีธนาคาร</p>
                                <p className="text-sm whitespace-pre-wrap text-center">{paymentMethods.bankTransfer.details}</p>
                            </div>
                        )}
                        
                        {paymentMethods.cash && (
                            <div className="text-center text-sm text-gray-600 border p-3 rounded-md">
                                <p>สามารถชำระด้วยเงินสดได้</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
                    <h3 className="text-xl font-bold text-brand-primary text-center">{title}</h3>
                    {message && <p className="text-center text-brand-secondary mt-1">{message}</p>}
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-colors"
                        >
                            พิมพ์ PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            ปิด
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillModal;
