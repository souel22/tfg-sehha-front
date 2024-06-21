import React, { useState, useEffect } from 'react';
import Header from "./Header/Header";
import ConsultationHeader from "./ConsultationHeader/ConsultationHeader";
import ConsultationOptions from "./ConsultationOptions/ConsultationOptions";
import Footer from "./Footer/Footer";
import io from 'socket.io-client';
import axios from 'axios';
import { useLogout } from '../../../hooks/useLogout';
import { useAuthContext } from "../../../hooks/useAuthContext";
import './ConsultationPage.css';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ConsultationPage = () => {
  const query = useQuery();
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [specialist, setSpecialist] = useState(null);
  const [speciality, setSpeciality] = useState(null);

  const appointmentId = query.get('appointment');
  const userId = query.get('user');
  const specialistId = query.get('specialist');
  const { logout } = useLogout();
  const { user: authenticatedUser } = useAuthContext();

  useEffect(() => {
    if (authenticatedUser) {
      console.log("authenticatedUser", authenticatedUser);
      setUser(authenticatedUser.user);

      const fetchAppointment = async () => {
        try {
          const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENT_PATH.replace("<appointmentId>", appointmentId);
          const url = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_URL + path;

          const { data } = await axios.get(url, 
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authenticatedUser.token}`
              },
            }
          );
          console.log("data.user", data.user);
          console.log("data.specialist", data.specialist);
          console.log("data.speciality", data.speciality);
          setUser(data.user);
          setSpecialist(data.specialist);
          setSpeciality(data.speciality);
        } catch (e) {
          console.log(e);
        }
      };

      const newSocket = io(import.meta.env.VITE_REACT_APP_VIDEO_MICRO);
      setSocket(newSocket);

      console.log("socket", newSocket);
      window.scrollTo(0, 0);
      fetchAppointment();

      return () => {
        console.log('Disconnecting socket...');
        newSocket.disconnect();
      };
    }
  }, [authenticatedUser, appointmentId]);

  const handleReserve = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_USER_RESERVE_URL;
  };

  const handleAppointments = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_USER_APPOINTMENTS_URL;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="consultation-page">
      <Header 
        onReserve={handleReserve} 
        onAppointments={handleAppointments} 
        onLogout={handleLogout} 
        client={user ? `${user.firstName} ${user.lastName}` : ''} 
      />
      {speciality && specialist && (
        <ConsultationHeader 
          specialty={speciality.name} 
          doctorName={`${specialist.firstName} ${specialist.lastName}`} 
        />
      )}
      {socket && (
        <ConsultationOptions 
          userId={userId} 
          specialistId={specialistId} 
          appointmentId={appointmentId} 
          socket={socket} 
        />
      )}
      <Footer />
    </div>
  );
};

export default ConsultationPage;
