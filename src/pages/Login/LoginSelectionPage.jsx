import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './LoginSelectionPage.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const LoginSelectionPage = () => {
  const [buttons, setButtons] = useState({});
  const query = useQuery();
  const action = query.get('action');

  useEffect(() => {
    if (action === 'login') {
      setButtons({
        "user-button": (
          <Button variant="primary" className="selection-button" href={`${import.meta.env.VITE_REACT_APP_LOGIN}?userType=user`}>
            Login as User
          </Button>
        ),
        "specialist-button": (
          <Button variant="secondary" className="selection-button" href={`${import.meta.env.VITE_REACT_APP_LOGIN}?userType=specialist`}>
            Login as Specialist
          </Button>
        )
      });
    } else if (action === 'signup') {
      setButtons({
        "user-button": (
          <Button variant="primary" className="selection-button" href={`${import.meta.env.VITE_REACT_APP_SIGNUP}?userType=user`}>
            Sign Up as User
          </Button>
        ),
        "specialist-button": (
          <Button variant="secondary" className="selection-button" href={`${import.meta.env.VITE_REACT_APP_SIGNUP}?userType=specialist`}>
            Sign Up as Specialist
          </Button>
        )
      });
    }
  }, [action]);

  return (
    <Container fluid className="login-selection-page d-flex align-items-center justify-content-center">
      <Card className="text-center p-4 login-selection-card">
        <Card.Body>
          <h2 className="mb-4">Select {action === 'login' ? 'Login' : action === 'signup' ? 'Sign Up' : null} Type</h2>
          <Row className="mt-4">
            <Col md={6} className="text-center mb-3">
              {buttons["user-button"]}
            </Col>
            <Col md={6} className="text-center mb-3">
              {buttons["specialist-button"]}
            </Col>
            <Col md={6} className="text-center mb-3">
              <Button variant="link" href={import.meta.env.VITE_REACT_APP_HOMEPAGE}> &lt; Back to Home</Button>
            </Col>
            {/* link to go to login or signup selection from the signup and login selections respectively */}
             <Col md={6} className="text-center mb-3">
              {action === 'login' ? <Button variant="link" href={`${import.meta.env.VITE_REACT_APP_LOGIN_SIGNUP_SELECTION}?action=signup`}>Sign Up</Button> : action === 'signup' ? <Button variant="link" href={`${import.meta.env.VITE_REACT_APP_LOGIN_SIGNUP_SELECTION}?action=login`}>Login</Button> : null}             
            </Col> 
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginSelectionPage;
