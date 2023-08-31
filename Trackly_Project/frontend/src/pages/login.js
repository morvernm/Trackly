import { Form, Button, Container, Alert } from "react-bootstrap";
import { Link, useNavigate }  from "react-router-dom";
import React, { useState, useContext } from "react";
import axiosInstance from "../axios";
import AuthContext from "../AuthProvider";

// used Boostrap React documentation for form components
// https://react-bootstrap.netlify.app/docs/forms/overview
export default function Login() {
    const {login, auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [status, setStatus] = useState('')
    const [variant, setVariant] = useState('');

    // stops username and password from being changed
    const initialData = Object.freeze({
        username: '',
        password: '',
    });

    const [loginFormData, setLoginFormData] = useState(initialData);

      const handleChange = (e) => {
        setLoginFormData({
            ...loginFormData,
            // trimming data as it has spaces
            [e.target.name]: e.target.value.trim(),
        });
    };

    /*
    The handleSubmit function is based off code from this tutorial:
    https://github.com/veryacademy/YT-Django-DRF-Simple-Blog-Series-JWT-Part-3/blob/master/react/blogapi/src/components/login.js
    Author: veryacademy
    Title: YT-Django-DRF-Simple-Blog-Series-JWT-Part-3
     */
    const handleSubmit = (e) => {
        console.log(loginFormData);
        e.preventDefault();
        axiosInstance
            .post(`token/`, {
                username: loginFormData.username,
                password: loginFormData.password,
        })
            .then((res) => {

                // store their access and refresh token in local storage
                localStorage.setItem('access_token', res?.data?.access);
                localStorage.setItem('refresh_token', res?.data?.refresh);
                localStorage.setItem('username', loginFormData.username);
                 const accessToken = res?.data?.access;
                 login(localStorage.getItem('username'), localStorage.getItem('access_token'),localStorage.getItem('refresh_token') );
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access_token');
                navigate("/");


        })
            .catch((error) => {
                console.log("Wrong login details");
                setVariant("danger");
                setStatus("Did you enter the correct username and password?");
        });
    }

    return (
        <div className="user-auth-div">
            <Container className="login">
                <div className="login-form">
                    <h4>Login</h4>
                    <br />
                    <br />
                    <Form className="login-f" onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control name="username" type="text"  placeholder="Username" required onChange={handleChange}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                             <Form.Label>Password</Form.Label>
                             <Form.Control name="password" type="password" placeholder="********" required onChange={handleChange}/>
                        </Form.Group>
                        <Button className="mb-2" variant="info" type="submit" size="lg"> Log in</Button>
                        <br />
                        <Link style={{color: 'white'}} to="/register">Create an account</Link>
                        <Alert variant={variant}>{status}</Alert>
                    </Form>
                </div>
            </Container>


        </div>
    )
}