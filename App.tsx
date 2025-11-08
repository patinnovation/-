
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import OrderPage from './components/OrderPage';
import KitchenPage from './components/KitchenPage';
import OwnerDashboard from './components/OwnerDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-brand-light text-brand-dark font-sans">
        <Header />
        <main className="p-4 md:p-8">
          <Routes>
            <Route path="/" element={<OrderPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
            <Route path="/owner/*" element={<OwnerDashboard />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;