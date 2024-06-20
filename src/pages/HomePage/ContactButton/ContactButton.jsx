import React from 'react';
import { Container, Button } from 'react-bootstrap';
import './ContactButton.css';  // Import the custom CSS

function ContactButton() {
  return (
    <Container className="contact-section text-center my-5">
      <h2 className="contact-title">Get In Touch</h2>
      <p className="contact-subtitle">
        Have any questions or need assistance? We're here to help! Reach out to us anytime.
      </p>
      <Button variant="primary" className="contact-button">Contact Us!</Button>
    </Container>
  );
}

export default ContactButton;
