import { Link } from "react-router-dom";
import logo from "../logo.svg";
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
import {Navbar, Nav, Container, Form, Button, InputGroup} from "react-bootstrap";
import {useState} from "react";
import { BiSearch } from "react-icons/bi";
export const Menu = () => {
    // need to make navbar collapse when link clicked on in mobile
    // useState preserves values between function calls
    // expanded state variable
    //pass the initial value
    const [expanded, setExpanded] = useState(false);
    return (
          // clasName p3 for padding
          // https://medium.com/swlh/responsive-navbar-using-react-bootstrap-5e0e0bd33bd6
          <Navbar collapseOnSelect fixed="top" expand="sm" sbg="light" data-bs-theme="dark" id="nav-bar" className="p-3">
              <Container id="nav-container">
                  {/*// Used React Bootstrap documentation for Navbar.Brand code*/}
                    <Navbar.Brand as={Link}to="/">
                     <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
                     </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="collapse-nav">
                <Nav className="ms-auto">
                    {/*<Nav.Link as={Link}to="/search"s onClick={ () => setExpanded(true)}>Search</Nav.Link>*/}
                      <InputGroup className="mb-3">
                          <Form.Control placeholder="Search" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
                          <Button type="submit" variant="outline-secondary" id="button-addon2"><BiSearch /></Button>
                        </InputGroup>
                    <Nav.Link as={Link}to="/inbox">Messages</Nav.Link>
                    <Nav.Link as={Link}to="/profile">Profile </Nav.Link>
                    <Nav.Link as={Link}to="/login">Login</Nav.Link>
                    <Nav.Link as={Link}to="/signup">Sign up</Nav.Link>
                </Nav>
                  </Navbar.Collapse>
             </Container>
        </Navbar>
    );
}
