import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
export const Footer = () => {
        // return <footer bg="light" className="border-top">&copy; {`Morvern Mackintosh`}</footer>;
        return (
            <Container className="foot-cont">
            <footer className="border-bottom">
        <Link to="/about">About</Link>
                    <p className="text-center">&copy; {`Morvern Mackintosh`}</p>
                     {/*</Container>*/}
            </footer>
            </Container>
            // className="nav justify-content-center border-bottom pb-3 mb-3" - ul
        // className="py-3 my-4" fotoer
        )
}