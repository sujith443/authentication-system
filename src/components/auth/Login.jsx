import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowError(false);
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call - replace with actual API endpoint
      setTimeout(() => {
        // For demo purposes only. In production, use actual authentication
        if (formData.email === 'student@svit.edu.in' && formData.password === 'password123') {
          const userData = {
            id: 'usr_1234',
            name: 'Rahul Kumar',
            email: formData.email,
            role: 'student',
            branch: 'Computer Science',
            year: '3rd',
            rollNumber: 'CS2023-042'
          };
          
          const token = 'dummy_token_12345';
          onLogin(userData, token);
          navigate('/dashboard');
        } else {
          setShowError(true);
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setShowError(true);
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={"https://svitatp.ac.in/public/assets/admin/images/sitesetting/664263736b243_SVIT%20LOGO.png"} alt="SVIT Logo" height="70" />
        </div>
        
        <h2 className="auth-title">Student Login</h2>
        
        {showError && (
          <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
            Invalid email or password. Please try again.
          </Alert>
        )}
        
        <Form className="auth-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="student@svit.edu.in"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="rememberMe">
            <Form.Check
              type="checkbox"
              name="rememberMe"
              label="Remember me"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mb-3" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : 'Login'}
          </Button>
          
          <div className="auth-links">
            <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
            <Link to="/register" className="text-decoration-none">New Student? Register</Link>
          </div>
        </Form>
        
        <div className="text-center mt-4">
          <small className="text-muted">
            Demo credentials: student@svit.edu.in / password123
          </small>
        </div>
      </div>
    </Container>
  );
};

export default Login;