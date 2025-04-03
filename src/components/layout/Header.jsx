import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';

const Header = ({ isAuthenticated, user, onLogout }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  return (
    <Navbar 
      bg="white" 
      expand="lg" 
      className="shadow-sm" 
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? "/dashboard" : "/"}>
          <img
            src="https://svitatp.ac.in/public/assets/admin/images/sitesetting/664263736b243_SVIT%20LOGO.png"
            height="40"
            className="d-inline-block align-top me-2"
            alt="SVIT College Logo"
          />
          <span className="fw-bold text-primary">SVIT</span> Admin Portal
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  onClick={() => setExpanded(false)}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/uploads" 
                  onClick={() => setExpanded(false)}
                >
                  Upload Manager
                </Nav.Link>
                {user?.isAdmin && (
                  <Nav.Link 
                    as={Link} 
                    to="/admin/manage" 
                    onClick={() => setExpanded(false)}
                  >
                    Admin Management
                  </Nav.Link>
                )}
              </Nav>
              <Nav>
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {user?.name || 'Admin'}
                      {user?.isSuperAdmin && (
                        <span className="badge bg-danger text-white ms-1">Super</span>
                      )}
                    </span>
                  } 
                  id="user-dropdown" 
                  align="end"
                >
                  <NavDropdown.Item 
                    as={Link} 
                    to="/profile" 
                    onClick={() => setExpanded(false)}
                  >
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item 
                    onClick={() => {
                      setExpanded(false);
                      handleLogout();
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto">
              <Nav.Item>
                <Button 
                  as={Link} 
                  to="/" 
                  variant="primary"
                  onClick={() => setExpanded(false)}
                >
                  Admin Login
                </Button>
              </Nav.Item>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;