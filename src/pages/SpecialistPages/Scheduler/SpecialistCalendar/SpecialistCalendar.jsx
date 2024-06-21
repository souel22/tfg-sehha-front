import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './SpecialistCalendar.css';
import { useAuthContext } from '../../../../hooks/useAuthContext';

const localizer = momentLocalizer(moment);

const SpecialistCalendar = ({ specialistId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authenticatedUser } = useAuthContext();

  const baseUrl = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_URL;
  const schedulePath = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_SPECIALIST_SCHEDULE_PATH.replace('<specialistId>', specialistId);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (authenticatedUser && specialistId) {
        const url = `${baseUrl}${schedulePath}`;

        try {
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${authenticatedUser.token}` }
          });
          console.log("response: ", response.data);
          const slots = response.data.slots ? response.data.slots.map(slot => {
            const startDate = new Date(`${slot.date}T${slot.time}`);
            const durationParts = slot.duration.split(':');
            const durationMinutes = parseInt(durationParts[0], 10) * 60 + parseInt(durationParts[1], 10);
            const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

            return {
              id: slot.id,
              title: slot.appointment ? 'Booked' : 'Available',
              start: startDate,
              end: endDate,
              allDay: false
            };
          }) : [];
          setEvents(slots);
          setError(null)
          console.log("slots: ", slots)
        } catch (error) {
          console.error('Error fetching schedule:', error);
          setError('Error fetching schedule.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSchedule();
  }, [authenticatedUser, specialistId, baseUrl, schedulePath]);

  const deleteSlot = async (slotId) => {
    try {
      await axios.delete(`${baseUrl}/specialists/${specialistId}/schedule/`, {
        data: { slotId },
        headers: { Authorization: `Bearer ${authenticatedUser.token}` }
      });
      alert('Slot deleted successfully');
      setEvents(events.filter(event => event.id !== slotId));
    } catch (error) {
      console.error('Error deleting slot:', error);
      alert('Failed to delete the slot.');
    }
  };

  const handleSlotSelect = (slot) => {
    const deleteConfirmed = window.confirm(`Do you want to delete the slot starting at ${slot.start.toLocaleString()}?`);
    if (deleteConfirmed) {
      deleteSlot(slot.id);
    }
  };

  return (
    <Container fluid className="specialist-calendar-container">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading calendar...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="">
          {error}
        </Alert>
      ) : (
        <Row className="justify-content-center">
          <Col>
            <div className="calendar-wrapper">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '100%' }}
                onSelectEvent={handleSlotSelect}
              />
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SpecialistCalendar;
