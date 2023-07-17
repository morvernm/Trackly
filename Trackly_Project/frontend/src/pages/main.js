import logo from '../logo.svg'
import record from '../images/droidrec-svgrepo-com.svg'
import album from '../album-placeholder.png'
import { Container, Card, Button, Row, Col, } from "react-bootstrap"
import { albumGrid } from '../components/albumGrid';
import {Link} from "react-router-dom";
// import {Dashboard} from '../pages/dashboard';
import {useContext} from "react";
import AuthContext from "../AuthProvider";
export const Main = () => {
     const { auth } = useContext(AuthContext);
     const landing = () => {
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

     )
              }


const dashboard = () => {
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
             )
    }
    return (
        <Container className="landing-contain">
            {auth !== undefined ? landing() : dashboard()}
        {/*//     <Row className="landing-row">*/}
        {/*//         <Col className="left-col p-5 m-4">*/}
        {/*//             <h1>Trackly</h1>*/}
        {/*//             <h4> Discover. Connect. </h4>*/}
        {/*//             <p>Share your reviews and connect with music lovers</p>*/}
        {/*//             <Link to="/register"><Button type="submit" variant="primary">Sign Up</Button></Link>*/}
        {/*//             /!*<Button type="submit" variant="primary"><Link to="/register">Sign Up</Link></Button>*!/*/}
        {/*//         </Col>*/}
        {/*//         <Col> <img src={logo} className="App-logo" alt="logo" /> </Col>*/}
        {/*//     </Row>*/}
        {/*//*/}
        {/*//     <Row>*/}
        {/*//         <Col>*/}
        {/*//              <h3 className="pt-4">Rate and Review albums</h3>*/}
        {/*//             <br />*/}
        {/*//                 <br />*/}
        {/*//               {albumGrid()}*/}
        {/*//         </Col>*/}
        {/*//*/}
        {/*//     </Row>*/}
        {/*//*/}
        {/*//     <div className="section-3">*/}
        {/*//          <Row>*/}
        {/*//              <Col className="img-col"><img className="album-img" src={album} alt="a music album" /></Col>*/}
        {/*//             <Col>*/}
        {/*//                 <h3>Track your collection</h3>*/}
        {/*//                 <p>Manage your physical music collection</p>*/}
        {/*//             </Col>*/}
        {/*//         </Row>*/}
        {/*//     </div>*/}
        {/*//*/}
        {/*//     <Row>*/}
        {/*//         <Col>*/}
        {/*//             <h3>Like and Favourite tracks</h3>*/}
        {/*//         </Col>*/}
        {/*//          <Col>*/}
        {/*//             <h3>Discover new artists</h3>*/}
        {/*//         </Col>*/}
        {/*//     </Row>*/}
        {/*//*/}
        </Container>
        );

};