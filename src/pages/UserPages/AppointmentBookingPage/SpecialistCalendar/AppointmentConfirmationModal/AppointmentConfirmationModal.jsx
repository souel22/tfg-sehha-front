import React from "react";
import { Modal, Button } from "react-bootstrap";

const AppointmentConfirmationModal = ({ show, handleClose, handleConfirm, appointmentDetails }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to book this appointment?</p>
        <p><strong>Date:</strong> {appointmentDetails.date}</p>
        <p><strong>Time:</strong> {appointmentDetails.time}</p>
        <p><strong>Specialist:</strong> {appointmentDetails.specialist}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentConfirmationModal;
