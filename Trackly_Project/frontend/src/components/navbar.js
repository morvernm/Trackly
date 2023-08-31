import { Link } from "react-router-dom";
import logo from "../logo.svg";
import {Navbar, Nav, Container, Form, Button, InputGroup} from "react-bootstrap";
import React, {Fragment, useContext, useState} from "react";
import { BiSearch } from "react-icons/bi";
import AuthContext from '../AuthProvider.js';
import axiosInstance from "../axios";
import {SearchBar} from "../components/SearchBar";

export const MemberMenu = () => {
    const { auth} = useContext(AuthContext);
    const userId = localStorage.getItem('user_id');


    const navAuthenticated = () => {
        return (
              <Container id="nav-container">
                  {/*// Used React Bootstrap documentation for Navbar.Brand code
                  https://react-bootstrap.netlify.app/docs/components/navbar/*/}
                    <Navbar.Brand as={Link}to="/">
                     <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
                    </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">
                    <SearchBar className="p-2"/>
                    <Nav.Link as={Link}to={`/user/${userId}/reviews`}>Reviews</Nav.Link>
                    <Nav.Link as={Link}to={`/profile/user/${userId}`}>Profile </Nav.Link>
                    <Nav.Link as={Link}to="/logout">Logout</Nav.Link>
                </Nav>
                  </Navbar.Collapse>
             </Container>
        )

    }

    const unauthenticated = () => {
        return (
              <Container id="nav-container">
                  {/*// Used React Bootstrap documentation for Navbar.Brand code
                  https://react-bootstrap.netlify.app/docs/components/navbar/*/}
                    <Navbar.Brand as={Link}to="/">
                     <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
                     </Navbar.Brand>
                  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                  <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="ms-auto">
                         <SearchBar />
                    <Nav.Link as={Link}to="/login">Login</Nav.Link>
                    <Nav.Link as={Link}to="/register">Register</Nav.Link>

                </Nav>
                  </Navbar.Collapse>
             </Container>
        )
    }
    return (
           <Navbar collapseOnSelect fixed="top" expand="sm" bg="light" data-bs-theme="dark" id="nav-bar" className="p-2">
               {auth ? navAuthenticated() : (unauthenticated())}
            </Navbar>
    );
}
