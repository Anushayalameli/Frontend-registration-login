import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Send and receive HTTP-only cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
