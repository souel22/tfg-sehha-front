import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import SearchBar from "./SearchBar/SearchBar";
import AppointmentList from "./AppointmentList/AppointmentList";
import { useLogout } from '../../../hooks/useLogout';
import { useAuthContext } from "../../../hooks/useAuthContext";
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [user, setUser] = useState({});
  const { user: authenticatedUser } = useAuthContext();
  const { logout } = useLogout();
  const baseUrl = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_URL;
  const sortPopulated = 'slot.startTime';

  useEffect(() => {
    // Fetch appointments only if authenticatedUser is available
    if (authenticatedUser) {
      setUser(authenticatedUser.user)
      const fetchAppointments = async () => {
        try {
          const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENTS_PATH;
          const url = `${baseUrl}${path}?user=${authenticatedUser.user.id}&sortPopulated=${sortPopulated}`;
          const response = await axios.get(url, { 
            headers: { Authorization: `Bearer ${authenticatedUser.token}` },
            withCredentials: true,
          });
          setFilteredAppointments(response.data);
        } catch (error) {
          console.error('Error fetching appointments:', error.message);
          setFilteredAppointments([])
        }
      };
      fetchAppointments();
    }
  }, [authenticatedUser]);

  const handleFilter = async (filters) => {
    try {
      const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENTS_PATH;
      let url = `${baseUrl}${path}?user=${authenticatedUser.user.id}&sortPopulated=${sortPopulated}`;

      // Remove empty filters
      const validFilters = Object.keys(filters).reduce((acc, key) => {
        if (filters[key]) acc[key] = filters[key];
        return acc;
      }, {});

      const response = await axios.get(url, {
        params: validFilters,
        headers: { Authorization: `Bearer ${authenticatedUser.token}` },
        withCredentials: true,
      });

      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching filtered appointments:', error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const path = `${import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENTS_PATH}/${appointmentId}`;
      const url = baseUrl + path;
      const response = await axios.delete(url, { 
        headers: { Authorization: `Bearer ${authenticatedUser.token}` },
        withCredentials: true,
      });
      console.log("cancel response: ", response);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleJoin = (appointmentId) => {
    const path = import.meta.env.VITE_REACT_APP_USER_VIDEO_URL;
    const url = `${path}?appointment=${appointmentId}`;
    window.location.href = url;
  };

  const handleReserve = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_USER_RESERVE_URL;
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
      <Header onReserve={handleReserve} onLogout={handleLogout} client={`${user.firstName} ${user.lastName}`} />
      <SearchBar onFilter={handleFilter} appointments={filteredAppointments} />
      <AppointmentList appointments={filteredAppointments} onCancel={handleCancel} onJoin={handleJoin} />
      <Footer />
    </div>
  );
};

export default AppointmentsPage;
