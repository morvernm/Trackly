import React, {useContext, useEffect, useState} from 'react';
import {Container, Row, Col, Image, Carousel, Card, Button, CardGroup, ListGroup} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import profilePic from '../images/user-placeholder.jpeg';
import AuthContext from "../AuthProvider";
import axiosInstance from '../axios';
import axios from "axios";
import {Reviews} from "./reviews";
export const Profile = () => {
    const {userId} = useParams()
    const {auth, username} = useContext(AuthContext);
    const [reviews, setReviews] = useState(null);
    const [reviewsLoaded, setLoaded] = useState(false);
    const [profileData, setProfileData] = useState([]);
    const [profileUsername, setProfileUsername] = useState("");
    const [editShow, setShow] = useState(false);
    const [profileBelongsToUser, setProfileBelongsToUser] = useState(false);
    const [favouriteAlbums, setFavouriteAlbums] = useState("");

    async function getProfile() {
        await axios.get(`http://127.0.0.1:8000/api/profile/user/${userId}`)
            .then((response) => {
                setProfileData(response.data);
                setProfileUsername(response.data.user_data.username);
                console.log(response.data);
            })
            .catch((error) => {
                console.log("error loading profile");
            })
    }

    async function getReviews(){
        await axios.get(`http://127.0.0.1:8000/api/user/${userId}/reviews/`)
            .then((response) => {
                setReviews(response.data);
                console.log(response.data);
                setLoaded(true);

            })
            .catch((error) => {
            console.log("error fetching reviews");
        });
    }

    async function getFavourites() {
        await axios.get(`http://127.0.0.1:8000/api/user/${userId}/favourites`)
            .then((response) => {
                setFavouriteAlbums(response.data);
                console.log("got favourites");
            })
            .catch((error) => {
                console.log("error getting favourites!");
            })
    }

    function isAuthUser() {
       if(profileUsername === username) {
        setProfileBelongsToUser(true);
        }
    }

    useEffect(() => {
    getReviews();
    getProfile();
    isAuthUser();
    getFavourites();
  }, []);


    return (
        <Container style={{display: "flex"}}>
               <Card style={{ width: '100%', height: '100%'}} className="profile-card">
      <Card.Body>
          <Row>
              <Col>
                  <Image style={{width: '8em', height: '8em'}} className="m-2" src={profilePic} alt="user" roundedCircle fluid/>
                    <h3>{profileUsername}</h3>
                  {profileBelongsToUser &&
                      <Button variant="light" className="p-2 m-2" show={editShow}>Change Picture</Button>}
                  <br /> <br />
                    <h4>Following</h4>
                    <small className="text-muted">This feature is not available yet</small>
                    <div id="following-list">
                    <br /><br />
                        <Row className=" mx-2 row row-cols-2 p-2">
                          <Image style={{width: '5em', height: '3em'}} src={profilePic} alt="user" roundedCircle />
                            <Image style={{width: '5em', height: '3em'}} src={profilePic} alt="user" roundedCircle />
                             <Image style={{width: '5em', height: '3em'}} src={profilePic} alt="user" roundedCircle />
                        </Row>
                    </div>
                  <br />

                  {/*Rendering the user's favourite albums */}
                  <h4>Favourite Albums</h4>
                    <Row id="favourite-albums-row" className="mx-2 row row-cols-2 p-2">
                        <Carousel>
                            {favouriteAlbums && favouriteAlbums.map((album) => { return (
                                <Carousel.Item>
                                    <Link to={`/album/${album.album_data.spotify_album_id}`}><Image style={{width: '10rem'}} src={album.album_data.img_url}></Image></Link>
                                </Carousel.Item>
                            )
                            })}
                        </Carousel>
                    </Row>
              </Col>

              {/*Rendering the user's reviews*/}
              <Col xs={6}>
                  <h3>Reviews</h3>
                  <Link to={`/user/${userId}/reviews`}><h5>See all reviews</h5></Link>
                  <Row id="user-reviews" className="mx-2 row row-cols-2 p-2">
                      {reviews && reviews.map((review, index) => (
                          <Card className="m-2 p-1" border="primary" style={{ width: '15rem' }}>
                              <Link to={`/album/${review.album_data.spotify_album_id}`}><Card.Img className="img-thumbnail" variant="top" src={review.album_data.img_url} /></Link>
                              <Card.Body>
                                  <Card.Title>{review.title}</Card.Title>
                                  <div className="profile-review-content">
                                      <Card.Text>{review.content}</Card.Text>
                                  </div>
                              </Card.Body>
                          </Card>
                      ))}
                  </Row>
                  <br />
                </Col>
          </Row>
        <Card.Text>
        </Card.Text>
      </Card.Body>

               <br /><br />
                <Row>
                    <Col>
                        <h4>Artists seen live</h4>
                        <ListGroup>
                            <ListGroup.Item>This feature is not available yet</ListGroup.Item>
                        </ListGroup>
                   </Col>
                </Row>
    </Card>
        </Container>

    )
}