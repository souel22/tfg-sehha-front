import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import './NavBar.css';  // Import the custom CSS

function NavBar() {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
      <Navbar.Brand href={import.meta.env.VITE_REACT_APP_HOMEPAGE} className="d-flex align-items-center">
          <img
            src= {`/images/sehha_logo.png`}
            className="d-inline-block align-top"
            alt="SAHHA logo"
            style={{ width: '30%', height: 'auto' }}
          />
          <span className="ml-2">SEHHA</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#about" className="custom-nav-link">ABOUT</Nav.Link>
            <Nav.Link href="#services" className="custom-nav-link">SERVICES</Nav.Link>
            <Nav.Link href="#contact" className="custom-nav-link">CONTACT</Nav.Link>
            <NavDropdown title="More" id="basic-nav-dropdown" className="custom-nav-link">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
            <Button variant="primary" href={`${import.meta.env.VITE_REACT_APP_LOGIN_SIGNUP_SELECTION}?action=signup`} className="custom-signin-button">SIGN UP</Button>
            <Button variant="outline-secondary" href={`${import.meta.env.VITE_REACT_APP_LOGIN_SIGNUP_SELECTION}?action=login`} className="custom-login-button">LOG IN</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
