import React, { useContext } from 'react';
import {Container, Row, Col, Image, Dropdown, Card, Button, CardGroup, ListGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import profilePic from '../images/profile-holder.svg';
import AuthContext from "../AuthProvider";
import axiosInstance from '../axios';
export const Profile = () => {

    // const getReviews() => {
    //
    // }

    // const getFollowing() => {
    //
    // }

    // const getUserData() => {
    //
    // }
    const {user} = useContext(AuthContext);
    // if(user.valueOf() !== )
    // not same userID?
    const handleClick = (e) => {

    }
    return (
        <Container style={{display: "flex"}}>
               <Card style={{ width: '100%', height: '100%'}}>
      {/*<Card.Img variant="top" src= />*/}
      <Card.Body>
                  <Card.Title>Profile</Card.Title>
          <Row>
              <Col>
                  <Image src={profilePic} alt="user" roundedCircle />
                    <h3>Username</h3>
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
                                    <CardGroup>
      <Card>
        <Card.Img variant="top" src="holder.js/100px160" />
        <Card.Body>
          <Card.Title>Album name</Card.Title>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </Card.Text>
        </Card.Body>
        <Card.Footer>
              <small className="text-muted">Published</small>
        </Card.Footer>
      </Card>
      <Card>
        <Card.Img variant="top" src="holder.js/100px160" />
        <Card.Body>
            <Card.Title>Album name</Card.Title>
          <Card.Text>
            This card has supporting text below as a natural lead-in to
            additional content.{' '}
          </Card.Text>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">Published</small>
        </Card.Footer>

      </Card>
    </CardGroup>
  <Link to>See all reviews</Link>
                </Col>
          </Row>

        <Card.Text>

        </Card.Text>
      </Card.Body>
                      <Col>
                <Row>
                    <h4>Artists</h4>
                </Row>
                           <Col>
                       <Row><h4>Want to see</h4>
                        <ListGroup>
      <ListGroup.Item>Cras justo odio</ListGroup.Item>
      <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
      <ListGroup.Item>Morbi leo risus</ListGroup.Item>
      <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
      <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
    </ListGroup></Row>
                               <h4>Seen live</h4>
                                <ListGroup>
      <ListGroup.Item>Cras justo odio</ListGroup.Item>
      <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
      <ListGroup.Item>Morbi leo risus</ListGroup.Item>
      <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
      <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
    </ListGroup>
                   </Col>
            </Col>

    </Card>

        </Container>

    )
}