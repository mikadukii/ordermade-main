import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AddEditPortfolio from './AddEditPortfolio';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import axios from 'axios';
import PortfolioCard from './PortfolioCard'; // adjust if needed
import { MdAdd } from 'react-icons/md';

const AdminPortfolios = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [modalState, setModalState] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const token = localStorage.getItem('token');

  const fetchPortfolios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/get-portfolio', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolios(res.data.portfolio || []);
    } catch (err) {
      console.error('Failed to fetch portfolios:', err);
      toast.error('Error fetching portfolios');
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleEdit = (portfolio) => {
    setModalState({ isShown: true, type: 'edit', data: portfolio });
  };

  const handleCloseModal = () => {
    setModalState({ isShown: false, type: 'add', data: null });
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manage Portfolios</h1>
          <button
            onClick={() => setModalState({ isShown: true, type: 'add', data: null })}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
          >
            Add New Portfolio
          </button>
        </div>

        {portfolios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <PortfolioCard
                key={portfolio._id}
                imgURL={portfolio.imageURL}
                title={portfolio.title}
                description={portfolio.description}
                onEdit={() => handleEdit(portfolio)}
                onClick={() => handleEdit(portfolio)}
              />
            ))}
          </div>
        ) : (
          <p>No portfolios found.</p>
        )}
      </main>

      <Modal
        isOpen={modalState.isShown}
        onRequestClose={handleCloseModal}
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 1000  } }}
        ariaHideApp={false}
        className="model-box"
      >
        <AddEditPortfolio
          type={modalState.type}
          portfolioInfo={modalState.data}
          onClose={handleCloseModal}
          getPortfolio={fetchPortfolios}
        />
      </Modal>
    </div>
  );
};

export default AdminPortfolios;
