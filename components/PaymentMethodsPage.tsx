import React, { useState } from 'react';
import { useAppState, useAppDispatch } from '../hooks/useAppStore';
import { PaymentMethodsState } from '../types';

const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label: string }> = ({ enabled, onChange, label }) => (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <span className="text-lg font-medium text-brand-dark">{label}</span>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${enabled ? 'bg-brand-primary' : 'bg-gray-200'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);


const PaymentMethodsPage: React.FC = () => {
    const { paymentMethods } = useAppState();
    const dispatch = useAppDispatch();
    
    const [settings, setSettings] = useState<PaymentMethodsState>(paymentMethods);
    const [isSaved, setIsSaved] = useState(false);

    const handleToggle = (key: 'cash' | 'promptPay') => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleBankTransferToggle = () => {
        setSettings(prev => ({
            ...prev,
            bankTransfer: { ...prev.bankTransfer, enabled: !prev.bankTransfer.enabled },
        }));
    };

    const handleBankDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSettings(prev => ({
            ...prev,
            bankTransfer: { ...prev.bankTransfer, details: e.target.value },
        }));
    };

    const handleSaveChanges = () => {
        dispatch({ type: 'UPDATE_PAYMENT_METHODS', payload: settings });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-brand-dark mb-6">จัดการช่องทางการชำระเงิน</h2>
            <div className="space-y-6">
                <ToggleSwitch
                    label="เงินสด"
                    enabled={settings.cash}
                    onChange={() => handleToggle('cash')}
                />
                <ToggleSwitch
                    label="PromptPay QR Code"
                    enabled={settings.promptPay}
                    onChange={() => handleToggle('promptPay')}
                />
                <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-brand-dark">โอนผ่านบัญชีธนาคาร</span>
                        <button
                            onClick={handleBankTransferToggle}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary ${settings.bankTransfer.enabled ? 'bg-brand-primary' : 'bg-gray-200'}`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${settings.bankTransfer.enabled ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                        </button>
                    </div>
                    {settings.bankTransfer.enabled && (
                        <div>
                            <label htmlFor="bankDetails" className="block text-sm font-medium text-gray-700 mb-2">
                                รายละเอียดบัญชี (เช่น ชื่อธนาคาร, เลขบัญชี, ชื่อบัญชี)
                            </label>
                            <textarea
                                id="bankDetails"
                                rows={4}
                                value={settings.bankTransfer.details}
                                onChange={handleBankDetailsChange}
                                placeholder="กรอกรายละเอียดที่นี่..."
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center gap-4">
                     {isSaved && (
                        <span className="text-green-600 font-semibold transition-opacity duration-300">
                            บันทึกแล้ว!
                        </span>
                    )}
                    <button
                        onClick={handleSaveChanges}
                        className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-opacity-80 transition-colors"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodsPage;
