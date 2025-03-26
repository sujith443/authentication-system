import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Nav, Tab } from 'react-bootstrap';

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    branch: user?.branch || '',
    year: user?.year || '',
    rollNumber: user?.rollNumber || '',
    bio: user?.bio || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
    setProfileError(null);
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
    setPasswordError(null);
  };
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(false);
    setIsUpdatingProfile(true);
    
    // Mock API call - replace with actual API
    setTimeout(() => {
      // Update user data in parent component
      const updatedUser = {
        ...user,
        ...profileForm
      };
      
      setUser(updatedUser);
      
      // Update local storage
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      setProfileSuccess(true);
      setIsUpdatingProfile(false);
      
      // Clear success message after delay
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    
    // Validate password
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setIsUpdatingPassword(true);
    
    // Mock API call - replace with actual API
    setTimeout(() => {
      // For demo purposes, accept any current password
      // In production, verify current password on server
      
      setPasswordSuccess(true);
      setIsUpdatingPassword(false);
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear success message after delay
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    }, 1000);
  };
  
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-1">My Profile</h1>
          <p className="text-muted">Manage your account information</p>
        </Col>
      </Row>
      
      <Row>
        <Col lg={4} className="mb-4 mb-lg-0">
          <Card className="profile-card">
            <Card.Body className="text-center">
              <div className="mb-3">
                <img 
                  src={user?.avatar || defaultAvatar} 
                  alt="Profile" 
                  className="rounded-circle" 
                  width="100" 
                  height="100" 
                />
              </div>
              <h4>{user?.name || 'Student'}</h4>
              <p className="text-muted mb-3">{user?.rollNumber}</p>
              <p className="mb-1"><strong>Branch:</strong> {user?.branch}</p>
              <p className="mb-1"><strong>Year:</strong> {user?.year}</p>
              <p className="mb-3"><strong>Email:</strong> {user?.email}</p>
              <Button variant="outline-primary" size="sm">
                <i className="bi bi-camera me-2"></i>
                Change Photo
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-white">
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="password">Change Password</Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>
            
            <Card.Body>
              <Tab.Content>
                <Tab.Pane active={activeTab === 'profile'}>
                  {profileSuccess && (
                    <Alert variant="success" onClose={() => setProfileSuccess(false)} dismissible>
                      Profile updated successfully!
                    </Alert>
                  )}
                  
                  {profileError && (
                    <Alert variant="danger" onClose={() => setProfileError(null)} dismissible>
                      {profileError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handleProfileSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="name">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={profileForm.name}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="email">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            required
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Email cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="phone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="rollNumber">
                          <Form.Label>Roll Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="rollNumber"
                            value={profileForm.rollNumber}
                            onChange={handleProfileChange}
                            required
                            disabled
                          />
                          <Form.Text className="text-muted">
                            Roll number cannot be changed
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="branch">
                          <Form.Label>Branch</Form.Label>
                          <Form.Control
                            type="text"
                            name="branch"
                            value={profileForm.branch}
                            onChange={handleProfileChange}
                            required
                            disabled
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="year">
                          <Form.Label>Year</Form.Label>
                          <Form.Control
                            type="text"
                            name="year"
                            value={profileForm.year}
                            onChange={handleProfileChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3" controlId="bio">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        placeholder="Tell us a little about yourself"
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={isUpdatingProfile}
                      >
                        {isUpdatingProfile ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : 'Save Changes'}
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
                
                <Tab.Pane active={activeTab === 'password'}>
                  {passwordSuccess && (
                    <Alert variant="success" onClose={() => setPasswordSuccess(false)} dismissible>
                      Password updated successfully!
                    </Alert>
                  )}
                  
                  {passwordError && (
                    <Alert variant="danger" onClose={() => setPasswordError(null)} dismissible>
                      {passwordError}
                    </Alert>
                  )}
                  
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3" controlId="currentPassword">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                      <Form.Text className="text-muted">
                        Password must be at least 6 characters long
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="primary" 
                        type="submit"
                        disabled={isUpdatingPassword}
                      >
                        {isUpdatingPassword ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Updating...
                          </>
                        ) : 'Change Password'}
                      </Button>
                    </div>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;