import React from 'react';
import AppointmentItem from "../AppointmentItem/AppointmentItem";
import { Container } from 'react-bootstrap';
import './AppointmentList.css';  // Import the custom CSS

const AppointmentList = ({ appointments, onCancel, onJoin }) => {
  console.log("@AppointmentList: ", appointments);

  return (
    <Container className="appointment-list mt-5">
      {appointments.map((appointment, index) => (
        <AppointmentItem
          key={index}
          appointmentId={appointment.id}
          specialty={appointment.speciality.name}
          doctorName={`${appointment.specialist.firstName} ${appointment.specialist.lastName}`}
          status={appointment.status}
          date={appointment.date}
          time={appointment.duration}
          profileImage={`/images/empty-profile-picture.webp`}
          onCancel={onCancel}
          onJoin={onJoin}
        />
      ))}
      {/* if no appointements, display a message saying there are no appointments */}
      {appointments.length === 0 && <p className='no-appointments-message'>No appointments found.</p>}
    </Container>
  );
}

export default AppointmentList;
