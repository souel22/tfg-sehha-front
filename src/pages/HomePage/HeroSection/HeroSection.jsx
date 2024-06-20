import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HeroSection.css';  // Import the custom CSS

function HeroSection() {
  return (
    <Container className="hero-section text-center my-5">
      <Row>
        <Col>
          <h1 className="hero-title">Welcome To SEHHA:</h1>
          <p className="hero-subtitle">
            Your Gateway to Seamless Telemedicine. Connect with licensed healthcare professionals from the comfort of your own home and take control of your health journey. Book an appointment now!
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default HeroSection;
