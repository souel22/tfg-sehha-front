import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './FeatureSection.css';  // Import the custom CSS

function FeatureSection() {
  const features = [
    {
      text: "Revolutionize your healthcare experience with video consultations",
      imgSrc: `/images/homepage/videoconsultation.jpg`,
      imgAlt: "Video consultations",
    },
    {
      text: "Connect with top healthcare professionals from diverse backgrounds",
      imgSrc: `/images/homepage/healthcare-speciailists.jpg`,
      imgAlt: "Diverse professionals",
    },
    {
      text: "Effortlessly book appointments and receive care at your fingertips",
      imgSrc: `/images/homepage/touch.jpg`,
      imgAlt: "Book appointments",
    }
  ];

  return (
    <Container className="my-5 feature-section">
      {features.map((feature, index) => (
        <Row className="align-items-center my-4" key={index}>
          {index % 2 === 0 ? (
            <>
              <Col md={6}>
                <img src={feature.imgSrc} alt={feature.imgAlt} className="img-fluid feature-image" />
              </Col>
              <Col md={6} className="text-md-left text-center">
                <h4 className="feature-text">{feature.text}</h4>
              </Col>
            </>
          ) : (
            <>
              <Col md={6} className="text-md-right text-center">
                <h4 className="feature-text">{feature.text}</h4>
              </Col>
              <Col md={6}>
                <img src={feature.imgSrc} alt={feature.imgAlt} className="img-fluid feature-image" />
              </Col>
            </>
          )}
        </Row>
      ))}
    </Container>
  );
}

export default FeatureSection;
