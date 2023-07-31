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
    // stops username and password from being changed
    const initialData = Object.freeze({
        email: '',
        username: '',
        password: '',
    });

    const [regFormData, setRegFormData] = useState(initialData)

    const handleChange = (e) => {
        setRegFormData({
            ...regFormData,
            // trimming data as it has spaces
            [e.target.name]: e.target.value.trim(),
        });
    };

    const handleSubmit = (e) => {
        // let password =
        // if()
        console.log(regFormData);
        e.preventDefault();

        // using axios to send from frontend to django backend
        axiosInstance
            .post(`register/`, {
                email: regFormData.email,
                username: regFormData.username,
                password: regFormData.password,
        })
            .then((res) => {
            console.log(res);
            console.log(res.data);
            setVariant("success");
            setStatus("Account created!");
        })
            .catch((error) => {
                if(regFormData.password.length < 8) {
                    console.log("password too short");
                    setVariant("danger");
                    setStatus("Your password must be at least 8 characters long");
                } else {
                    console.log("Email or username already registered");
                    setVariant("danger");
                    setStatus("Your email or username may already be registered");
                }

               // render(
               //     set()
               //
               //          // <p>email or username already registered</p>
               //  );
        });
    }
    return (
        <div className="login">
            <Container className="login">
                <div className="login-form">
                    <h4>Register</h4>
                    <br />
                    <br />
                {/*<div className="input-group mb-3">*/}
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
                             <Form.Group className="mb-3" controlId="formBasicPassword">
                             <Form.Label>Confirm Password</Form.Label>
                             <Form.Control name="confirm-password" type="password" placeholder="********"  required onChange={handleChange}/>
                        </Form.Group>
                        {/*<p class="primary" id="status">{status}</p>*/}
                        <Alert variant={variant}>{status}</Alert>
                        <Button variant="info" type="submit" size="lg"> Sign up </Button>
                  {/*<br />*/}
                       <Link to="/login"><Button variant="outline-light" size="lg"> Login </Button></Link>
                    </Form>
                </div>
                {/*</div>*/}
            </Container>


        </div>
    )
}