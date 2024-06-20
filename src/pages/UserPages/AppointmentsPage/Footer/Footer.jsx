import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';  // Import the custom CSS

function Footer() {
  return (
    <footer className="footer bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={4} className="text-center text-md-left">
            <h5>About SEHHA</h5>
            <p>SEHHA is your gateway to seamless telemedicine. Connect with licensed healthcare professionals from the comfort of your home.</p>
          </Col>
          <Col md={4} className="text-center">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#about" className="footer-link">About</a></li>
              <li><a href="#services" className="footer-link">Services</a></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
              <li><a href="#signin" className="footer-link">Sign In</a></li>
            </ul>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <h5>Contact Us</h5>
            <p>Email: info@sehha.com</p>
            <p>Phone: (123) 456-7890</p>
            <p>Address: 123 Healthcare St, Telehealth City, TH 12345</p>
          </Col>
        </Row>
        <hr className="footer-divider" />
        <div className="text-center">
          <p>&copy; 2024 SEHHA. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
