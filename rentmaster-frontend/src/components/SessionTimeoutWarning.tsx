import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './SessionTimeoutWarning.css';

export const SessionTimeoutWarning: React.FC = () => {
  const { sessionExpiry, refreshToken, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!sessionExpiry) return;

    const checkSession = () => {
      const now = new Date().getTime();
      const expiry = sessionExpiry.getTime();
      const timeUntilExpiry = expiry - now;
      
      // Show warning 5 minutes before expiry
      const warningThreshold = 5 * 60 * 1000; // 5 minutes
      
      if (timeUntilExpiry <= warningThreshold && timeUntilExpiry > 0) {
        setShowWarning(true);
        setTimeLeft(Math.floor(timeUntilExpiry / 1000));
      } else if (timeUntilExpiry <= 0) {
        // Session expired
        logout();
      } else {
        setShowWarning(false);
      }
    };

    const interval = setInterval(checkSession, 1000);
    checkSession(); // Check immediately

    return () => clearInterval(interval);
  }, [sessionExpiry, logout]);

  const handleExtendSession = async () => {
    try {
      await refreshToken();
      setShowWarning(false);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <div className="timeout-icon">⏰</div>
        <h2>Session Expiring Soon</h2>
        <p>
          Your session will expire in <strong>{formatTime(timeLeft)}</strong>.
        </p>
        <p>Would you like to extend your session?</p>
        
        <div className="timeout-actions">
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout Now
          </button>
          <button className="btn btn-primary" onClick={handleExtendSession}>
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};