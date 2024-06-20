import React from "react";
import { Modal, Button } from "react-bootstrap";

const BookingSuccessModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Appointment Booked</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your appointment has been successfully booked.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingSuccessModal;
