import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, User, Info, LogOut } from 'lucide-react'; // imported logout icon

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-emerald-600 text-white p-6 space-y-4 hidden md:flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-3">
          <Link to="/admin/orders" className="flex items-center gap-2 hover:text-gray-200 font-semibold">
            Orders
          </Link>
          <Link to="/admin/portfolio" className="flex items-center gap-2 hover:text-gray-200 font-semibold">
            Portfolio
          </Link>
          <Link to="/admin/services" className="flex items-center gap-2 hover:text-gray-200 font-semibold">
            Services
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-white hover:text-gray-200 font-semibold mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
