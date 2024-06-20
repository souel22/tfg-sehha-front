import React, { useState } from "react";
import { Card, Image, Form, Row, Col } from "react-bootstrap";
import SpecialistCalendar from "../SpecialistCalendar/SpecialistCalendar";
import "./SpecialistCard.css";

const SpecialistCard = ({ name, specialities, specialistId, userId, profileImage, token }) => {
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(specialities[0]?.id);

  const handleSpecialtyChange = (event) => {
    setSelectedSpecialtyId(event.target.value);
    console.log("Selected Specialty ID:", event.target.value);
  };

  return (
    <Card className="specialist-card mb-4 shadow-sm">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={4} className="text-center">
            <Image src={profileImage} roundedCircle width={100} height={100} className="profile-image" />
          </Col>
          <Col md={8}>
            <Card.Title className="specialist-name">{name}</Card.Title>
            <Form.Group>
              <Form.Label className="specialty-label">Specialty</Form.Label>
              <Form.Select
                className="specialty-select"
                value={selectedSpecialtyId}
                onChange={handleSpecialtyChange}
              >
                {specialities ? specialities.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                )): null}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
      <div className="calendar-overlay">
        <SpecialistCalendar
          specialistId={specialistId}
          userId={userId}
          selectedSpecialtyId={selectedSpecialtyId}
          specialistName={name}
          token={token}
        />
      </div>
    </Card>
  );
};

export default SpecialistCard;
