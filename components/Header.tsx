import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tableNumberFromUrl = params.get('table') || '1';
  
  const [tableInput, setTableInput] = useState(tableNumberFromUrl);

  useEffect(() => {
    setTableInput(tableNumberFromUrl);
  }, [tableNumberFromUrl]);
  
  const handleTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTable = e.target.value;
    setTableInput(newTable);
    // Update URL only if the path is the order page
    if (location.pathname === '/') {
       navigate(`/?table=${newTable || '1'}`, { replace: true });
    }
  };


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
            {isCustomerView ? (
              <div className="ml-4 flex items-center gap-2">
                <label htmlFor="table-number-input" className="text-sm font-semibold text-brand-dark">โต๊ะ:</label>
                <input
                  id="table-number-input"
                  type="number"
                  value={tableInput}
                  onChange={handleTableChange}
                  className="w-20 p-1 border border-gray-300 rounded-md shadow-sm text-center focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  min="1"
                  aria-label="Table number"
                />
              </div>
            ) : (
              <span className="ml-4 text-sm bg-brand-primary text-white font-semibold px-3 py-1 rounded-full">
                โต๊ะ {tableNumberFromUrl}
              </span>
            )}
          </div>
          {!isCustomerView && (
            <nav className="flex space-x-2">
              <NavLink to={`/?table=${tableNumberFromUrl}`} className={navLinkClass}>
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