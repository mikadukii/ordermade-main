import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const navigate = useNavigate();
    const [formsData, setFormsData] = useState({
        username: '',
        email: '',
        password: '',
        bustSize: '',
        waistSize: '',
        hipSize: ''    
    });
    const [message, setMessage] = useState({ type: '', content: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await axios.post(`${API_URL}/register`, formsData);

            if (response.data.accessToken && response.data.user) {
            // ✅ Save token and user info
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            // ✅ Show toast and redirect
            toast.success("Registration successful! Redirecting...", { autoClose: 2000 });

            setTimeout(() => {
                navigate('/');
            }, 2000);
            }
        } catch (error) {
            setMessage({
            type: 'error',
            content: error.response?.data?.message || 'Registration failed'
            });
        }
        };

    
    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-600 px-4">
            <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Welcome to Ordermade</h1>
                    <p className="text-gray-600 text-lg mt-2">Create your account to get started</p>
                </div>

                {message.content && (
                    <Alert type={message.type} message={message.content} />
                )}

                <form onSubmit={handleSubmit} className="space-y-8" data-testid="register-form">
                    {/* Personal Information */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-l font-bold">Username</label>
                            <input
                                type="text"
                                id="username"
                                data-testid="username"
                                value={formsData.username}
                                onChange={(e) => setFormsData({ ...formsData, username: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-l font-bold">Email</label>
                            <input
                                type="email"
                                id="email"
                                data-testid="email"
                                value={formsData.email}
                                onChange={(e) => setFormsData({ ...formsData, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-l font-bold">Password</label>
                            <input
                                type="password"
                                id="password"
                                data-testid="password"
                                value={formsData.password}
                                onChange={(e) => setFormsData({ ...formsData, password: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Body measurements section */}
                        <div>
                            <label htmlFor="bustSize" className="block text-l font-bold">Bust Size</label>
                            <input
                                type="text"
                                id="bustSize"
                                data-testid="bustSize"
                                value={formsData.bustSize}
                                onChange={(e) => setFormsData({ ...formsData, bustSize: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your bust size"
                            />
                        </div>

                        <div>
                            <label htmlFor="waistSize" className="block text-l font-bold">Waist Size</label>
                            <input
                                type="text"
                                id="waistSize"
                                data-testid="waistSize"
                                value={formsData.waistSize}
                                onChange={(e) => setFormsData({ ...formsData, waistSize: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your waist size"
                            />
                        </div>

                        <div>
                            <label htmlFor="hipSize" className="block text-l font-bold">Hip Size</label>
                            <input
                                type="text"
                                id="hipSize"
                                data-testid="hipSize"
                                value={formsData.hipSize}
                                onChange={(e) => setFormsData({ ...formsData, hipSize: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                                transition-all duration-200"
                                placeholder="Enter your hip size"
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                            data-testid="register-submit"
                        >
                            Register
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account? 
                        <Link to="/login" className="text-emerald-500 hover:underline font-medium" data-testid="login-link">
                            Click here to login
                        </Link>
                    </p>
                </div>
                <div className="text-center text-emerald-800 text-xs mt-4">
                Ordermade - fashion based application for customized experience and connect with fashion designers<br />
                <span className="text-emerald-800">© 2025 All rights reserved made by Michelle Christi Tandiono e2100306 for BIT305</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
