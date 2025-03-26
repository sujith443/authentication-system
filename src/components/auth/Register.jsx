import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    branch: '',
    year: '',
    termsAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const branches = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics and Communication Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const years = ['1st', '2nd', '3rd', '4th'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!formData.email.endsWith('svit.edu.in')) {
      newErrors.email = 'Please use your SVIT college email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Roll number validation
    if (!formData.rollNumber) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    // Branch validation
    if (!formData.branch) {
      newErrors.branch = 'Please select your branch';
    }
    
    // Year validation
    if (!formData.year) {
      newErrors.year = 'Please select your year';
    }
    
    // Terms acceptance
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock API call - replace with actual API endpoint
      setTimeout(() => {
        setShowSuccess(true);
        setIsLoading(false);
        
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({
        ...errors,
        general: 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <Container className="py-5">
      <div className="auth-container" style={{ maxWidth: '600px' }}>
        <div className="auth-logo">
          <img src={"https://svitatp.ac.in/public/assets/admin/images/sitesetting/664263736b243_SVIT%20LOGO.png"} alt="SVIT Logo" height="70" />
        </div>
        
        <h2 className="auth-title">Student Registration</h2>
        
        {showSuccess && (
          <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
            Registration successful! You will be redirected to the login page shortly.
          </Alert>
        )}
        
        {errors.general && (
          <Alert variant="danger" onClose={() => setErrors({...errors, general: null})} dismissible>
            {errors.general}
          </Alert>
        )}
        
        <Form className="auth-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="termsAccepted">
            <Form.Check
              type="checkbox"
              name="termsAccepted"
              label={
                <span>
                  I agree to the <a href="#" className="text-decoration-none">Terms and Conditions</a> and <a href="#" className="text-decoration-none">Privacy Policy</a>
                </span>
              }
              checked={formData.termsAccepted}
              onChange={handleChange}
              isInvalid={!!errors.termsAccepted}
              feedback={errors.termsAccepted}
              feedbackType="invalid"
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
                Registering...
              </>
            ) : 'Register'}
          </Button>
          
          <div className="text-center">
            <p>
              Already have an account? <Link to="/" className="text-decoration-none">Login here</Link>
            </p>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default Register;
          
