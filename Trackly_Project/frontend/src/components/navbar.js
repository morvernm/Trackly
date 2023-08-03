import { Link } from "react-router-dom";
import logo from "../logo.svg";
import {Navbar, Nav, Container, Form, Button, InputGroup} from "react-bootstrap";
import React, {Fragment, useContext, useState} from "react";
import { BiSearch } from "react-icons/bi";
import AuthContext from '../AuthProvider.js';
import axiosInstance from "../axios";
import {SearchBar} from "../components/SearchBar";

export const MemberMenu = () => {
    const { auth } = useContext(AuthContext);
    const [searchInput, setSearch] = useState('');

    const handleKeyEvent = (e) => {
        // if(e.code === 'Enter')
    }

    const handleSubmit = (e) => {
        // return(
        //
        // )
    }
        const [expanded, setExpanded] = useState(false);
    const navAuthenticated = () => {
        return (
             // <Navbar collapseOnSelect fixed="top" expand="sm" bg="light" data-bs-theme="dark" id="nav-bar" className="p-2">
              <Container id="nav-container">
                  {/*// Used React Bootstrap documentation for Navbar.Brand code*/}
                    <Navbar.Brand as={Link}to="/">
                     <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
                     </Navbar.Brand>
                  {/*<InputGroup className="mb-2">*/}
                  {/*        /!*<Form.Control placeholder="Search" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>*!/*/}
                  {/*        <Link to="/search"><Button  onSubmit={handleSubmit} type="submit"  id="button-addon2"><BiSearch /></Button></Link>*/}
                  {/*      </InputGroup>*/}
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">

                      {/*<InputGroup className="mb-2">*/}
                      {/*    /!*<Form.Control placeholder="Search" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>*!/*/}
                      {/*    <Link to="/search"><Button  onSubmit={handleSubmit} type="submit"  id="button-addon2"><BiSearch /></Button></Link>*/}
                      {/*  </InputGroup>*/}
                    <SearchBar />
                    {/*<Link to="/search"><Button  type="submit"  id="button-addon2"><BiSearch /></Button></Link>*/}
                    <Nav.Link as={Link}to="/inbox">Messages</Nav.Link>
                    <Nav.Link as={Link}to="/profile/">Profile </Nav.Link>
                    <Nav.Link as={Link}to="/logout">Logout</Nav.Link>
                </Nav>
                  </Navbar.Collapse>
             </Container>
        // </Navbar>
        )

    }

    const unauthenticated = () => {
        return (
             // <Navbar collapseOnSelect fixed="top" expand="sm" bg="light" data-bs-theme="dark" id="nav-bar" className="p-2">
              <Container id="nav-container">
                  {/*// Used React Bootstrap documentation for Navbar.Brand code*/}
                    <Navbar.Brand as={Link}to="/">
                     <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
                     </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">
                    {/*<Nav.Link as={Link}to="/search"s onClick={ () => setExpanded(true)}>Search</Nav.Link>*/}
                 {/*     <InputGroup className="mb-2">*/}
                 {/*         <Form.Control keyboardEvent={handleKeyEvent} placeholder="Search for an artist" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>*/}
                 {/*<Link to="/search"><Button onSubmit={handleSubmit} type="submit"  id="button-addon2"><BiSearch /></Button></Link>*/}
                 {/*       </InputGroup>*/}
                         <SearchBar />
                    <Nav.Link as={Link}to="/login">Login</Nav.Link>
                    <Nav.Link as={Link}to="/register">Register</Nav.Link>

                </Nav>
                  </Navbar.Collapse>
             </Container>
        // </Navbar>
        )
    }
    // let {authenticated, unauthenticated} = useContext(AuthContext);

    // // need to make navbar collapse when link clicked on in mobile
    // useState preserves values between function calls
    // expanded state variable
    //pass the initial value
    // const [expanded, setExpanded] = useState(false);
    return (
           <Navbar collapseOnSelect fixed="top" expand="sm" bg="light" data-bs-theme="dark" id="nav-bar" className="p-2">
               {auth ? navAuthenticated() : (unauthenticated())}
            </Navbar>




        //   // clasName p3 for padding
        //   // https://medium.com/swlh/responsive-navbar-using-react-bootstrap-5e0e0bd33bd6
        //   <Navbar collapseOnSelect fixed="top" expand="sm" bg="light" data-bs-theme="dark" id="nav-bar" className="p-2">
        //       <Container id="nav-container">
        //           {/*// Used React Bootstrap documentation for Navbar.Brand code*/}
        //             <Navbar.Brand as={Link}to="/">
        //              <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
        //              </Navbar.Brand>
        //           <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        //           <Navbar.Collapse id="responsive-navbar-nav">
        //         <Nav className="ms-auto">
        //             {/*<Nav.Link as={Link}to="/search"s onClick={ () => setExpanded(true)}>Search</Nav.Link>*/}
        //               <InputGroup className="mb-2">
        //                   <Form.Control placeholder="Search" aria-label="Search for an artist or album" aria-describedby="basic-addon2"/>
        //                   <Button  type="submit"  id="button-addon2"><BiSearch /></Button>
        //                 </InputGroup>
        //             {/*{authenticated ? }*/}
        //             <Nav.Link as={Link}to="/inbox">Messages</Nav.Link>
        //             <Nav.Link as={Link}to="/profile">Profile </Nav.Link>
        //             <Nav.Link as={Link}to="/login">Login</Nav.Link>
        //             <Nav.Link as={Link}to="/register">Register</Nav.Link>
        //             <Nav.Link as={Link}to="/logout">Logout</Nav.Link>
        //         </Nav>
        //           </Navbar.Collapse>
        //      </Container>
        // </Navbar>
    );
}
