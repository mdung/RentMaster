import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './ResetPasswordPage.css';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        // TODO: Implement token validation API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
        setTokenValid(true);
      } catch (error) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement reset password API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0:
      case 1: return '#ef4444';
      case 2: return '#f97316';
      case 3: return '#eab308';
      case 4: return '#22c55e';
      case 5: return '#16a34a';
      default: return '#6b7280';
    }
  };

  if (tokenValid === null) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="loading-spinner">⏳</div>
          <h1>Validating Reset Link</h1>
          <p>Please wait while we validate your password reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="error-icon">❌</div>
          <h1>Invalid Reset Link</h1>
          <p className="error-text">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <div className="action-buttons">
            <Link to="/forgot-password" className="btn btn-primary">
              Request New Link
            </Link>
            <Link to="/login" className="btn btn-outline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="success-icon">✅</div>
          <h1>Password Reset Successful!</h1>
          <p className="success-message">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <p className="redirect-message">
            Redirecting to login page in 3 seconds...
          </p>
          <Link to="/login" className="btn btn-primary">
            Go to Login Now
          </Link>
        </div>
      </div>
    );
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-icon">🔐</div>
        <h1>Reset Your Password</h1>
        <p className="subtitle">
          Enter your new password below. Make sure it's strong and secure.
        </p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>New Password</label>
            <div className="input-with-icon password">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                minLength={8}
                autoFocus
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor(passwordStrength)
                    }}
                  ></div>
                </div>
                <span 
                  className="strength-label"
                  style={{ color: getStrengthColor(passwordStrength) }}
                >
                  {getStrengthLabel(passwordStrength)}
                </span>
              </div>
            )}
            
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={password.length >= 8 ? 'valid' : ''}>
                  At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                  One uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                  One lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? 'valid' : ''}>
                  One number
                </li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'valid' : ''}>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-with-icon password">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <small className="error-text">Passwords do not match</small>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || password !== confirmPassword || passwordStrength < 3} 
            className="submit-btn"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="back-to-login">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
};