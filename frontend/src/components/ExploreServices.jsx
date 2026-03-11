import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServicesCard from '../pages/admin/ServicesCard';
import axios from 'axios';

const ExploreServices = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://api/services'); // adjust the route if needed
        setServices(response.data.services); // assuming your backend returns { services: [...] }
      } catch (error) {
        console.error('Failed to fetch services', error);
      }
    };

    fetchServices();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/order-services/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-2 text-slate-800">Explore Services</h1>
      <p className="text-slate-600 mb-8">Discover a variety of services tailored to your needs.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <ServicesCard
            key={service._id}
            title={service.title}
            description={service.description}
            imgURL={service.imageURL}
            onClick={() => handleCardClick(service._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExploreServices;
