import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);

    try {
      // Backend expects: name, password
      const payload = {
        name: formData.username.trim(),
        password: formData.password,
      };

      const response = await api.post('/login', payload);

      if (response.status === 200) {
        // HTTP-only cookie is set by the browser from Set-Cookie header
        // Redirect directly to home.jsx
        navigate('/home');
      }
    } catch (err) {
      console.error('Login failed:', err);
      const serverMsg = err.response?.data?.message || err.response?.data || 'Invalid username or password.';
      setError(typeof serverMsg === 'string' ? serverMsg : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      <div className="bg-grid-overlay"></div>
      <div className="bg-glow-beam"></div>

      <div className="auth-container">
        <div className="next-card">
          <div className="card-header">
            <div className="card-logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22h20L12 2z" fill="currentColor" />
              </svg>
            </div>
            <div className="card-pill-badge">
              <span className="status-dot"></span>
              Secure Session
            </div>
            <h1 className="card-title">Welcome Back</h1>
            <p className="card-subtitle">Sign in to your account with secure JWT cookie</p>
          </div>

          {error && (
            <div className="msg-alert msg-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-field">
              <label className="form-field-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">
                  <User size={15} />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="next-input"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-field">
              <label className="form-field-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">
                  <Lock size={15} />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="next-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-next-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner-icon" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="card-footer-link">
            <Link to="/signup">New user?, Signup.</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
