import React from 'react';
import { Home, User, Folder, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-emerald-600 text-white p-6 space-y-4 hidden md:block">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <nav className="space-y-3">
        <Link to="/" className="flex items-center gap-2 hover:text-gray-200">
          <Dashboard size={18} /> Dashboard
        </Link>
        <Link to="/portfolio" className="flex items-center gap-2 hover:text-gray-200">
          <Folder size={18} /> Orders
        </Link>
        <Link to="/services" className="flex items-center gap-2 hover:text-gray-200">
          <User size={18} /> Add Portfolio
        </Link>
        <Link to="/about" className="flex items-center gap-2 hover:text-gray-200">
          <Info size={18} /> Add Services
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
