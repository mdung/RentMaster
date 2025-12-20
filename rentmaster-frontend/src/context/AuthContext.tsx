import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi, LoginRequest } from '../services/api/authApi';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
  refreshToken: () => Promise<void>;
  failedAttempts: number;
  isLocked: boolean;
  lockoutTime: Date | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedExpiry = localStorage.getItem('sessionExpiry');
    const storedFailedAttempts = localStorage.getItem('failedAttempts');
    const storedLockoutTime = localStorage.getItem('lockoutTime');

    if (storedUser && storedExpiry) {
      const expiry = new Date(storedExpiry);
      if (expiry > new Date()) {
        setUser(JSON.parse(storedUser));
        setSessionExpiry(expiry);
      } else {
        // Session expired, clear storage
        logout();
      }
    }

    if (storedFailedAttempts) {
      setFailedAttempts(parseInt(storedFailedAttempts));
    }

    if (storedLockoutTime) {
      const lockout = new Date(storedLockoutTime);
      if (lockout > new Date()) {
        setIsLocked(true);
        setLockoutTime(lockout);
      } else {
        // Lockout expired, clear it
        localStorage.removeItem('lockoutTime');
        localStorage.removeItem('failedAttempts');
        setFailedAttempts(0);
        setIsLocked(false);
        setLockoutTime(null);
      }
    }
  }, []);

  // Auto-refresh token
  useEffect(() => {
    if (!user || !sessionExpiry) return;

    const refreshInterval = setInterval(() => {
      const timeUntilExpiry = sessionExpiry.getTime() - new Date().getTime();
      if (timeUntilExpiry < TOKEN_REFRESH_INTERVAL) {
        refreshToken();
      }
    }, 60000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [user, sessionExpiry]);

  // Check lockout expiry
  useEffect(() => {
    if (!isLocked || !lockoutTime) return;

    const checkLockout = setInterval(() => {
      if (lockoutTime && lockoutTime <= new Date()) {
        setIsLocked(false);
        setLockoutTime(null);
        setFailedAttempts(0);
        localStorage.removeItem('lockoutTime');
        localStorage.removeItem('failedAttempts');
      }
    }, 1000);

    return () => clearInterval(checkLockout);
  }, [isLocked, lockoutTime]);

  const login = async (credentials: LoginRequest) => {
    if (isLocked) {
      throw new Error(`Account is locked. Try again after ${lockoutTime?.toLocaleTimeString()}`);
    }

    try {
      const response = await authApi.login(credentials);
      
      // Clear failed attempts on successful login
      setFailedAttempts(0);
      localStorage.removeItem('failedAttempts');
      localStorage.removeItem('lockoutTime');
      
      const expiry = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
      setSessionExpiry(expiry);
      localStorage.setItem('sessionExpiry', expiry.toISOString());
      
      localStorage.setItem('token', response.token);
      const userData: User = {
        username: response.username,
        role: response.role,
        fullName: response.fullName,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem('failedAttempts', newFailedAttempts.toString());

      if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        const lockout = new Date(Date.now() + LOCKOUT_DURATION);
        setIsLocked(true);
        setLockoutTime(lockout);
        localStorage.setItem('lockoutTime', lockout.toISOString());
      }

      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken();
      const expiry = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
      setSessionExpiry(expiry);
      localStorage.setItem('sessionExpiry', expiry.toISOString());
      localStorage.setItem('token', response.token);
    } catch (error) {
      // If refresh fails, logout user
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
    setUser(null);
    setSessionExpiry(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      sessionExpiry,
      refreshToken,
      failedAttempts,
      isLocked,
      lockoutTime
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

