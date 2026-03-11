import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar'; // ✅ Import Navbar
import Header from '../components/Header';
import ExploreServices from '../components/ExploreServices'; // ✅ Import ExploreServices

const HomePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

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
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => setUserInfo(res.data))
        .catch(err => {
          console.error(err);
          localStorage.clear(); // optional: logout on error
        });
    }
  }, []);

  

  return (
    <div>
      <Navbar userInfo={userInfo} /> {/* ✅ Add Navbar with userInfo */}
      <Header />
      <ExploreServices /> 
    </div>
  );
};

export default HomePage;
