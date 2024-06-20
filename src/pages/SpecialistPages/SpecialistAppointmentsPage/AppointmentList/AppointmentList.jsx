import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AppointmentItem from "../AppointmentItem/AppointmentItem";
import './AppointmentList.css';

// AppointmentList Component
const AppointmentList = ({ appointments, onJoin, onCancel }) => {
  console.log("apps: ", appointments);
  return (
    <Container className="appointment-list">
      <Row>
        {appointments.map((appointment, index) => (
          <Col md={6} key={index} className="mb-4">
            <AppointmentItem
              appointmentId={appointment.id}
              specialty={appointment.speciality.name}
              userName={appointment.user.firstName + " " + appointment.user.lastName}
              date={appointment.date}
              duration={appointment.duration}
              onJoin={onJoin}
              onCancel={onCancel}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AppointmentList;
