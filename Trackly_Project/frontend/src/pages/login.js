import { Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
// used Boostrap React documentation for form components
// https://react-bootstrap.netlify.app/docs/forms/overview
export const Login = () => {
    return (
        <div className="login">
            <Container className="login">
                <div className="login-form">
                    <h4>Login</h4>
                    <br />
                    <br />
                {/*<div className="input-group mb-3">*/}
                    <Form className="login-f">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="email@email.com" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                             <Form.Label>Password</Form.Label>
                             <Form.Control type="password" placeholder="********" />
                            <Form.Text classname="forgot-pass">Forgot your <a href="/">password?</a></Form.Text>
                        </Form.Group>
                        <Button variant="info" type="submit" size="lg"> Log in</Button>
                  {/*<br />*/}
                        <Link to="/register"><Button variant="outline-light" type="submit" size="lg"> Create an account</Button></Link>
                    </Form>
                </div>
                {/*</div>*/}
            </Container>


        </div>
    )
}