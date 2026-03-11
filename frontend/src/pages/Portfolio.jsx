import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PortfolioCard from './admin/PortfolioCard';
import AddEditPortfolio from './admin/AddEditPortfolio';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdAdd } from 'react-icons/md';

const Portfolio = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [loading, setLoading] = useState(true);  // To handle loading state

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

  // Fetch portfolio items
  const getPortfolio = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await axios.get("http://api/get-portfolio", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.data?.portfolio) {
        setPortfolioItems(response.data.portfolio);
      }
    } catch (error) {
      console.log("Unexpected Error Occurred...", error);
      toast.error("Failed to load portfolio. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after fetching (success or failure)
    }
  };

  // Open modal for adding or editing portfolio
  const openModal = (type, data = null) => {
    setOpenAddEditModal({ isShown: true, type, data });
  };

  // Close modal
  const closeModal = () => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  };

  // Handle edit action
  const handleEditPortfolio = (item) => {
    openModal("edit", item);
  };

  // Handle view action (Currently, just logging to console)
  const handleViewPortfolio = (item) => {
    console.log("View portfolio item", item);
  };

  // Effect to get data on component mount
  useEffect(() => {
    getPortfolio();
    getUserInfo();
  }, []);

  
  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-gray-800 px-8 mb-2">Portfolio</h1>
        <p className="text-xl font-semibold text-gray-500 px-8 mb-2">Portfolio showcase that made by designers</p>
        <div className="flex gap-7">
          
          <div className="flex-1">
            {loading ? (
              <p>Loading portfolios...</p>
            ) : portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 px-8 py-2">
                {portfolioItems.map((item) => (
                  <PortfolioCard
                    key={item._id}
                    imgURL={item.imageURL}
                    title={item.title}
                    description={item.description}
                    onEdit={() => handleEditPortfolio(item)}
                    onClick={() => handleViewPortfolio(item)}
                  />
                ))}
              </div>
            ) : (
              <p>No portfolio added yet. Start adding one!</p>
            )}
          </div>

          {/* Optional sidebar */}
          <div className="w-[320px]"></div>
        </div>
      </div>

      {/* Modal for Add/Edit Portfolio */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 1000  },
        }}
        ariaHideApp={false}
        className="model-box"
      >
        <AddEditPortfolio
          type={openAddEditModal.type}
          portfolioInfo={openAddEditModal.data}
          onClose={closeModal}
          getPortfolio={getPortfolio}
        />
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Portfolio;
