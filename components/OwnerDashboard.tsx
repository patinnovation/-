
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import BillingPage from './BillingPage';
import SalesReportPage from './SalesReportPage';
import MenuEditorPage from './MenuEditorPage';
import PaymentMethodsPage from './PaymentMethodsPage';

const OwnerDashboard: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
      isActive
        ? 'border-brand-primary text-brand-primary'
        : 'border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300'
    }`;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-brand-primary mb-4">แดชบอร์ดเจ้าของร้าน</h1>
      <nav className="flex space-x-2 border-b border-gray-200 mb-6">
        <NavLink to="/owner/" end className={navLinkClass}>
          คิดเงิน
        </NavLink>
        <NavLink to="/owner/reports" className={navLinkClass}>
          สรุปยอดขาย
        </NavLink>
        <NavLink to="/owner/menu" className={navLinkClass}>
          จัดการเมนู
        </NavLink>
        <NavLink to="/owner/payment" className={navLinkClass}>
          ช่องทางการชำระเงิน
        </NavLink>
      </nav>
      <div className="bg-brand-surface p-6 rounded-lg shadow-lg">
        <Routes>
          <Route path="/" element={<BillingPage />} />
          <Route path="reports" element={<SalesReportPage />} />
          <Route path="menu" element={<MenuEditorPage />} />
          <Route path="payment" element={<PaymentMethodsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;
