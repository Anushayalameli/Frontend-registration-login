import axios from 'axios';

function getBaseUrl() {
  const raw = import.meta.env.VITE_API_URL;
  if (!raw || typeof raw !== 'string') {
    return 'http://localhost:8080/api';
  }

  // Extract clean HTTP/HTTPS URL in case label text or newlines were pasted
  const match = raw.match(/https?:\/\/[^\s]+/i);
  let url = match ? match[0] : raw.trim();

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Ensure it ends with /api
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
}

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Send and receive HTTP-only cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
