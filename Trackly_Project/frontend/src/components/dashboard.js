import logo from '../logo.svg'
import record from '../images/droidrec-svgrepo-com.svg'
import album from '../album-placeholder.png'
import { Container, Card, Button, Row, Col, } from "react-bootstrap"
import { albumGrid } from '../components/albumGrid';
import {Link} from "react-router-dom";
export const Dashboard = () => {

    return (
        <Container className="landing-contain">
            <Row className="landing-row">
                <Col className="left-col p-5 m-4">
                    <h1>Trackly</h1>
                    <h4> Discover. Connect. </h4>
                    <p>Share your reviews and connect with music lovers</p>
                    {/*<Button type="submit" variant="primary"><Link to="/register">Sign Up</Link></Button>*/}
                </Col>
                <Col> <img src={logo} className="App-logo" alt="logo" /> </Col>
            </Row>

            <Row>
                <Col>
                     <h3 className="pt-4">Write a review!</h3>
                    <br />
                        <br />
                      {albumGrid()}
                </Col>
                <Col>
                    <h3>Recommendations</h3>
                </Col>

            </Row>

            <div className="section-3">
                 <Row>
                     <Col className="img-col"><img className="album-img" src={album} alt="a music album" /></Col>
                    <Col>
                        <h3>Your collection</h3>
                        {/*<p>Manage your physical music collection</p>*/}
                    </Col>
                </Row>
            </div>

            <Row>
                <Col>
                    <h3>Play a random song!</h3>
                </Col>

            </Row>

        </Container>
        );


};