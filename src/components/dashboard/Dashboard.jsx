import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RecentUploadsWidget from './widgets/RecentUploadsWidget';
import UploadStatsWidget from './widgets/UploadStatsWidget';
import AnnouncementsWidget from './widgets/AnnouncementsWidget';

const Dashboard = ({ user }) => {
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="mb-1">Dashboard</h1>
          <p className="text-muted">Welcome back, {user?.name || 'Student'}!</p>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary mb-3">
                <i className="bi bi-file-earmark-arrow-up fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">12</h3>
              <p className="stat-label mb-0">Total Uploads</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-success bg-opacity-10 text-success mb-3">
                <i className="bi bi-check-circle fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">8</h3>
              <p className="stat-label mb-0">Approved</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning mb-3">
                <i className="bi bi-hourglass-split fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">3</h3>
              <p className="stat-label mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-stat-card h-100">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center text-center">
              <div className="stat-icon bg-danger bg-opacity-10 text-danger mb-3">
                <i className="bi bi-x-circle fs-4"></i>
              </div>
              <h3 className="stat-value mb-1">1</h3>
              <p className="stat-label mb-0">Rejected</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Row className="h-100">
            <Col xs={12} className="mb-4">
              <Card className="h-100">
                <Card.Header className="bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Uploads</h5>
                    <Link to="/uploads" className="text-decoration-none">View All</Link>
                  </div>
                </Card.Header>
                <Card.Body>
                  <RecentUploadsWidget />
                </Card.Body>
              </Card>
            </Col>
            
            <Col xs={12}>
              <Card className="h-100">
                <Card.Header className="bg-transparent">
                  <h5 className="mb-0">Upload Statistics</h5>
                </Card.Header>
                <Card.Body>
                  <UploadStatsWidget />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        
        <Col lg={4}>
          <Card className="h-100">
            <Card.Header className="bg-transparent">
              <h5 className="mb-0">Announcements</h5>
            </Card.Header>
            <Card.Body>
              <AnnouncementsWidget />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;