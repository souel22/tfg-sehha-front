import React, { useState, useEffect, useRef } from 'react';
import Header from "./Header/Header";
import ConsultationHeader from "./ConsultationHeader/ConsultationHeader";
import ConsultationOptions from "./ConsultationOptions/ConsultationOptions";
import Footer from "./Footer/Footer";
import io from 'socket.io-client';
import './SpecialistConsultationPage.css';
import { useLocation } from 'react-router-dom';
import { useLogout } from '../../../hooks/useLogout';
import { useAuthContext } from '../../../hooks/useAuthContext';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SpecialistConsultationPage = () => {
  const query = useQuery();
  const [socket, setSocket] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const userId = query.get('user');
  const specialistId = query.get('specialist');

  const appointmentId = query.get('appointment');
  const { user: authenticatedUser } = useAuthContext();
  const logout = useLogout();

  useEffect(() => {
    if (authenticatedUser && authenticatedUser.specialist) {
      setSpecialist(authenticatedUser.specialist);
      console.log("authenticatedUser specialist: ", authenticatedUser);
      const newSocket = io(import.meta.env.VITE_REACT_APP_VIDEO_MICRO, { transports: ['websocket'] });
    setSocket(newSocket);

    console.log("socket", newSocket);
    window.scrollTo(0, 0);

    return () => {
      console.log('Disconnecting socket...');
      newSocket.disconnect();
    };
    }
    
  }, [authenticatedUser]);

  const handleScheduleAppointment = () => {
    const url = import.meta.env.VITE_REACT_APP_SPECIALIST_SCHEDULE_APPOINTMENT_URL;
    if (url) {
      window.location.href = url;
    } else {
      console.error('Schedule appointment URL is not defined.');
    }
  };

  const handleAppointments = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_SPECIALIST_APPOINTMENTS_URL;
  };

  const handleLogout = () => {
    logout()
  };


  return (
    <div className="consultation-page">
      <Header 
        onScheduleAppointment={handleScheduleAppointment} 
        onLogout={handleLogout} 
        onAppointments={handleAppointments}
        specialist={specialist ? `Dr. ${specialist.firstName} ${specialist.lastName}` : ""} 
      />      
      <ConsultationHeader specialty="Specialty" doctorName="Name Surname" />
      {socket && <ConsultationOptions userId={userId} specialistId={specialistId} appointmentId={appointmentId} socket={socket} />}
      <Footer />
    </div>
  );
};

export default SpecialistConsultationPage;
