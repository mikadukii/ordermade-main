import React from 'react';
import LOGO from '../assets/OrdermadeWhite.svg';
import ProfileInfo from './ProfileInfo';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userInfo }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 bg-emerald-600 drop-shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img src={LOGO} alt="Ordermade Logo" className="h-10" />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-white font-semibold hover:bg-emerald-700 px-4 py-2" onClick={() => navigate('/Homepage')}>
            Home
          </button>
          <button className="text-white font-semibold hover:bg-emerald-700 px-4 py-2" onClick={() => navigate('/Portfolio')}>
            Portfolio
          </button>
          <button className="text-white font-semibold hover:bg-emerald-700 px-4 py-2" onClick={() => navigate('/Services')}>
            Services
          </button>
          
          {/* Conditional render: Login or ProfileInfo */}
          {!isToken || !userInfo ? (
            <button className="text-white font-semibold hover:bg-emerald-700 px-4 py-2" onClick={() => navigate('/login')}>
              Log In
            </button>
          ) : (
            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
