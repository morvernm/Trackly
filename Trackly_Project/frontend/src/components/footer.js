import { Link } from 'react-router-dom';
import { Container, Nav } from 'react-bootstrap';
export const Footer = () => {
        return (
            <Container className="foot-cont">
            <footer className="p-2">
                    <p className="pt-2">&copy; {`Morvern Mackintosh`}</p>
            </footer>
            </Container>
        )
}