import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, ArrowRight, Loader2, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import api from '../services/api';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    // Validations
    if (!formData.username.trim()) {
      setError('Please enter a username.');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter an email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter a phone number.');
      return;
    }

    setLoading(true);

    try {
      // Backend expects: name, password, email, phone
      const payload = {
        name: formData.username.trim(),
        password: formData.password,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      const response = await api.post('/register', payload);

      if (response.status === 201 || response.status === 200) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data || 'Failed to register. Please check your inputs.';
      setError(typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg));
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
              RegLog Authentication
            </div>
            <h1 className="card-title">Create an Account</h1>
            <p className="card-subtitle">Register to begin using the secure health portal</p>
          </div>

          {error && (
            <div className="msg-alert msg-alert-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="msg-alert msg-alert-success">
              <CheckCircle2 size={16} />
              <span>{success}</span>
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
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-field">
              <label className="form-field-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">
                  <Mail size={15} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="next-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-field">
              <label className="form-field-label" htmlFor="phone">Phone Number</label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">
                  <Phone size={15} />
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="next-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
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
                  placeholder="Create a strong password (min 6 chars)"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-field">
              <label className="form-field-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon-prefix">
                  <Lock size={15} />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="next-input"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="btn-next-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spinner-icon" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="card-footer-link">
            <Link to="/login">Already a user?, Click here to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
