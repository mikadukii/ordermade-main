import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
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

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/get-user-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setMessage('Failed to load profile.');
        if (err.response?.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    };

    fetchProfile();
  }, []);

  

  return (
    <>
      <Navbar userInfo={userInfo}/>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">My Profile</h2>

          {message && <p className="text-red-500 text-center">{message}</p>}

          {user && (
            <div className="space-y-4 text-center">
              
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Bust:</strong> {user.bustSize || '-'}</p>
              <p><strong>Waist:</strong> {user.waistSize || '-'}</p>
              <p><strong>Hip:</strong> {user.hipSize || '-'}</p>
              <button
                className="mt-4 py-2 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                onClick={() => window.location.href = '/EditProfile'}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
