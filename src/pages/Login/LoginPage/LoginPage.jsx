import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './LoginPage.css'; // Import your custom CSS
import { useLogin } from "../../../hooks/useLogin";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const LoginPage = () => {
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const query = useQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(userType, email, password);
  }
  
  useEffect(() => {
    setUserType(query.get('userType'));
  }, [query]);

  return (
    <Container fluid className="login-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={6} lg={4}>
          <Card className="login-card p-4">
            <Card.Body>
              <div className="text-center mb-4">
                {/* root  */}
                <img src={`/images/sehha_logo.png`} alt="Logo" className="login-logo mb-3" />
                <h2>Welcome! Login as a {userType === "user" ? "user" : userType === "specialist" ? "specialist" : null}</h2>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control 
                    type="email" 
                    placeholder="e-mail" 
                    className="login-input mb-3" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    className="login-input mb-3" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="login-button w-100 mb-2" disabled={isLoading}>
                  Log in
                </Button>
                {error && <div className="error">{error}</div>}
                <div className="text-center">
                  <span><a href={userType === "user" ? `${import.meta.env.VITE_REACT_APP_SIGNUP}?userType=user` : userType === "specialist" ? `${import.meta.env.VITE_REACT_APP_SIGNUP}?userType=specialist` : null} className="d-block mb-2">Sign Up if you don’t have an account!</a></span>
                </div>
                <div className="text-center">
                  <span>{userType === "user" ? <a href={`${import.meta.env.VITE_REACT_APP_LOGIN}?userType=specialist`} className="d-block mb-2">Are you a specialist? Login as a specialist</a> : userType === "specialist" ? <a href={`${import.meta.env.VITE_REACT_APP_LOGIN}?userType=user`} className="d-block mb-2">Are you a user? Login as a user</a> : null}</span>
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

export default LoginPage;

// this is a prompt: give me a style for the class "error"
