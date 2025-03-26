import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <h5>SVIT College - Andhra Pradesh</h5>
            <p className="mb-1">Sree Vidyanikethan Institute of Technology</p>
            <p className="mb-0">A. Rangampet, Tirupati, Andhra Pradesh, South India</p>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="https://svit.edu.in" className="text-light text-decoration-none" target="_blank" rel="noopener noreferrer">Official Website</a></li>
              <li><a href="#" className="text-light text-decoration-none">Academic Calendar</a></li>
              <li><a href="#" className="text-light text-decoration-none">Contact Us</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Connect With Us</h5>
            <div className="d-flex gap-3 fs-4">
              <a href="#" className="text-light">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-3" />
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {year} SVIT College Authentication System. All Rights Reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;