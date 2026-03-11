import React, { useState, useRef, useEffect } from 'react';

const ProfileInfo = ({ userInfo, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="text-white font-semibold hover:bg-emerald-700 px-4 py-2 rounded-md"
      >
        Hello, {userInfo?.username}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50">
          <button
            onClick={() => {
              setDropdownOpen(false);
              window.location.href = '/Profile'; // or use navigate if passed
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </button>

          <button
            onClick={() => {
              setDropdownOpen(false);
              window.location.href = '/MyOrders'; // or use navigate if passed
            }}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            My Orders
          </button>

          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
