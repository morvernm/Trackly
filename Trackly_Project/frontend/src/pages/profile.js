import React, {useContext, useEffect, useState} from 'react';
import {Container, Row, Col, Image, Dropdown, Card, Button, CardGroup, ListGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import profilePic from '../images/profile-holder.svg';
import AuthContext from "../AuthProvider";
import axiosInstance from '../axios';
import axios from "axios";
import {Reviews} from "./reviews";
export const Profile = () => {
    const {username, userId} = useContext(AuthContext);
    const [review, setReviews] = useState(null);
    const [reviewsLoaded, setLoaded] = useState(false);
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
        //     .catch((error) => {
        //     return ("error loading reviews")''
        // })


    }
    useEffect(() => {
    getReviews();
  }, []);
    // getReviews();

    // const getFollowing() => {
    //
    // }

    // const getUserData() => {
    //
    // }

    // if(user.valueOf() !== )
    // not same userID?
    const handleClick = (e) => {

    }
    return (
        <Container style={{display: "flex"}}>
               <Card style={{ width: '100%', height: '100%'}} className="profile-card">
      {/*<Card.Img variant="top" src= />*/}
      <Card.Body>
                  <Card.Title>{username}'s Profile</Card.Title>
          <Row>
              <Col>
                  <Image src={profilePic} alt="user" roundedCircle />
                    <h3>{username}</h3>
                    <p>Bio</p>
                  <div id="social-buttons" style={{display: "none"}}>
                           <Button>Add</Button> <Button>Message</Button>
                  </div>

                    <h4>Following</h4>
                    <div id="following-list">
                          <Image src={profilePic} alt="user" roundedCircle />
                          <Image src={profilePic} alt="user" roundedCircle />
                          <Image src={profilePic} alt="user" roundedCircle />
                    </div>
              </Col>
                                <Col xs={6}>
                    <h2>Favourites</h2>
                      <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">Filter</Dropdown.Toggle>
                          <Dropdown.Menu>
                              <Dropdown.Item onClick={handleClick} href="#/action-1">Artists</Dropdown.Item>
                              <Dropdown.Item onClick={handleClick}>Albums</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                                    <div id="favourites-images">

                                    </div>
                                    <h3>Reviews</h3>
                                    {/*{reviewsLoaded ? }*/}
                                    <Row className=" mx-2 row row-cols-2 p-2"></Row>
                                    {/*<Reviews />*/}
    {/*                                 <CardGroup>*/}
    {/*  <Card>*/}
    {/*    <Card.Img variant="top" src="holder.js/100px160" />*/}
    {/*    <Card.Body>*/}
    {/*      <Card.Title></Card.Title>*/}
    {/*      <Card.Text>*/}
    {/*        This is a wider card with supporting text below as a natural lead-in*/}
    {/*        to additional content. This content is a little bit longer.*/}
    {/*      </Card.Text>*/}
    {/*    </Card.Body>*/}
    {/*    <Card.Footer>*/}
    {/*          <small className="text-muted">Published</small>*/}
    {/*    </Card.Footer>*/}
    {/*  </Card>*/}
    {/*</CardGroup>*/}
  <Link to={`/user/${userId}/reviews`}>See all reviews</Link>
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