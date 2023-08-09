import logo from '../logo.svg'
import record from '../images/droidrec-svgrepo-com.svg'
import album from '../album-placeholder.png'
import {Container, Card, Button, Row, Col, Image,} from "react-bootstrap"
import { albumGrid } from '../components/albumGrid';
import {Link} from "react-router-dom";
// import {Dashboard} from '../pages/dashboard';
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../AuthProvider";
import { getUserReviews } from "../utils/BackendRequests";
import axios from "axios";

export const Main = () => {
     const { auth, userId } = useContext(AuthContext);
     const [reviews, setReviews] = useState("");
     const [albums, setAlbums] = useState("");
     // console.log("authenticated value is " + auth);

    useEffect( () => {
           axios.get(`http://127.0.0.1:8000/api/random-album/`)
             .then(response => {
                 setAlbums(response.data);
                 console.log("random albums found " + response.data);

         });

    }, []);

    console.log("albums are: " + albums[0]);

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
                    <Row id="album-row" className=" mx-2 row row-cols-3 p-2">
                    {albums.length === 0 ? console.log("no albums") :  albums.map((album, index => { return (
                              // <Row id="album-row" >
                            <Col className="album-col">
                                <h1>{album.id}</h1>
                         {/*<h4>Artist name</h4>*/}
                        <Image src={album.img_url} className="img-thumbnail" alt="Album cover" />
                     </Col>
                        )
                        }))
                    }
                        </Row>
                          </Col>
            </Row>


            <div className="section-3">
                 <Row>
                     <Col className="img-col"><img className="album-img" src={album} alt="a music album" /></Col>

                     <Col>
                            <h3>Keep track of your favourite music</h3>
                        {/*<h3>Track your collection</h3>*/}
                        {/*<p>Manage your physical music collection</p>*/}
                    </Col>
                </Row>
            </div>

            <Row>
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
                    <p>Share your reviews and connect with music lovers</p>
                    <Link to="/search"><Button variant="light" size="lg">Write a review</Button></Link>
                </Col>
                <Col> <img src={logo} className="App-logo" alt="logo" /> </Col>

            </Row>

            <Row>
                <Col>
                    </Col>

                <Col>
                    <h3>Recommendations</h3>
                </Col>

            </Row>

            <div className="section-3">
                 <Row>
                     <Col className="img-col"><img className="album-img" src={album} alt="a music album" /></Col>
                    <Col>
                        {/*<h3>Your friends' reviews</h3>*/}
                    </Col>
                </Row>
            </div>

            <Row>
                <Col>
                    {/*<h3>Play a random song</h3>*/}
                </Col>

            </Row>

        </Container>
             )
    }
    return (
        <Container className="landing-contain">
            {auth ? dashboard() : landing()}
        </Container>
        );

};