import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './AppointmentItem.css';

// AppointmentItem Component
const AppointmentItem = ({ appointmentId, specialty, userName, date, duration, status, onJoin, onCancel }) => {

  // Handle the cancel button click event
  const handleCancelClick = (appointmentId) => {
    onCancel(appointmentId);
  };

  // Handle the join button click event
  const handleJoinClick = (appointmentId) => {
    onJoin(appointmentId);
  };

  return (
    <Card className="appointment-item mb-3">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div className="appointment-info">
          <Card.Title className="specialty">{specialty}</Card.Title>
          <Card.Subtitle className="user-name mb-2 text-muted">{userName}</Card.Subtitle>
        </div>
        <div className="appointment-time">
          <div className="date">Date: {date}</div>
          <div className="duration">Duration: {duration}</div>
        </div>
        <div className="appointment-actions d-flex flex-column">
          {status !== 'cancelled' && (
            <Button variant="primary" onClick={() => handleJoinClick(appointmentId)} className="mb-2">
              Join
            </Button>
          )}
          <Button
            variant={status === 'cancelled' ? 'secondary' : 'danger'}
            onClick={status === 'cancelled' ? "" : () => handleCancelClick(appointmentId)}
            disabled={status === 'cancelled'}
          >
            {status === 'cancelled' ? 'Cancelled' : 'Cancel'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AppointmentItem;
