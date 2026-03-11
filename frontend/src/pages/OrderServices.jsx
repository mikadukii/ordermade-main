import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage.js';
import { useNavigate } from 'react-router-dom';


const OrderServices = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const { id: servicesId } = useParams();
  const [services, setServices] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

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
    const fetchServices = async () => {
      try {
        const response = await axios.get(`http://api/get-services-id/${servicesId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
         console.log('Fetched services:', response.data.services);
        setServices(response.data.services);
      } catch (err) {
        console.error('Failed to fetch service info:', err);
        toast.error('Failed to fetch service info');
      }
    };
    fetchServices();
  }, [servicesId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !referenceImage) {
      setError('Please fill all fields');
      return;
    }

    try {
      let imageURL = referenceImage;
      if (typeof referenceImage === "object") {
        const imgUploadRes = await uploadImage(referenceImage);
        imageURL = imgUploadRes.imageURL;
      }

      const response = await axios.post(
        'http://localhost:3000/create-checkout-session',
        {
          title,
          description,
          imageURL,
          servicesId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        });

      if (response.data?.url) {
      window.location.href = response.data.url; // ✅ Redirect to Stripe
      }
    } catch (error) {
      console.error('Stripe checkout error:', error);
      toast.error('Payment failed to start');
    }
};

  return (
    <>
     <Navbar userInfo={userInfo} />
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      {services ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{services.title}</h2>
          <img
            src={services.imageURL}
            alt={services.title}
            className="w-full h-60 object-cover rounded mb-2"
          />
          <p className="font-bold">Service Description:</p>
          <p className="text-gray-700">{services.description}</p>
          <p className="font-bold mb-1 mt-1">Price: ${services.price}</p>
          <p className="text-gray-500 mb-3 italic">Category: {services.category}</p>
        </div>
      ) : (
        <p>Loading service...</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block font-semibold mb-1">Order Title</label>
          <input
            type="text"
            placeholder="Order Title"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Order Description</label>
          <textarea
            placeholder="Describe your order"
            className="w-full p-3 border border-gray-300 rounded-lg"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Reference Image</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-emerald-50 file:text-emerald-700
                      hover:file:bg-emerald-100"
            onChange={(e) => setReferenceImage(e.target.files[0])}
          />

          {referenceImage && (
            <div className="mt-2">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={typeof referenceImage === 'string' ? referenceImage : URL.createObjectURL(referenceImage)}
                alt="Reference Preview"
                className="h-32 rounded border border-gray-300"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Submit Order
        </button>
      </form>
    </div>
    </>
  );
};

export default OrderServices;
