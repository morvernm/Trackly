import logo from '../logo.svg'
import record from '../images/droidrec-svgrepo-com.svg'
import album from '../album-placeholder.png'
import {Container, Card, Button, Row, Col, Image,} from "react-bootstrap"
import { albumGrid } from '../components/albumGrid';
import {Link} from "react-router-dom";
// import {Dashboard} from '../pages/dashboard';
import {useContext, useEffect, useState} from "react";
import AuthContext from "../AuthProvider";
import { getUserReviews } from "../utils/BackendRequests";

export const Main = () => {
     const { auth, userId } = useContext(AuthContext);
     const [reviews, setReviews] = useState("");

    //  useEffect(() => {
    //           if(auth) {
    //      getUserReviews(userId)
    //         .then(data => {
    //             setReviews(data);
    //     })
    //         .catch(error => {
    //             console.error("could not fetch user's reviews" + error.message);
    //     });
    //  }
    // });


     console.log("authenticated value is " + auth);
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
                        {/*<h3>Track your collection</h3>*/}
                        {/*<p>Manage your physical music collection</p>*/}
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
                    {/*<h4> Discover. Connect. </h4>*/}
                    <p>Share your reviews and connect with music lovers</p>
                    <Link to="/search"><Button variant="light" size="lg">Write a review</Button></Link>
                    {/*<Button type="submit" variant="primary"><Link to="/register">Sign Up</Link></Button>*/}
                </Col>
                <Col> <img src={logo} className="App-logo" alt="logo" /> </Col>
            </Row>

            <Row>
                <Col>

             {/*<h3 className="pt-4"></h3>*/}

                    <h3>Your reviews</h3>
                        <br />
                    {/*{reviews &&*/}
                    {/*    <Row id="album-row">*/}
                    {/* <Col className="album-col">*/}
                    {/*     /!*<h4>Artist name</h4>*!/*/}
                    {/*    <Image src={reviews[0].album_data.img_url} className="img-thumbnail" alt="Album cover" />*/}
                    {/* </Col>*/}
                    {/* <Col className="album-col">*/}
                    {/*    <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                    {/*</Col>*/}
                    {/*<Col className="album-col">*/}
                    {/*    <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                    {/*</Col>*/}
                    {/*    </Row>*/}
                    {/*}*/}
                      {/*{albumGrid()}*/}
             {/*<Row id="album-row">*/}
             {/*        <Col className="album-col">*/}
             {/*            /!*<h4>Artist name</h4>*!/*/}
             {/*           <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
             {/*        </Col>*/}
             {/*        <Col className="album-col">*/}
             {/*           <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
             {/*       </Col>*/}
             {/*       <Col className="album-col">*/}
             {/*           <Image src={album} className="img-thumbnail" alt="Album cover" />*/}
                    </Col>
             {/*    </Row>*/}
             {/*   </Col>*/}
                <Col>
                    <h3>Recommendations</h3>
                </Col>

            </Row>

            <div className="section-3">
                 <Row>
                     <Col className="img-col"><img className="album-img" src={album} alt="a music album" /></Col>
                    <Col>
                        <h3>Your friends' reviews</h3>
                        {/*<p>Manage your physical music collection</p>*/}
                    </Col>
                </Row>
            </div>

            <Row>
                <Col>
                    <h3>Play a random song</h3>
                </Col>

            </Row>

        </Container>
             )
    }
    return (
        <Container className="landing-contain">
            {/*{auth !== undefined ? landing() : dashboard()}*/}
            {auth ? dashboard() : landing()}
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