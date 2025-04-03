import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    categories: {}
  });
  const [adminStats, setAdminStats] = useState({
    total: 0,
    active: 0
  });

  useEffect(() => {
    // Get uploads from localStorage
    const files = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
    
    // Calculate upload stats
    const categories = {};
    files.forEach(file => {
      if (categories[file.category]) {
        categories[file.category]++;
      } else {
        categories[file.category] = 1;
      }
    });
    
    setUploadStats({
      total: files.length,
      categories
    });
    
    // Get admin stats
    const admins = JSON.parse(localStorage.getItem('admins') || '[]');
    setAdminStats({
      total: admins.length,
      active: admins.length // For demo purposes, all admins are active
    });
  }, []);

  // Format date for card display
  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-1">Admin Dashboard</h1>
          <p className="text-muted">Welcome, {user?.name || 'Administrator'}!</p>
        </Col>
      </Row>
      
      {/* System Status Card */}
      <Row className="mb-4">
        <Col>
          <Card className="bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">SVIT College Upload System</h5>
                  <p className="mb-0">Status: Active and Running</p>
                </div>
                <div>
                  <p className="mb-0">{formatDate()}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary mb-3">
                <i className="bi bi-file-earmark-arrow-up fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">{uploadStats.total}</h3>
              <p className="stat-label mb-0">Total Uploads</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-success bg-opacity-10 text-success mb-3">
                <i className="bi bi-folder2-open fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">{Object.keys(uploadStats.categories).length}</h3>
              <p className="stat-label mb-0">Categories</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-info bg-opacity-10 text-info mb-3">
                <i className="bi bi-people fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">{adminStats.total}</h3>
              <p className="stat-label mb-0">Administrators</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning mb-3">
                <i className="bi bi-person-check fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">{adminStats.active}</h3>
              <p className="stat-label mb-0">Active Admins</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-wrap gap-2">
                <Button as={Link} to="/uploads" variant="primary">
                  <i className="bi bi-upload me-2"></i>
                  Manage Uploads
                </Button>
                
                {user?.isAdmin && (
                  <Button as={Link} to="/admin/manage" variant="success">
                    <i className="bi bi-person-plus me-2"></i>
                    Manage Administrators
                  </Button>
                )}
                
                <Button as={Link} to="/profile" variant="info">
                  <i className="bi bi-gear me-2"></i>
                  Account Settings
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Category Breakdown and System Info */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Upload Categories</h5>
            </Card.Header>
            <Card.Body>
              {Object.keys(uploadStats.categories).length > 0 ? (
                <div className="category-list">
                  {Object.entries(uploadStats.categories).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <span className="category-badge me-2"></span>
                        {category}
                      </div>
                      <div>
                        <span className="badge bg-primary">{count} Files</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-0 text-muted">No uploads found</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">System Information</h5>
            </Card.Header>
            <Card.Body>
              <div className="system-info">
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-muted">System Version</div>
                  <div className="fw-bold">1.0.0</div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-muted">Storage Usage</div>
                  <div className="fw-bold">2.4 GB / 50 GB</div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-muted">Last Backup</div>
                  <div className="fw-bold">Today, 03:00 AM</div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-muted">Server Status</div>
                  <div className="text-success fw-bold">Online</div>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="text-muted">Authentication Service</div>
                  <div className="text-success fw-bold">Active</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;