import { Form, Button } from "react-bootstrap";
// used Boostrap React documentation for form components
// https://react-bootstrap.netlify.app/docs/forms/overview
export const SignUp = () => {
    return (
        <div className="register">
             <h4>Sign up</h4>
            <br />
            <Form>
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

                <Form.Group className="mb-3" controlId="formBasicCountry">
                <Form.Label>Country</Form.Label>
                {/*    to make to dropddown */}
                <Form.Control type="text" placeholder="United Kingdom" />
                </Form.Group>

                 <Button variant="info" type="submit"> Sign up </Button>
            </Form>

        </div>
    )
}