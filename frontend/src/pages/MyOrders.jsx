import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MyOrders = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  // Fetch user profile
      const getUserInfo = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
    
        try {
          const response = await axios.get("http://api/get-user-profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          if (response.data?.user) {
            setUserInfo(response.data.user);
          }
        } catch (error) {
          console.error("Fetch failed:", error);
          if (error.response?.status === 401) {
            localStorage.clear();
            navigate("/login");
          }
        }
      };

  useEffect(() => {
    getUserInfo();
    

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3000/user-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Could not load orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
    <Navbar userInfo={userInfo} />
    

    <div className="p-6 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition duration-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{decodeURIComponent(order.title)}</h2>
              <span
                className={`text-sm font-medium px-2 py-1 rounded ${
                  order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-gray-600 mb-1">{decodeURIComponent(order.description)}</p>
            <p className="text-sm text-gray-500">
              Service: <span className="italic">{order.servicesId?.title || 'N/A'}</span>
            </p>
            <p className="text-sm text-gray-400">
              Ordered on: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

        </div>
      )}
    </div>
    </>
  );
};

export default MyOrders;
