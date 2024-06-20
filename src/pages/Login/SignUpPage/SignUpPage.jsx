import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useSignup } from "../../../hooks/useSignup";
import axios from 'axios';
import './SignUpPage.css'; // Import your custom CSS

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SignUpPage = () => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [specialities, setSpecialities] = useState([]);  // Store fetched specialities
  const [selectedSpecialities, setSelectedSpecialities] = useState([]);  // Store selected specialities
  const [showAllSpecialities, setShowAllSpecialities] = useState(false); // Control visibility of all specialities

  const { signup, error, isLoading } = useSignup();
  const query = useQuery();

  useEffect(() => {
    setUserType(query.get('userType'));

    const fetchSpecialities = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_SPECIALITY_API_PATH);
        setSpecialities(response.data);  // Store fetched specialities in state
      } catch (error) {
        console.error('Error fetching specialities:', error);
      }
    };

    if (userType === "specialist") {
      fetchSpecialities();
    }
  }, [query, userType]);

  const handleSpecialityChange = (e) => {
    const value = e.target.value;
    setSelectedSpecialities((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((speciality) => speciality !== value)
        : [...prevSelected, value]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userData;

    switch (userType) {
      case "user":
        userData = {
          email,
          password,
          firstName,
          lastName,
          phone,
          dateOfBirth,
          gender
        };
        break;
      case "specialist":
        userData = {
          email,
          password,
          firstName,
          lastName,
          phone,
          specialities: selectedSpecialities  // Include selected specialities
        };
        break;
      default:
        console.log("Invalid user type");
        return;
    }

    console.log("userData:", userData);
    await signup(userType, userData);
  };

  return (
    <Container fluid className="signup-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4}>
          <Card className="signup-card p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <img src={`/images/sehha_logo.png`} alt="Logo" className="login-logo mb-3" />
                <h2>Create an account as a {userType === "user" ? "user" : userType === "specialist" ? "specialist" : null}</h2>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control 
                    type="email" 
                    placeholder="e-mail" 
                    className="signup-input mb-3" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    className="signup-input mb-3" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group controlId="formBasicFirstName">
                  <Form.Control 
                    type="text" 
                    placeholder="First Name" 
                    className="signup-input mb-3" 
                    required 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                  <Form.Control 
                    type="text" 
                    placeholder="Last Name" 
                    className="signup-input mb-3" 
                    required 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)} 
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPhone">
                  <Form.Control 
                    type="text" 
                    placeholder="Phone" 
                    className="signup-input mb-3" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </Form.Group>
                {userType === "user" && (
                  <>
                    <Form.Group controlId="formBasicDateOfBirth">
                      <Form.Control 
                        type="date" 
                        placeholder="Date of Birth" 
                        className="signup-input mb-3" 
                        required 
                        value={dateOfBirth} 
                        onChange={(e) => setDateOfBirth(e.target.value)} 
                      />
                    </Form.Group>
                    <Form.Group controlId="formBasicGender">
                      <Form.Control 
                        as="select" 
                        className="signup-input mb-3" 
                        required 
                        value={gender} 
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Control>
                    </Form.Group>
                  </>
                )}
                {userType === "specialist" && (
                  <>
                    <Form.Group controlId="formBasicSpecialities">
                      <Form.Label>Select Specialities</Form.Label>
                      <div className="speciality-checkboxes">
                        {specialities.slice(0, 3).map(speciality => (
                          <Form.Check 
                            type="checkbox"
                            key={speciality._id}
                            id={`formBasicSpecialities-${speciality._id}`} // Unique ID
                            value={speciality._id}
                            label={speciality.name}
                            checked={selectedSpecialities.includes(speciality._id)}
                            onChange={handleSpecialityChange}
                          />
                        ))}
                        {showAllSpecialities && specialities.slice(3).map(speciality => (
                          <Form.Check 
                            type="checkbox"
                            key={speciality._id}
                            id={`formBasicSpecialities-${speciality._id}`} // Unique ID
                            value={speciality._id}
                            label={speciality.name}
                            checked={selectedSpecialities.includes(speciality._id)}
                            onChange={handleSpecialityChange}
                          />
                        ))}
                      </div>
                      {specialities.length > 3 && (
                        <Button 
                          variant="link" 
                          onClick={() => setShowAllSpecialities(!showAllSpecialities)}
                        >
                          {showAllSpecialities ? 'Show Less' : 'Show More'}
                        </Button>
                      )}
                    </Form.Group>
                  </>
                )}
                <Button disabled={isLoading} variant="primary" type="submit" className="signup-button w-100 mb-2">
                  Sign Up
                </Button>
                {error && <div className="error">{error}</div>}
                <div className="text-center">
                  <span><a href={userType === "user" ? `${import.meta.env.VITE_REACT_APP_LOGIN}?userType=user` : `${import.meta.env.VITE_REACT_APP_LOGIN}?userType=specialist`} className="d-block mb-2">Already have an account? Log In</a></span>
                </div>
                <div className="text-center">
                  <span>{userType === "user" ? <a href={`${import.meta.env.VITE_REACT_APP_SIGNUP}?userType=specialist`} className="d-block mb-2">Are you a specialist? Sign up as a specialist</a> : <a href={`${import.meta.env.VITE_REACT_APP_SIGNUP}?userType=user`} className="d-block mb-2">Are you a user? Sign up as a user</a>}</span>
                </div>
              </Form>
              <div className="text-center mt-3">
                <a href={import.meta.env.VITE_REACT_APP_HOMEPAGE}>&lt; Home</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
