import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  
  const getTableNumber = () => {
    const params = new URLSearchParams(location.search);
    return params.get('table');
  };

  const tableNumber = getTableNumber();

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      isActive
        ? 'bg-brand-primary text-white'
        : 'text-brand-dark hover:bg-brand-light hover:text-brand-primary'
    }`;

  const isCustomerView = location.pathname === '/';

  return (
    <header className="bg-brand-surface shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-brand-primary">
              ครัวบ้านโอ่ง
            </span>
            {tableNumber && (
              <span className="ml-4 text-sm bg-brand-primary text-white font-semibold px-3 py-1 rounded-full">
                โต๊ะ {tableNumber}
              </span>
            )}
          </div>
          {!isCustomerView && (
            <nav className="flex space-x-2">
              <NavLink to={`/?table=${tableNumber || '1'}`} className={navLinkClass}>
                สั่งอาหาร
              </NavLink>
              <NavLink to="/kitchen" className={navLinkClass}>
                ห้องครัว
              </NavLink>
              <NavLink to="/owner" className={navLinkClass}>
                เจ้าของร้าน
              </NavLink>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;