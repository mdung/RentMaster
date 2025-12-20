import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, failedAttempts, isLocked, lockoutTime } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Trim username and password to avoid whitespace issues
      await login({ username: username.trim(), password: password.trim() });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="login-icon">🏢</div>
          <h1>RentMaster</h1>
          <h2>Manage properties with ease. Sign in to access your dashboard.</h2>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {isLocked && lockoutTime && (
            <div className="lockout-message">
              <strong>Account Locked</strong><br />
              Too many failed attempts. Try again after {lockoutTime.toLocaleTimeString()}.
            </div>
          )}
          {!isLocked && failedAttempts > 0 && (
            <div className="warning-message">
              {5 - failedAttempts} attempts remaining before account lockout.
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon email">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="user@example.com"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon password">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>
          <button type="submit" disabled={loading || isLocked} className="login-btn">
            {loading ? 'Logging in...' : isLocked ? 'Account Locked' : 'Log In'}
          </button>
        </form>
        <div className="divider">
          <span>OR CONTINUE WITH</span>
        </div>
        <div className="social-login">
          <button type="button" className="social-btn">
            <span>🔵</span> Google
          </button>
          <button type="button" className="social-btn">
            <span>⚫</span> Apple
          </button>
        </div>
        <div className="signup-link">
          Don't have an account? <a href="#">Sign up</a>
        </div>
        <p className="login-hint">Default: admin / admin123</p>
      </div>
    </div>
  );
};

