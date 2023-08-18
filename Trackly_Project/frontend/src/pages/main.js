import logo from '../logo.svg'
import album from '../album-placeholder.png'
import {Container, Card, Button, Row, Col, Image, Alert} from "react-bootstrap"
import {Link} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../AuthProvider";
import axios from "axios";
import {CLIENT_ID, CLIENT_SECRET} from "../utils/spotify"

export const Main = () => {
     const { auth, userId, setSpotifyToken, setExpiry, spotifyToken } = useContext(AuthContext);
     const [albums, setAlbums] = useState("");
     const [error, setError] = useState("");
     const [showError, setShowError] = useState(false);


   function getRandomAlbums() {
       axios.get(`http://127.0.0.1:8000/api/recent-reviews`)
             .then(response => {
                 setAlbums(response.data);
                 console.log("random albums found ", response.data);
             }).catch(error => {
                 setError("Sorry we couldn't load our albums. Error: " + error.message);
                 setShowError(true);
         });
     }

      useEffect(() => {
    let parameters = {
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
        },
       body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
    fetch('https://accounts.spotify.com/api/token', parameters)
        .then(response => response.json())
        .then(data => {
             setSpotifyToken(data.access_token);
                    setExpiry(data.expires_in);
        })
        .catch(error => {
            console.log("could not generate spotify tokens");
        })
}, [])

    useEffect( () =>  {
        getRandomAlbums();
        // generateSpotifyAccessToken();
    }, []);


    const albumGrid = () => {
        const albumDisplay = albums.slice(0, 6);
        return (
            <Row id="album-row" className=" mx-2 row row-cols-3 p-2">
                    {albumDisplay.length === 0 ? console.log("no albums") :  albumDisplay.map((album, index) => { return (
                            <Col className="album-col">
                                <Link to={`/album/${album.album_data.spotify_album_id}`}><Image src={album.album_data.img_url} className="img-thumbnail" alt="Album cover" /></Link>
                     </Col>
                        )
                        })
                    }
                    <Alert show={showError}>{error}</Alert>
                        </Row>
        )

    }
     const landing = () => {
         return (
                 <Container className="landing-contain">
            <Row className="landing-row">
                <Col className="left-col p-5 m-4">
                    <h1>Trackly</h1>
                    <h4> Discover. Connect. </h4>
                    <br />
                    <h5>Share your reviews and connect with music lovers</h5>
                    <br />
                    <Link to="/register"><Button type="submit" variant="primary" size="lg">Sign Up</Button></Link>
                </Col>
                <Col> <img src={logo} className="App-logo" alt="logo" /> </Col>
            </Row>

            <Row>
                <Col>

                    <h3>Recently Reviewed Albums</h3>
                    <br />
                        <br />
                    {albumGrid()}
                          </Col>
                   <div className="section-3">
                             <Row>
                     {albums[6] &&
                         <Col className="img-col">
                             <br />
                             <br />
                             <h5>Track your favourite albums and share them on your profile!</h5>
                             <br />
                             <br />
                         </Col> }
                </Row>
            </div>
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

            </Row>

            <div className="section-3">
                 <Row>
                    <Col>
                        <h3>Recently Reviewed Albums</h3>
                        {albumGrid()}
                    </Col>
                </Row>
                    <Col className="img-col">
                             <br />
                             <br />
                             <h5>Track your favourite albums and share them on your profile!</h5>
                         </Col>
            </div>
        </Container>
             )
    }
    return (
        <Container className="landing-contain">
            {auth ? dashboard() : landing()}
        </Container>
        );

};