import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [imageModal, setImageModal] = useState({ isOpen: false, url: '' });
  const [showUserDetails, setShowUserDetails] = useState({}); // track toggle per order
  const token = localStorage.getItem('token');

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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/update-order-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
      toast.success('Order status updated');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update status');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const toggleUserDetails = (orderId) => {
    setShowUserDetails((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const openImageModal = (url) => {
    setImageModal({ isOpen: true, url });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, url: '' });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <AdminSidebar />

      <div className="p-4 space-y-9 flex-1">
        <h1 className="text-2xl font-bold">Manage Orders</h1>

        <div>
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

        {filteredOrders.length > 0 ? (
          <div className="grid gap-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white p-4 rounded shadow space-y-1">
                <p><strong>Title:</strong> {decodeURIComponent(order.title)}</p>
                <p><strong>Description:</strong> {decodeURIComponent(order.description)}</p>
                <p><strong>Price:</strong> ${order.servicesId?.price?.toFixed(2) ?? 'N/A'}</p>

                <p><strong>Ordered from User:</strong> {order.createdBy?.email || 'Unknown'}</p>

                {/* User measurements */}
                {order.createdBy ? (
                  <div className="mt-2 bg-gray-50 p-2 rounded">
                    <p><strong>Bust Size:</strong> {order.createdBy.bustSize ?? 'N/A'}</p>
                    <p><strong>Waist Size:</strong> {order.createdBy.waistSize ?? 'N/A'}</p>
                    <p><strong>Hip Size:</strong> {order.createdBy.hipSize ?? 'N/A'}</p>
                  </div>
                ) : (
                  <p>No user measurements available</p>
                )}


                <p><strong>Services:</strong> {order.servicesId?.title || 'Unknown'}</p>
                <p>
                  <strong>Reference Image:</strong>{' '}
                  {order.imageURL ? (
                    <button
                      onClick={() => openImageModal(order.imageURL)}
                      className="text-blue-600 hover:underline"
                    >
                      View Image
                    </button>
                  ) : (
                    'No image'
                  )}
                </p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><small>Created At: {new Date(order.createdAt).toLocaleString()}</small></p>

                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  className="border rounded px-2 py-1 mt-5"
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
        )}

        {/* Image Modal */}
        {imageModal.isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={closeImageModal}
          >
            <img
              src={imageModal.url}
              alt="Reference"
              className="max-w-full max-h-full rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white bg-red-600 rounded-full p-2"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
