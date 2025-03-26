import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <div className="mb-4">
            <h1 style={{ fontSize: '8rem', fontWeight: 'bold', color: '#1e3a8a' }}>404</h1>
            <h2 className="mb-4">Page Not Found</h2>
            <p className="lead mb-5">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <Button as={Link} to="/" variant="primary" size="lg">
              Go Back Home
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;