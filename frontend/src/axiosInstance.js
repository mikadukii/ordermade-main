import axios from 'axios';

const instance = axios.create({
  // Use the Vercel domain in production, localhost in development
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

export default instance;
