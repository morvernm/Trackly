import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useNavigate} from "react-router-dom";
import axiosInstance from "../axios";
import React, { useState } from "react";
import {render} from "@testing-library/react";

// used Boostrap React documentation for form components
// https://react-bootstrap.netlify.app/docs/forms/overview
export default function Register()  {
    // for updating the user
    const [status, setStatus] = useState('')
    const [variant, setVariant] = useState('');

    const initialData = Object.freeze({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [regFormData, setRegFormData] = useState(initialData)

    const handleChange = (e) => {
        setRegFormData({
            ...regFormData,
            // trimming data if it has spaces
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(regFormData.password !== regFormData.confirmPassword) {
            setVariant("danger");
            setStatus("Please ensure your passwords match");
            return console.log("passwords don't match");
        }

        // using axios to send from frontend to django backend
        axiosInstance
            .post(`register/`, {
                email: regFormData.email,
                username: regFormData.username,
                password: regFormData.password
        })
            .then((res) => {
            console.log(res);
            console.log(res.data);
            setVariant("success");
            setStatus("Account created!");
        })
            .catch((error) => {
                    console.log("error");
                    setVariant("danger");
                     setStatus("Sorry we encountered an error" + error.message);
        });
    }
    return (
        <div className="user-auth-div">
            <Container className="login">
                <div className="login-form">
                    <h4>Register</h4>
                    <br />
                    <br />
                    <Form className="login-f" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control name="email" type="email" placeholder="email@email.com" required  onChange={handleChange}/>
                        </Form.Group>

                         <Form.Group className="mb-3" controlId="formBasicUsername">
                             <Form.Label>Username</Form.Label>
                             <Form.Control name="username" type="text" placeholder="Username" required onChange={handleChange}/>
                         </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                             <Form.Label>Password</Form.Label>
                             <Form.Control name="password" type="password" placeholder="********"  required onChange={handleChange}/>
                        </Form.Group>
                             <Form.Group className="mb-3" controlId="formConfirmPassword">
                             <Form.Label>Confirm Password</Form.Label>
                             <Form.Control name="confirmPassword" type="password" placeholder="********"  required onChange={handleChange}/>
                        </Form.Group>
                        <Button variant="info" type="submit"> Sign up </Button>
                        <br />
                       <p style={{color: '#CCCCCC', display: 'inline'}}>Already have an account? <Link style={{color: 'white'}} to="/login">Login</Link></p>
                           <Alert variant={variant}>{status}</Alert>
                    </Form>
                </div>
            </Container>
        </div>
    )
}