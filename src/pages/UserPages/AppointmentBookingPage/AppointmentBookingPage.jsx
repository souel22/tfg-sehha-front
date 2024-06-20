import React, { useState, useEffect } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import Header from "./Header/Header";
import SpecialistCard from "./SpecialistCard/SpecialistCard";
import Footer from "./Footer/Footer";
import SearchBar from "./SearchBar/SearchBar";
import { useLogout } from '../../../hooks/useLogout';
import { useAuthContext } from "../../../hooks/useAuthContext"

import "./AppointmentBookingPage.css";

// Main Page Component
const AppointmentBookingPage = () => {
  const [specialists, setSpecialists] = useState([]);
  const [filteredSpecialists, setFilteredSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const { logout } = useLogout();
  const { user: authenticatedUser } = useAuthContext();

  useEffect(() => {
    if (authenticatedUser) {
      console.log("authenticatedUser:", authenticatedUser);
      setUser(authenticatedUser.user)

      const fetchSpecialists = async () => {
        try {
          const path = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_SPECIALISTS_PATH;
          const baseUrl = import.meta.env.VITE_REACT_APP_APPOINTMENT_MANAGEMENT_API_URL;
          const url = `${baseUrl}${path}`;
          const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${authenticatedUser.token}` }
          });
          setSpecialists(response.data);
          setFilteredSpecialists(response.data);  // Initially, show all specialists
        } catch (error) {
          console.error("Error fetching specialists data:", error);
          setError("Failed to load specialists data.");
        } finally {
          setLoading(false);
        }
      };

      // fetchUser();
      fetchSpecialists();
    }
  }, [authenticatedUser]);

  const handleAppointments = () => {
    window.location.href = import.meta.env.VITE_REACT_APP_USER_APPOINTMENTS_URL;
  };

  const handleLogout = () => {
    logout();
  };

  const handleFilter = (filters) => {
    const filtered = specialists.filter(specialist => {
      const from = filters.from ? new Date(filters.from) : null;
      const to = filters.to ? new Date(filters.to) : null;
      return (
        (!filters.specialist || specialist.id === filters.specialist) &&
        (!from || new Date(specialist.availabilityStart) >= from) &&
        (!to || new Date(specialist.availabilityEnd) <= to)
      );
    });
    setFilteredSpecialists(filtered);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Header onLogout={handleLogout} onAppointments={handleAppointments} client={`${user.firstName} ${user.lastName}`} />
      <SearchBar specialists={specialists} onFilter={handleFilter} />
      {error && (
        <Container>
          <Alert variant="danger">
            {error}
          </Alert>
        </Container>
      )}
      <Container>
        <Row>
          {filteredSpecialists.length > 0 ? filteredSpecialists.map((specialist) => (
            <Col md={6} lg={4} key={specialist.id} className="mb-4">
              <SpecialistCard
                name={`Dr. ${specialist.name}`}
                specialities={specialist.specialities}
                specialistId={specialist.id}
                userId={user.id}
                profileImage={`/images/empty-profile-picture.webp`}
                token={authenticatedUser.token}
              />
            </Col>
          )) : 
          <Col>
            <p>No specialists found</p>
          </Col>
          }
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default AppointmentBookingPage;
