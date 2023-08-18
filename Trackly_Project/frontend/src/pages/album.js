import {Container, Row, Col, Button, Card, ListGroup, Modal, Form, Image, Alert} from "react-bootstrap";
import {Link, useParams, useNavigate} from "react-router-dom";
import {BiSolidHeart} from "react-icons/bi";
import { BsFillHeartbreakFill, BsFillHeartFill} from "react-icons/bs";
import React, {useEffect, useState, useContext, } from "react";
import {Rating, } from "@mui/material";
import axios from "axios";
import AuthContext from "../AuthProvider";
import axiosInstance from "../axios";

export const Album = () => {
    const { albumName } = useParams();
    const {auth, userId, profileId, accessToken, refreshToken, spotifyAccessToken} = useContext(AuthContext);
    const [album, setAlbum] = useState(null);
    const [show, setShow] = useState(false);
    const [published, setPublished] = useState("");
    const [variant, setVariant]= useState("");
    const [reviewShow, setReviewShow] = useState(false);
    const [invalidRating, setInvalidRating] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [favourited, setFavourited] = useState(false);
    const [favouriteId, setFavouriteId] = useState("");
    const [toggleFavourited, setToggle] = useState(false);
    const [spotifyLink, setSpotifyLink] = useState("");


    let searchParams = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + spotifyAccessToken
            }
        }
    // handleClose and handleShow are for controlling the visibility of the review Modal
    const handleClose = () => setShow(false);
    const handleShow = () => {
        if(auth) {
            setShow(true);
        }else {
            navigate("/login");
        }
    }


    // initial review state
    const initialData = Object.freeze( {
        title: '',
        album: '',
        author: userId,
        content: '',
        rating: '',
        status: 'published'
        }
    )

    const [reviewContent, setReviewContent] = useState(initialData);
    const navigate = useNavigate();

  //   review form
  const handleChange = (e) => {
        if(e.target.name === "rating") {
            console.log("checking rating");
            if(e.target.value > 0) {
                setInvalidRating(false);
            }
        }
        setReviewContent({
            ...reviewContent,
            // trimming data as it has spaces
            [e.target.name]: e.target.value.trim(),
        });
        console.log(reviewContent);
    };

  async function getAlbum() {
            try {
                 await axios.get(`http://127.0.0.1:8000/api/album/${albumName}`)
                 .then((res) => {
                     console.log("backend album id is " + res.data.id);
                     setReviewContent({...reviewContent, album: res.data.id});
                     setAlbum(res.data);
                 })
            } catch(error) {
                return (
                    <div>Error loading album!</div>
                )
            }
        }

        async function getReviews() {
                try {
                    await axios.get(`http://127.0.0.1:8000/api/albums/${album.id}/reviews/`)
                        .then((res =>  {
                            setReviews(res.data);
                        }))
                }catch(error) {
                    console.log("couldn't fetch reviews");
                }
        }

        async function checkIfFavourited() {
            await axios.get(`http://127.0.0.1:8000/api/user/${userId}/favourites`)
            .then((response) => {
                for(const favourite of response.data) {
                    if(favourite.album === album.id) {
                        setFavourited(true);
                        // setFavourited(prevFavourited => !prevFavourited);
                        setFavouriteId(favourite.id);
                        break;
                    }
                }
            })
            .catch((error) => {
                console.log("error getting favourites!");
            })
    }

        async function getSpotifyLink() {
        let albumLink = await fetch('https://api.spotify.com/v1/albums/' + album.spotify_album_id + '?=market=GB', searchParams)
            .then(response => response.json())
            .then(data =>  {
                setSpotifyLink(data.external_urls.spotify);
            })
            .catch((error) => {
                 console.log("could not get link");
            });
    }

 useEffect(() => {
     if(albumName) {
         getAlbum();
     }

  }, [albumName]);

   useEffect(() => {
     if(album) {
         getReviews();
         checkIfFavourited();
         getSpotifyLink();
     }

  }, [album, favourited]);


    if(!album) {
        return (<div>Loading album information</div>)
    }


    function handleFavourite() {
        if (auth) {
            if(favourited === false) {
                axios.post(`http://127.0.0.1:8000/api/user/${userId}/favourites`, {
                    album: album.id,
                    profile: profileId
                }).then((response) => {
                    console.log("Favourited album");
                     const updatedAlbum = { ...album, favourited_by: album.favourited_by + 1 } //updating the favourited_by value to users
                     setError("Favourited album");
                     setShowError(true);
                     setAlbum(updatedAlbum);
                     setFavourited(true);
                     return favourited;
                }).catch((error) => {
                    setError("Sorry we couldn't favourite this album. Please try again later");
                    setShowError(true);
                });
            }
        } else {
            navigate('/login');
        }
    }

    function handleUnfavourite() {
        if(auth) {
            if(favourited === true) {
                axios.delete(`http://127.0.0.1:8000/api/favourite/${favouriteId}`)
                    .then((response) => {
                        setError("Unfavourited album");
                        setShowError(true);
                        console.log("unfavourited");
                        const updatedAlbum = { ...album, favourited_by: album.favourited_by - 1 } //updating the favourited_by value to users
                        setAlbum(updatedAlbum);
                        setFavourited(false);
                        return favourited;
                    })
                    .catch((error) => {
                        setError("Sorry we could not unfavourite this album");
                        setShowError(true);
                    })
            }
        }
        else {
            navigate('/login');
        }
    }

    async function publish (e) {
        e.preventDefault();
         if(invalidRating) {
                setVariant("danger");
                setPublished("Please provide a star rating");
                setReviewShow(true);
                return console.log("user did not provide a rating");
            }
        if(auth)  {
            console.log("publishing review");
            await axiosInstance.post('http://127.0.0.1:8000/api/review/create/', reviewContent, {
        }).then((res) => {
                setPublished("Your review has been posted!");
                setVariant("success");
                setReviewShow(true);
            }).catch(error => {
                    setReviewShow(true);
                    setPublished(`Sorry we couldn't post your review. Please try again later. Error: ${error.message}`);
                    console.log(error.message.data);
                    setVariant("danger");
            });
        }else {
            navigate('/login');
        }
        }




    return (
        <Container className="album-page-container">
            <Card className="main-card">
            <Row className="album-pg-row">
                <Col>
                    <Card.Img src={album.img_url} />
                    <Button className="m-2" variant="info" style={{ textTransform: 'none' }} onClick={handleShow}>Write a Review</Button>
                    <br />
                     <Rating className="p-2" onClick={handleFavourite} max={1} emptyIcon={<BsFillHeartFill />} icon={<BsFillHeartFill />}></Rating>
                    <Rating className="p-2" onClick={handleUnfavourite} max={1} emptyIcon={<BsFillHeartbreakFill />} icon={<BsFillHeartbreakFill />}  />
                </Col>
                <Col>
                    <h3>{album.title}</h3>
                    <h5>{album.artist}</h5>

                </Col>
                <Col>
                    {/*<h5> {album.average_rating} <Rating value={1} max={1} readOnly emptyIcon={<BiSolidStar></BiSolidStar>}></Rating>average star rating</h5>*/}
                    <h5><BiSolidHeart />
                        Favourited by {album.favourited_by} {album.favourited_by > 1 || album.favourited_by === 0 ? "Users" : "User" }</h5>
                       <Link target="_blank" to={spotifyLink}>Listen to the full album on Spotify</Link>
                    <br />
                    <Alert show={showError}>{error}</Alert>
                </Col>

                {/*review Modal*/}

                <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
        <Modal.Header style={{color: 'black'}} closeButton><Modal.Title>Draft your review</Modal.Title></Modal.Header>
                       <Form id="review-form" onSubmit={publish}>
                    <Modal.Body>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Title of your review"
                autoFocus
                name="title"
                required
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="review-content">
              <Form.Label>Your review:</Form.Label>
              <Form.Control as="textarea" rows={3} name="content" required
                onChange={handleChange}/>
            </Form.Group>
                     <Form.Group
              className="mb-3"
              controlId="rating-group">
                         <Rating name="rating" onChange={handleChange}></Rating>
            </Form.Group>
                     <Button variant="primary" type="submit">Publish</Button>

        </Modal.Body>
                       </Form>
        <Modal.Footer>
            <Alert show={reviewShow} variant={variant}>{published}</Alert>
            <br />
            <Link to={`/user/${userId}/reviews`}>See your reviews</Link>
        </Modal.Footer>
      </Modal>
            </Row>

                {/*Mapping through the album's reviews*/}

                <Row className="album-pg-row">
                    <br />
                      <h4>{reviews.length === 1 ? "1 Review" : `${reviews.length} Reviews`}</h4>
                        <Row>
                        {reviews && reviews.map((review, index) => (
                      <Col className="mr-2" sm={3}>
                          <p><Link to={`/user/${review.user_data.id}/reviews`}>{review.title}</Link></p>
                          <Rating alt="star-rating"  value={review.rating} readOnly></Rating>
                          <p>{review.content}</p>
                          <Link to={`/profile/user/${review.user_data.id}`}> <p>- {review.user_data.username}</p></Link>
                       </Col>
                    ))}
                </Row>
                </Row>
                </Card>
        </Container>
    )

}