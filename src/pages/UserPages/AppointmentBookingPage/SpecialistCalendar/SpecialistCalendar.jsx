import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './SpecialistCalendar.css';
import { Tooltip } from 'react-tooltip';
import AppointmentConfirmationModal from './AppointmentConfirmationModal/AppointmentConfirmationModal';
import BookingSuccessModal from './BookingSuccessModal/BookingSuccessModal';

const localizer = momentLocalizer(moment);

const SpecialistCalendar = ({ specialistId, userId, selectedSpecialtyId, specialistName, token }) => {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState(Views.MONTH);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const baseUrl = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_URL;
    const schedulePath = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_SPECIALIST_SCHEDULE_PATH.replace('<specialistId>', specialistId);

    useEffect(() => {
        const fetchSchedule = async () => {
            const url = `${baseUrl}${schedulePath}`;
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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
                        allDay: false,
                        resource: slot
                    };
                }) : [];
                setEvents(slots);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            }
        };

        fetchSchedule();
    }, [specialistId, baseUrl, schedulePath, token]);

    const handleSlotSelect = useCallback((slot) => {
        if (slot.title === 'Available') {
            setSelectedSlot(slot);
            setShowConfirmationModal(true);
        } else {
            alert('This slot is already booked. Please select another slot.');
        }
    }, []);

    const handleConfirm = useCallback(async () => {
        try {
            const response = await axios.post(`${baseUrl}/appointments`, {
                slotId: selectedSlot.id,
                specialityId: selectedSpecialtyId,
                specialistId,
                userId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Appointment booked successfully:', response.data);
            setShowConfirmationModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('Failed to book the appointment.');
        }
    }, [baseUrl, selectedSlot, selectedSpecialtyId, specialistId, userId, token]);

    const eventPropGetter = (event) => {
        const newStyle = {
            backgroundColor: event.title === 'Booked' ? '#f0ad4e' : '#5cb85c',
            color: 'white',
            borderRadius: '5px',
            border: 'none',
            display: 'block',
            padding: '2px 5px',
            fontSize: '0.85em',
            opacity: 0.8,
        };

        return { style: newStyle };
    };

    const handleViewChange = useCallback((newView) => {
        setView(newView);
    }, []);

    const minTime = new Date();
    minTime.setHours(8, 0, 0); // Start time at 8 AM
    const maxTime = new Date();
    maxTime.setHours(20, 0, 0); // End time at 8 PM

    return (
        <div className="specialist-calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: view === Views.MONTH ? '500px' : 'auto', width: '100%' }}
                onSelectEvent={handleSlotSelect}
                eventPropGetter={eventPropGetter}
                onView={handleViewChange}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                step={15} // Time slot intervals (in minutes)
                timeslots={4} // Number of slots per hour
                defaultView={Views.WEEK}
                min={minTime}
                max={maxTime}
            />
            <Tooltip effect="solid" />
            <AppointmentConfirmationModal
                show={showConfirmationModal}
                handleClose={() => setShowConfirmationModal(false)}
                handleConfirm={handleConfirm}
                appointmentDetails={{
                    date: selectedSlot?.start.toLocaleDateString(),
                    time: selectedSlot?.start.toLocaleTimeString(),
                    specialist: specialistName
                }}
            />
            <BookingSuccessModal
                show={showSuccessModal}
                handleClose={() => setShowSuccessModal(false)}
            />
        </div>
    );
};

export default SpecialistCalendar;
