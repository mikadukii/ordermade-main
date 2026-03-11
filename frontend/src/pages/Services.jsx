import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServicesCard from './admin/ServicesCard';
import AddEditServices from './admin/AddEditServices';
import Modal from 'react-modal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Services = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axios.get("http://api/get-user-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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

  // Remove Authorization header here because your backend /services route is public
  const getServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://api/services");
      if (response.data?.services) {
        setServiceItems(response.data.services);
      }
    } catch (error) {
      console.error("Unexpected Error Occurred:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, data = null) => {
    setOpenAddEditModal({ isShown: true, type, data });
  };

  const closeModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  // Fix here: pass type and data separately instead of a single object
  const handleEditService = (item) => {
    openModal("edit", item);
  };

  const handleViewService = (item) => {
    navigate(`/order-services/${item._id}`);
  };

  useEffect(() => {
    getUserInfo();
    getServices();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-gray-800 px-8 mb-2">Services List</h1>
        <p className="text-xl font-semibold text-gray-500 px-8 mb-2">List of services available</p>
        <div className="flex gap-7">

          <div className="flex-1">
            {loading ? (
              <p>Loading services...</p>
            ) : serviceItems.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 px-8">
                {serviceItems.map((item) => (
                  <ServicesCard
                    key={item._id}
                    imgURL={item.imageURL}
                    title={item.title}
                    description={item.description}
                    onEdit={() => handleEditService(item)}
                    onClick={() => handleViewService(item)}
                    isAdmin={userInfo?.isAdmin}
                  />
                ))}
              </div>
            ) : (
              <p className="px-8">No services added yet. Start adding one!</p>
            )}
          </div>

          {/* Optional sidebar */}
          <div className="w-[320px]"></div>
        </div>
      </div>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.2)', zIndex: 1000  },
        }}
        ariaHideApp={false}
        className="model-box"
      >
        <AddEditServices
          type={openAddEditModal.type}
          serviceInfo={openAddEditModal.data}
          onClose={closeModal}
          getServices={getServices}
        />
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Services;
