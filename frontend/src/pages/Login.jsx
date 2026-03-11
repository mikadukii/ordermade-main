import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Alert from '../components/Alert.jsx';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const tempCredentials = sessionStorage.getItem('tempCredentials');
    if (tempCredentials) {
      const credentials = JSON.parse(tempCredentials);
      setFormData(credentials);
      sessionStorage.removeItem('tempCredentials');
    }
  }, []);

  const handleSubmit = async (e) => {
    console.log('Submitting login:', formData);

    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_URL}/login`, formData);

      if (!response.data.error && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('userId', response.data.user.userId);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setMessage({
          type: 'success',
          content: response.data.message || 'Login successful',
        });

        setTimeout(() => {
          const intendedPath = localStorage.getItem('intendedPath') || 
            (response.data.user.role === 'admin' ? '/admin' : '/homepage');
          localStorage.removeItem('intendedPath');
          navigate(intendedPath);
        }, 1500);
      } else {
        // Defensive fallback if backend sends error:true
        setMessage({
          type: 'error',
          content: response.data.message || 'Login failed',
        });
      }
    } catch (error) {
      console.error('Login error:', error);

      const errorMsg = error.response?.data?.message
        || error.message
        || 'Login failed due to network or server error';

      setMessage({
        type: 'error',
        content: errorMsg,
      });
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-emerald-600" data-testid="login-page">
      <div className="relative z-10 max-w-md mx-auto w-full">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900" data-testid="login-title">
              Welcome back to Ordermade
            </h1>
          </div>

          {message.content && (
            <Alert type={message.type} message={message.content} />
          )}

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
            <div>
              <label htmlFor="email" className="block text-l font-bold">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="Enter your email"
                data-testid="email-input"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent 
                  transition-all duration-200"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-l font-bold">
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                placeholder="Enter your password"
                data-testid="login-password-input"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent 
                  transition-all duration-200"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              data-testid="login-submit"
              className="w-full py-2.5 bg-emerald-500 text-white font-semibold rounded-lg 
                hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 
                focus:ring-offset-2 transition-all duration-200"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-500 hover:underline" data-testid="register-link">
                Registration Here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-white text-xs mt-4">
          Ordermade - fashion based application for customized experience and connect with fashion designers<br />
          <span className="text-gray-200">© 2025 All rights reserved made by Michelle Christi Tandiono e2100306 for BIT305</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
