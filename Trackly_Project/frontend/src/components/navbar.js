import { Link } from "react-router-dom";
import logo from "../logo.svg";
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
import {Navbar, Nav} from "react-bootstrap";
export const Menu = () => {
    return (
          // Used React Bootstrap documentation for Navbar.Brand code
          <Navbar bg="light" data-bs-theme="light" id="nav-bar">
                   <Navbar.Brand as={Link}to="/">
            <img id ="nav-logo" alt="Trackly Logo" src={logo} className="d-inline-block align-top"/>{' '}Trackly
          </Navbar.Brand>
            <Nav>
                <Nav.Link as={Link}to="/search">Search</Nav.Link>
                <Nav.Link as={Link}to="/inbox">Messages</Nav.Link>
                <Nav.Link as={Link}to="/profile">Profile </Nav.Link>
                <Nav.Link as={Link}to="/login">Login</Nav.Link>
            </Nav>

        </Navbar>
        // <nav className="nav">
        //   <img src={ logo } className="nav-logo" alt="Trackly Logo"/>
        //         <li><Link to="/" className="title" id="title"> Trackly </Link></li>
        //     <ul>
        //         {/*<li><Link to="/"> Home </Link></li>*/}
        //         <li><Link to="/search"> Search </Link></li>
        //          <li><Link to ="/inbox"> Messages </Link></li>
        //         <li><Link to="/profile"> Profile </Link></li>
        //         <li><Link to="/login"> Login </Link></li>
        //     </ul>
        // </nav>

    );
}
// export default Menu;
