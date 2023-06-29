import { Form, Button } from "react-bootstrap";
// used Boostrap React documentation for form components
// https://react-bootstrap.netlify.app/docs/forms/overview
export const Login = () => {
    return (
        <div className="login">
            <h4>Login</h4>
            <h4>Register</h4>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="email@email.com" />
                </Form.Group>


                <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="********" />
                </Form.Group>


                 <Button variant="primary" type="submit"> Log in</Button>
            </Form>

        </div>
    )
}