import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const EditProfile = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    bustSize: '',
    waistSize: '',
    hipSize: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');

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
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    axios.get('http://api/get-user-profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const user = res.data.user;
      setFormData({
        username: user.username || '',
        bustSize: user.bustSize || '',
        waistSize: user.waistSize || '',
        hipSize: user.hipSize || '',
      });
      setUserId(user._id);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setMessage('Failed to load profile');
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://api/edit-profile/${userId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <>
      <Navbar userInfo={userInfo}/>
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>

          {message && (
            <p className="text-center text-sm text-emerald-600 mb-4">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Bust Size</label>
              <input
                type="number"
                name="bustSize"
                value={formData.bustSize}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Waist Size</label>
              <input
                type="number"
                name="waistSize"
                value={formData.waistSize}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1">Hip Size</label>
              <input
                type="number"
                name="hipSize"
                value={formData.hipSize}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
