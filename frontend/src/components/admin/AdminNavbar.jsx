import { Link, useNavigate } from "react-router-dom";
import { getUserInfo } from "../utils/auth";
import { useEffect, useState } from "react";


const AdminNavbar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const info = getUserInfo();
    if (!info?.isAdmin) {
      navigate("/"); // non-admins should not access this
    } else {
      setUserInfo(info);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <Link to="/admin/dashboard" className="text-2xl font-bold text-white">
        Admin Dashboard
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/admin/services" className="hover:text-gray-300">Manage Services</Link>
        <Link to="/admin/orders" className="hover:text-gray-300">View Orders</Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
