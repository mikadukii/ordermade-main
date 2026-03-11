import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServicesCard from '../admin/ServicesCard';
import AddEditServices from '../admin/AddEditServices';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [modalState, setModalState] = useState({
    isShown: false,
    type: 'add',      // 'add' or 'edit'
    data: null,       // service data for edit, null for add
  });

  const token = localStorage.getItem('token');

  const getServices = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/admin/all-services", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data.services || []);
    } catch (error) {
      toast.error("Failed to fetch services");
      console.error("Error fetching services:", error);
    }
  };

  // Open modal to add new service
  const handleAdd = () => {
    setModalState({
      isShown: true,
      type: 'add',
      data: null,
    });
  };

  // Open modal to edit existing service
  const handleEdit = (service) => {
    setModalState({
      isShown: true,
      type: 'edit',
      data: service,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      isShown: false,
      type: 'add',
      data: null,
    });
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      <AdminSidebar />

      <div className="p-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Services</h2>
          <button
            onClick={handleAdd}
            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            Add New Service
          </button>
        </div>

        {services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.map(service => (
              <ServicesCard
                key={service._id}
                imgURL={service.imageURL}
                title={service.title}
                description={service.description}
                onClick={() => handleEdit(service)}
              />
            ))}
          </div>
        )}

        {/* Modal for Add/Edit Services */}
        <Modal
          isOpen={modalState.isShown}
          onRequestClose={handleCloseModal}
          style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000  } }}
          ariaHideApp={false}
          className="model-box"
        >
          <AddEditServices
            type={modalState.type}
            serviceInfo={modalState.data}  // note: I fixed prop name to `serviceInfo` here
            onClose={handleCloseModal}
            getServices={getServices}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminServices;
