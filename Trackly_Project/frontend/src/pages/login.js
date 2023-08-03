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

    const handleSubmit = (e) => {
        console.log(loginFormData);
        e.preventDefault();

        // using axios to send from frontend to django backend
        axiosInstance
            .post(`token/`, {
                username: loginFormData.username,
                password: loginFormData.password,
        })
            // get users input
            .then((res) => {
                // store their access and refresh token in local storage
                localStorage.setItem('access_token', res?.data?.access);
                console.log("local storage access token is " + localStorage.getItem('access_token'));
                localStorage.setItem('refresh_token', res?.data?.refresh);
                console.log("local storage refresh value is " + localStorage.getItem('refresh_token'));
                localStorage.setItem('username', loginFormData.username);
                 console.log("local storage username value is " + localStorage.getItem('username'));
                 const accessToken = res?.data?.access;
            //     update axiosInstance with users tokens
            //        login(localStorage.getItem('access_token'));
                        login(localStorage.getItem('username'));
                        console.log("authenticated value is " + auth);
                axiosInstance.defaults.headers['Authorization'] =
                    'JWT ' + localStorage.getItem('access_token');
                // setAuth({accessToken})
                // console.log(axiosInstance.defaults.headers['Authorization'].type())
                //       login(localStorage.getItem('access_token'));
                //         console.log("authenticated value is " + auth);
                navigate("/profile");


        })
            .catch((error) => {
                console.log("Wrong login details");
                setVariant("danger");
                setStatus("Did you enter the correct username and password?");
        });
    }

    return (
        <div className="login">
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
                            <Form.Text classname="forgot-pass">Forgot your <a href="/">password?</a></Form.Text>
                        </Form.Group>
                        <Button variant="info" type="submit" size="lg"> Log in</Button>
                         <Alert variant={variant}>{status}</Alert>
                  {/*<br />*/}
                        <Link to="/register"><Button variant="outline-light" type="submit" size="lg"> Create an account</Button></Link>
                    </Form>
                </div>
                {/*</div>*/}
            </Container>


        </div>
    )
}