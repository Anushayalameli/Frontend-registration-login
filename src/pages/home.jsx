import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, User as UserIcon, Mail, Phone, Hash, Loader2, Database, KeyRound, Cookie, Server } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/auth/me');
        if (response.status === 200 && response.data) {
          setUser(response.data);
        } else {
          // If no user data or unexpected status, redirect to login
          navigate('/login');
        }
      } catch (err) {
        console.error('Authentication verification failed:', err);
        // Unauthorized or invalid JWT cookie -> redirect to login immediately
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoggingOut(false);
      // Redirect to login after logout
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="app-viewport">
        <div className="bg-grid-overlay"></div>
        <div className="bg-glow-beam"></div>
        <div className="loading-screen">
          <Loader2 size={32} className="spinner-icon" style={{ color: '#ffffff' }} />
          <p className="loading-text">Verifying authenticated session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const usernameDisplay = user.name || user.username || 'User';

  return (
    <div className="app-viewport">
      <div className="bg-grid-overlay"></div>
      <div className="bg-glow-beam"></div>

      {/* Top Next.js Minimalist Navbar */}
      <header className="next-navbar">
        <div className="nav-brand">
          <div className="nav-brand-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22h20L12 2z" fill="currentColor" />
            </svg>
          </div>
          <span className="nav-brand-text">RegLog Hub</span>
          <span className="nav-tag">Spring + React</span>
        </div>

        <div className="nav-actions">
          <div className="nav-user-chip">
            <span className="dot"></span>
            <span>{usernameDisplay}</span>
          </div>

          <button
            onClick={handleLogout}
            className="btn-next-secondary"
            disabled={loggingOut}
            title="Log out of your session"
          >
            {loggingOut ? (
              <>
                <Loader2 size={13} className="spinner-icon" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={13} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="dashboard-container">
        {/* Welcome Hero Card */}
        <section className="hero-card">
          <div className="hero-badge-row">
            <div className="security-badge">
              <ShieldCheck size={14} />
              <span>JWT Verified</span>
            </div>
            <div className="card-pill-badge" style={{ marginBottom: 0 }}>
              <span className="status-dot"></span>
              Live Session
            </div>
          </div>

          {/* Dynamic Welcome with actual username from backend */}
          <h1 className="hero-title">Welcome, {usernameDisplay}</h1>
          <p className="hero-description">
            Your account is authenticated with Spring Boot and secured via an HTTP-only JWT Cookie. No sensitive tokens are stored in browser localStorage or sessionStorage.
          </p>

          {/* User Details Grid */}
          <div className="profile-grid">
            <div className="profile-card">
              <div className="profile-card-header">
                <Hash size={13} />
                <span>User ID</span>
              </div>
              <div className="profile-card-value mono">{user.uid}</div>
            </div>

            <div className="profile-card">
              <div className="profile-card-header">
                <UserIcon size={13} />
                <span>Username</span>
              </div>
              <div className="profile-card-value">{user.name}</div>
            </div>

            <div className="profile-card email-card">
              <div className="profile-card-header">
                <Mail size={13} />
                <span>Email Address</span>
              </div>
              <div className="profile-card-value">
                {user.email}
                </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-header">
                <Phone size={13} />
                <span>Phone Number</span>
              </div>
              <div className="profile-card-value">{user.phone}</div>
            </div>
          </div>
        </section>

        {/* Security Architecture Info */}
        <section className="sec-section">
          <div className="sec-card">
            <div className="sec-card-title">
              <Cookie size={16} style={{ color: '#a1a1aa' }} />
              <span>HTTP-Only Cookie</span>
            </div>
            <p className="sec-card-desc">
              Protected against XSS attacks. The browser transmits the token automatically via credentials.
            </p>
          </div>

          <div className="sec-card">
            <div className="sec-card-title">
              <KeyRound size={16} style={{ color: '#a1a1aa' }} />
              <span>BCrypt & JJWT</span>
            </div>
            <p className="sec-card-desc">
              Passwords are encrypted with salted BCrypt hashing. Tokens are signed and tracked in MySQL.
            </p>
          </div>

          <div className="sec-card">
            <div className="sec-card-title">
              <Database size={16} style={{ color: '#a1a1aa' }} />
              <span>MySQL 8 / MariaDB</span>
            </div>
            <p className="sec-card-desc">
              Persistent storage in database <code style={{ color: '#ededed', fontFamily: 'var(--font-mono)' }}>reglogdb</code> with relations between user and JWTToken tables.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
