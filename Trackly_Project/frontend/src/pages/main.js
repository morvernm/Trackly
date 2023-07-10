import logo from '../logo.svg'
import record from '../images/droidrec-svgrepo-com.svg'
import album from '../album-placeholder.png'
import { Container, Card, Button, Row, Col, } from "react-bootstrap"
import { albumGrid } from '../components/albumGrid';
import {Link} from "react-router-dom";
export const Main = () => {

    return (
        <Container className="landing-contain">
            <Row className="landing-row">
                <Col className="left-col p-5 m-4">
                    <h1>Trackly</h1>
                    <h4> Discover. Connect. </h4>
                    <p>Share your reviews and connect with music lovers</p>
                    <Link to="/register"><Button type="submit" variant="primary">Sign Up</Button></Link>
                    {/*<Button type="submit" variant="primary"><Link to="/register">Sign Up</Link></Button>*/}
                </Col>
                <Col> <img src={logo} className="App-logo" alt="logo" /> </Col>
            </Row>

            <Row>
                <Col>
                     <h3 className="pt-4">Rate and Review albums</h3>
                    <br />
                        <br />
                      {albumGrid()}
                </Col>

            </Row>

            <div className="section-3">
                 <Row>
                     <Col className="img-col"><img className="album-img" src={album} alt="a music album" /></Col>
                    <Col>
                        <h3>Track your collection</h3>
                        <p>Manage your physical music collection</p>
                    </Col>
                </Row>
            </div>

            <Row>
                <Col>
                    <h3>Like and Favourite tracks</h3>
                </Col>
                 <Col>
                    <h3>Discover new artists</h3>
                </Col>
            </Row>

        </Container>
        );

            {/*<br />*/}
            {/* /!*<span>Share your reviews and connect with music lovers</span>*!/*/}
            {/*    <br />*/}
            {/*    <br />*/}
            {/*   <card>*/}
            {/*       /!*<h3>Track your music collection</h3>*!/*/}
            {/*   </card>*/}
            {/*<br />*/}
            {/*/!*could make below a commponent and import it, instead of having all code in here*!/*/}
            {/*<*/}
            {/*<div>*/}
            {/*    {albumGrid()}*/}

                 {/*for artist page?*/}

    {/*             <Card style={{ width: '18rem' }}>*/}
    {/*  <Card.Img variant="top" src={album} />*/}
    {/*  <Card.Body>*/}
    {/*    <Card.Title>Card Title</Card.Title>*/}
    {/*    <Card.Text>*/}
    {/*      Some quick example text to build on the card title and make up the*/}
    {/*      bulk of the card's content.*/}
    {/*    </Card.Text>*/}
    {/*    <Button variant="primary">Go somewhere</Button>*/}
    {/*  </Card.Body>*/}
    {/*</Card>*/}
    {/*        </div>*/}

                   {/*</Container>*/}
        // );

};