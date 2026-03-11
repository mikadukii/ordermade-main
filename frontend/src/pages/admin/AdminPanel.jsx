import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'services') fetchServices();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/all-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('Failed to fetch orders');
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/all-services', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error('Failed to fetch services');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/update-order-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders(); // Refresh
      toast.success('Order status updated');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded ${activeTab === 'services' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}
          >
            Services
          </button>
        </div>

        {/* Status Filter for Orders */}
        {activeTab === 'orders' && (
          <div className="mb-4">
            <label className="mr-2 font-medium">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {/* Content */}
        {activeTab === 'orders' ? (
          filteredOrders.length > 0 ? (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow-md space-y-2">
                  <p><strong>Title:</strong> {order.title}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  <p><strong>User:</strong> {order.createdBy?.email || 'Unknown'}</p>
                  <p><strong>Service:</strong> {order.servicesId?.title || 'Unknown'}</p>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders found.</p>
          )
        ) : (
          services.length > 0 ? (
            <div className="grid gap-4">
              {services.map((service) => (
                <div key={service._id} className="bg-white p-4 rounded shadow-md">
                  <h2 className="font-bold">{service.title}</h2>
                  <p className="text-sm text-gray-700">{service.description}</p>
                  <p className="text-sm text-gray-500 mt-1">Category: {service.category}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No services found.</p>
          )
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
