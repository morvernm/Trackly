import { Link } from "react-router-dom";
import logo from "../logo.svg";
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
import {Navbar, Nav, Container} from "react-bootstrap";
export const Menu = () => {
    return (
          // clasName p3 for padding
          <Navbar collapseOnSelect fixed="top" expand="sm" sbg="light" data-bs-theme="dark" id="nav-bar" className="p-3">
              <Container id="nav-container">
                  {/*// Used React Bootstrap documentation for Navbar.Brand code*/}
                    <Navbar.Brand as={Link}to="/">
                     <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
                     </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="collapse-nav">
                <Nav>
                    <Nav.Link as={Link}to="/search">Search</Nav.Link>
                    <Nav.Link as={Link}to="/inbox">Messages</Nav.Link>
                    <Nav.Link as={Link}to="/profile">Profile </Nav.Link>
                    <Nav.Link as={Link}to="/login">Login</Nav.Link>
                </Nav>
                  </Navbar.Collapse>
             </Container>
        </Navbar>
    );
}
