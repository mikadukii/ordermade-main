import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);

  const servicesId = query.get('servicesId');
  const title = query.get('title');
  const description = query.get('desc');
  const imageURL = query.get('imageURL');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const hasPlacedOrder = useRef(false);

  useEffect(() => {
    const createOrderAndFetchRecommendations = async () => {
      try {
        // ✅ Place the order
        const orderResponse = await axios.post(
          'http://api/place-order',
          { title, description, imageURL, servicesId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (orderResponse.data?.order) {
          toast.success('Order placed successfully');

          // ✅ Fetch recommendations
          const recResponse = await axios.get(
            'http://api/recommended-services',
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (recResponse.data?.recommended) {
            setRecommendations(recResponse.data.recommended);
          }

          setTimeout(() => navigate('/MyOrders'), 1500);
        }
      } catch (error) {
        console.error('Failed to create order or fetch recommendations', error);
        toast.error('Something went wrong');
      }
    };

    if (servicesId && title && description && imageURL && token && !hasPlacedOrder.current) {
      hasPlacedOrder.current = true;
      createOrderAndFetchRecommendations();
    }
  }, [servicesId, title, description, imageURL, token, navigate]);

  return (
    <div className="text-center p-10">
      <h2 className="text-3xl font-bold text-green-600">Thank you!</h2>
      <p className="text-lg mt-3">Your payment was successful.</p>
      <p className="text-md mt-1 text-gray-600">Redirecting to your orders...</p>

      {recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">You might also like:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommendations.map(service => (
              <div key={service._id} className="border rounded p-4 shadow">
                <img src={service.imageURL} alt={service.title} className="w-full h-40 object-cover mb-2" />
                <h4 className="text-lg font-medium">{service.title}</h4>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccess;
