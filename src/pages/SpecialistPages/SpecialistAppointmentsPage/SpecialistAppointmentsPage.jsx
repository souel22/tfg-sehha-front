import Header from "./Header/Header";
import SearchBar from "./SearchBar/SearchBar";
import AppointmentList from "./AppointmentList/AppointmentList";
import Footer from "./Footer/Footer";
import "./style.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLogout } from '../../../hooks/useLogout';
import { useAuthContext } from '../../../hooks/useAuthContext';

const SpecialistAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const { logout } = useLogout();
  const { user: authenticatedUser } = useAuthContext();
  const [specialist, setSpecialist] = useState(null);

  const baseUrl = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_URL;
  const sortPopulated = 'slot.startTime';

  useEffect(() => {
    const fetchAppointments = async () => {
      if (authenticatedUser && authenticatedUser.specialist) {
        setSpecialist(authenticatedUser.specialist);
        console.log("specialist: ", authenticatedUser.specialist);
        try {
          const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENTS_PATH;
          if (baseUrl && path) {
            const url = `${baseUrl}${path}?specialist=${authenticatedUser.specialist.id}&sortPopulated=${sortPopulated}`;
            const response = await axios.get(url, {
              headers: { Authorization: `Bearer ${authenticatedUser.token}` }
            });
            if (response.data) {
              setAppointments(response.data); // Assuming the API returns an array of appointments
              const uniqueUsers = Array.from(new Set(response.data.map(appointment => appointment.user._id)))
                .map(id => {
                  return response.data.find(appointment => appointment.user._id === id).user;
                });
              setUsers(uniqueUsers);
            }
          } else {
            console.error('API paths or baseUrl are not defined.');
          }
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      }
    };
    fetchAppointments();
  }, [authenticatedUser, baseUrl, sortPopulated]);

  const handleJoin = async (appointmentId) => {
    try {
      const path = import.meta.env.VITE_REACT_APP_SPECIALIST_VIDEO_URL;
      if (path) {
        const url = `${path}?appointment=${appointmentId}`;
        window.location.href = url;
      } else {
        console.error('Video URL path is not defined.');
      }
    } catch (error) {
      console.error('Error joining', error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENTS_PATH;
      if (baseUrl && path) {
        const url = `${baseUrl}${path}/${appointmentId}`;
        const response = await axios.delete(url);
        console.log("cancel response: ", response);
        // setAppointments(response.data); // Assuming the API returns the filtered list of appointments
      } else {
        console.error('API path or baseUrl is not defined.');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    }
  };

  const handleScheduleAppointment = () => {
    const url = import.meta.env.VITE_REACT_APP_SPECIALIST_SCHEDULE_APPOINTMENT_URL;
    if (url) {
      window.location.href = url;
    } else {
      console.error('Schedule appointment URL is not defined.');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleFilter = async (filters) => {
    try {
      const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_APPOINTMENTS_PATH;
      if (baseUrl && path && specialist) {
        const url = `${baseUrl}${path}?specialist=${specialist.id}&sortPopulated=${sortPopulated}`;
        const filterKeys = Object.keys(filters);
        filterKeys.forEach(key => {
          if (filters[key] === '') {
            delete filters[key];
          }
        });
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${authenticatedUser.token}` },
          params: filters
        });
        if (response.data) {
          setAppointments(response.data); // Assuming the API returns an array of appointments
        }
      } else {
        console.error('API path, baseUrl or specialist is not defined.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  if (!specialist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="staff-appointments-page">
      <Header 
        onScheduleAppointment={handleScheduleAppointment} 
        onLogout={handleLogout} 
        specialist={`Dr. ${specialist.firstName} ${specialist.lastName}`} 
      />
      <SearchBar 
        onFilter={handleFilter} 
        specialities={specialist.specialities || []} 
        users={users} 
      />
      <AppointmentList 
        onJoin={handleJoin} 
        onCancel={handleCancel} 
        appointments={appointments} 
      />
      <Footer />
    </div>
  );
};

export default SpecialistAppointmentsPage;
