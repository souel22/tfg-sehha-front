import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AppointmentBookingPage from './pages/UserPages/AppointmentBookingPage/AppointmentBookingPage';
import AppointmentsPage from './pages/UserPages/AppointmentsPage/AppointmentsPage';
import ConsultationPage from './pages/UserPages/ConsultationPage/ConsultationPage';
import SpecialistAppointmentsPage from './pages/SpecialistPages/SpecialistAppointmentsPage/SpecialistAppointmentsPage';
import SpecialistConsultationPage from './pages/SpecialistPages/SpecialistConsultationPage/SpecialistConsultationPage';
import Scheduler from './pages/SpecialistPages/Scheduler/Scheduler';
import LoginSelectionPage from './pages/Login/LoginSelectionPage';
import LoginPage from './pages/Login/LoginPage/LoginPage';
import SignUpPage from './pages/Login/SignUpPage/SignUpPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuthContext } from './hooks/useAuthContext';
import validateToken from './utils/validateToken';
import { useLogout } from './hooks/useLogout';
import './App.css'

const App = () => {
  const { user: authenticatedUser } = useAuthContext();
  const { logout } = useLogout();
  const token = authenticatedUser?.token;

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = validateToken(token);
      console.log("decodedToken", decodedToken);
      const id = authenticatedUser.specialist ? authenticatedUser.specialist.id : authenticatedUser.user ? authenticatedUser.user.id : null;
      if (authenticatedUser && id !== decodedToken?.id) {
        console.log("id !== decodedToken?.id", id, decodedToken?.id);
        logout();
      } else {
        setUserRole(decodedToken?.role);
        setIsTokenValid(true);
      }
    }
  }, [token, authenticatedUser, logout]);

  if (!isTokenValid && authenticatedUser) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path={import.meta.env.VITE_REACT_APP_HOMEPAGE}
          element={!authenticatedUser ? <HomePage /> : (userRole === 'user' ? <Navigate to={import.meta.env.VITE_REACT_APP_USER_APPOINTMENTS_URL} /> : userRole === 'specialist' ? <Navigate to={import.meta.env.VITE_REACT_APP_SPECIALIST_APPOINTMENTS_URL} /> : logout())}
        />
        <Route path={import.meta.env.VITE_REACT_APP_LOGIN_SIGNUP_SELECTION} element={!authenticatedUser ? <LoginSelectionPage /> : <Navigate to={import.meta.env.VITE_REACT_APP_HOMEPAGE} />} />
        <Route path={import.meta.env.VITE_REACT_APP_LOGIN} element={!authenticatedUser ? <LoginPage /> : <Navigate to={import.meta.env.VITE_REACT_APP_HOMEPAGE} />} />
        <Route path={import.meta.env.VITE_REACT_APP_SIGNUP} element={!authenticatedUser ? <SignUpPage /> : <Navigate to={import.meta.env.VITE_REACT_APP_HOMEPAGE} />} />

        {/* User Routes */}
        {authenticatedUser && userRole === 'user' && <Route path={import.meta.env.VITE_REACT_APP_USER_APPOINTMENTS_URL} element={<AppointmentsPage />} />}
        {authenticatedUser && userRole === 'user' && <Route path={import.meta.env.VITE_REACT_APP_USER_RESERVE_URL} element={<AppointmentBookingPage />} />}
        {authenticatedUser && userRole === 'user' && <Route path={import.meta.env.VITE_REACT_APP_USER_VIDEO_URL} element={<ConsultationPage />} />}

        {/* Specialist Routes */}
        {authenticatedUser && userRole === 'specialist' && <Route path={import.meta.env.VITE_REACT_APP_SPECIALIST_APPOINTMENTS_URL} element={<SpecialistAppointmentsPage />} />}
        {authenticatedUser && userRole === 'specialist' && <Route path={import.meta.env.VITE_REACT_APP_SPECIALIST_VIDEO_URL} element={<SpecialistConsultationPage />} />}
        {authenticatedUser && userRole === 'specialist' && <Route path={import.meta.env.VITE_REACT_APP_SPECIALIST_SCHEDULE_APPOINTMENT_URL} element={<Scheduler />} />}

        {/* Catch-all Route */}
        {/* <Route path="*" element={<Navigate to={import.meta.env.VITE_REACT_APP_HOMEPAGE} />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
