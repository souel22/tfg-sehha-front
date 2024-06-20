import React from 'react';
import { Card, Button, Row, Col, Image } from 'react-bootstrap';
import './AppointmentItem.css';

const AppointmentItem = ({ appointmentId, specialty, doctorName, profileImage, status, date, time, onCancel, onJoin }) => {
  // Handle the cancel button click event
  const handleCancelClick = (appointmentId) => {
    onCancel(appointmentId);
  };

  // Handle the join button click event
  const handleJoinClick = (appointmentId) => {
    onJoin(appointmentId);
  };

  return (
    <Card className="appointment-card mb-3">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={2} className="text-center">
            <Image src={profileImage} roundedCircle width={50} height={50} />
          </Col>
          <Col md={4}>
            <div className="d-flex flex-column">
              <Card.Title className="specialty-title">{specialty}</Card.Title>
              <Card.Subtitle className="doctor-subtitle">Dr. {doctorName}</Card.Subtitle>
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="d-flex flex-column">
              <div className="appointment-date">{date}</div>
              <div className="appointment-time">{time}</div>
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="d-flex flex-column">
              {status !== 'cancelled' && (
                <>
                  <Button variant="primary" onClick={() => handleJoinClick(appointmentId)} className="mb-2">
                    Join
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleCancelClick(appointmentId)}
                  >
                    Cancel
                  </Button>
                </>
              )}
              {status === 'cancelled' && (
                <Button
                  variant="secondary"
                  disabled
                  className="canceled-button"
                >
                  Canceled
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AppointmentItem;
