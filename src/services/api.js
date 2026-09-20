import axios from 'axios';

const api = axios.create({
  // Dynamically uses Vercel environment variable in production, falls back to localhost for dev
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // Send and receive HTTP-only cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
