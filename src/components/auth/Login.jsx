import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card, InputGroup } from 'react-bootstrap';
import CryptoJS from 'crypto-js'; // For secure password handling

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const navigate = useNavigate();

  // Check if account is locked on component mount
  useEffect(() => {
    const lockedUntil = localStorage.getItem('loginLocked');
    if (lockedUntil) {
      const lockTimeMs = parseInt(lockedUntil);
      if (lockTimeMs > Date.now()) {
        setIsLocked(true);
        setLockTime(new Date(lockTimeMs));
        
        // Set a timer to unlock
        const unlockTimer = setTimeout(() => {
          setIsLocked(false);
          localStorage.removeItem('loginLocked');
        }, lockTimeMs - Date.now());
        
        return () => clearTimeout(unlockTimer);
      } else {
        localStorage.removeItem('loginLocked');
      }
    }
    
    // Reset login attempts after 30 minutes of inactivity
    const lastAttempt = localStorage.getItem('lastLoginAttempt');
    if (lastAttempt) {
      const lastAttemptTime = parseInt(lastAttempt);
      const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
      
      if (lastAttemptTime < thirtyMinutesAgo) {
        localStorage.removeItem('loginAttempts');
        setLoginAttempts(0);
      } else {
        setLoginAttempts(parseInt(localStorage.getItem('loginAttempts') || '0'));
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    // Clear general error
    if (showError) {
      setShowError(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hash password for secure comparison
  const hashPassword = (password, salt = 'svit-college-salt') => {
    return CryptoJS.SHA256(password + salt).toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    
    if (isLocked) {
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    // Track login attempts
    const attempts = loginAttempts + 1;
    setLoginAttempts(attempts);
    localStorage.setItem('loginAttempts', attempts.toString());
    localStorage.setItem('lastLoginAttempt', Date.now().toString());
    
    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      const unlockTime = Date.now() + lockDuration;
      setIsLocked(true);
      setLockTime(new Date(unlockTime));
      localStorage.setItem('loginLocked', unlockTime.toString());
      
      setTimeout(() => {
        setIsLocked(false);
        localStorage.removeItem('loginLocked');
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
      }, lockDuration);
      
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get stored admins
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      
      // Check if super admin exists, if not create it
      const superAdminExists = admins.some(admin => admin.email === 'admin@svit.edu.in');
      
      if (!superAdminExists && formData.email === 'admin@svit.edu.in' && formData.password === 'password123') {
        // Create super admin if it doesn't exist
        const superAdmin = {
          id: 'adm_1001',
          name: 'Admin User',
          email: 'admin@svit.edu.in',
          role: 'admin',
          department: 'Administration',
          isAdmin: true,
          isSuperAdmin: true,
          createdAt: new Date().toISOString(),
          // Store hashed password in a real system
          passwordHash: hashPassword('password123')
        };
        
        const updatedAdmins = [...admins, superAdmin];
        localStorage.setItem('admins', JSON.stringify(updatedAdmins));
        
        const token = 'admin_token_12345';
        onLogin(superAdmin, token);
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        localStorage.removeItem('loginAttempts');
        
        navigate('/dashboard');
      } else {
        // Find admin by email
        const admin = admins.find(a => a.email === formData.email);
        
        if (admin) {
          // In a real system, we would check the hashed password
          // For demo purposes, we're using simple password authentication
          const isCorrectPassword = 
            (admin.isSuperAdmin && formData.password === 'password123') || 
            (!admin.isSuperAdmin && formData.password === 'admin123') ||
            (admin.passwordHash && admin.passwordHash === hashPassword(formData.password));
          
          if (isCorrectPassword) {
            const token = `admin_token_${admin.id}`;
            onLogin(admin, token);
            
            // Reset login attempts on successful login
            setLoginAttempts(0);
            localStorage.removeItem('loginAttempts');
            
            navigate('/dashboard');
          } else {
            setShowError(true);
          }
        } else {
          setShowError(true);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Format remaining lock time
  const formatLockTime = () => {
    if (!lockTime) return '';
    
    const now = new Date();
    const diff = Math.max(0, Math.floor((lockTime - now) / 1000));
    
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Container className="py-5">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={"https://svitatp.ac.in/public/assets/admin/images/sitesetting/664263736b243_SVIT%20LOGO.png"} alt="SVIT Logo" height="70" />
        </div>
        
        <h2 className="auth-title">Admin Login</h2>
        <p className="text-center text-muted mb-4">SVIT College Admin Portal</p>
        
        {isLocked ? (
          <Alert variant="danger">
            <i className="bi bi-lock-fill me-2"></i>
            Account locked due to too many failed attempts.
            <div className="mt-2">Please try again in {formatLockTime()} minutes.</div>
          </Alert>
        ) : (
          <>
            {showError && (
              <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Invalid email or password. Please try again.
                {loginAttempts > 1 && (
                  <div className="mt-2 small">
                    Warning: {5 - loginAttempts} login attempts remaining before temporary lockout.
                  </div>
                )}
              </Alert>
            )}
            
            <Form className="auth-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="admin@svit.edu.in"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    disabled={isLocked}
                    autoComplete="username"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-key"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    disabled={isLocked}
                    autoComplete="current-password"
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="rememberMe">
                <Form.Check
                  type="checkbox"
                  name="rememberMe"
                  label="Remember me"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isLocked}
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 mb-3" 
                disabled={isLoading || isLocked}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Login
                  </>
                )}
              </Button>
              
              <div className="text-center mt-4">
                <small className="text-muted">
                  Main admin credentials: admin@svit.edu.in / password123
                </small>
              </div>
            </Form>
          </>
        )}
      </div>
    </Container>
  );
};

export default Login;