import { Container, Form, Button } from "react-bootstrap";
// used Boostrap React documentation for form components
// https://react-bootstrap.netlify.app/docs/forms/overview
export const Register = () => {
    return (
        <div className="login">
            <Container className="login">
                <div className="login-form">
                    <h4>Register</h4>
                    <br />
                    <br />
                    <Form className="login-f">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="email@email.com" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="********" />
                        </Form.Group>

                        <Button variant="info" type="submit" size="lg"> Sign up </Button>
                    </Form>
                </div>
                </Container>
        </div>
    )
}