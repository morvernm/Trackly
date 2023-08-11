import {Container, Row, Col, Button, Card, ListGroup, Modal, Form, Image, Alert} from "react-bootstrap";
import {Link, useParams, useNavigate} from "react-router-dom";
import{BiSolidStar, BiHeart, BiSolidHeart} from "react-icons/bi";
import React, {useEffect, useState, useContext, } from "react";
import {Rating, } from "@mui/material";
import axios from "axios";
import AuthContext from "../AuthProvider";

export const Album = () => {
    const { albumName } = useParams();
    const {auth, userId} = useContext(AuthContext);
    const [album, setAlbum] = useState(null);
    const [show, setShow] = useState(false);
    const [published, setPublished] = useState("");
    const [variant, setVariant]= useState("");
    const [reviewShow, setReviewShow] = useState(false);
    const [invalidRating, setInvalidRating] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);

    // handleClose and handleShow are for controlling the visibility of the review Modal
    const handleClose = () => setShow(false);
    const handleShow = () => {
        if(auth) {
            setShow(true);
        }else {
            navigate("/login");
        }
    }

    const [favourite, setFavourite] = useState(false);

    // initial review state
    const initialData = Object.freeze( {
        title: '',
        album: '',
        author: userId,
        content: '',
        rating: '',
        status: 'draft'
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

 useEffect(() => {
     if(albumName) {
         getAlbum();
     }

  }, [albumName]);

   useEffect(() => {
     if(album) {
         getReviews();
     }

  }, [album]);


    if(!album) {
        return (<div>Loading album information</div>)
    }


    function addFavourite() {
        // if (auth) {
        //     if (favourite) {
        //         console.log("unfavourited");
        //         setFavourite(false);
        //     } else {
        //         setFavourite(true);
        //         axios.post(`http://127.0.0.1:8000/api/user/${userId}/add-favourite`, {
        //             favourite_albums: album.id,
        //             user: userId,
        //         }).then((response) => {
        //             console.log("Favourited album");
        //         }).catch((error) => {
        //             setError("Sorry we couldn't favourite this album. Please try again later");
        //             setShowError(true);
        //         });
        //     }
        // } else {
        //     navigate('/login');
        //
        // }
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
            await axios.post('http://127.0.0.1:8000/api/review/create/', {
                title: reviewContent.title,
                album: reviewContent.album,
                author: reviewContent.author,
                content: reviewContent.content,
                rating: reviewContent.rating,
                status: "published"
        }).then((res) => {
                setPublished("Your review has been posted!");
                setVariant("success");
                setReviewShow(true);
            }).catch(error => {
                    setReviewShow(true);
                    setPublished(`Sorry we couldn't post your review. Please try again later. Error: ${error.message}`);
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
                </Col>
                <Col>
                    <h3>{album.title}</h3>
                    <h5>{album.artist}</h5>
                    <Link to="">Listen to the full album on Spotify</Link>
                </Col>
                <Col>
                    <h5> {album.average_rating} <Rating value={1} max={1} readOnly emptyIcon={<BiSolidStar></BiSolidStar>}></Rating>average star rating</h5>
                    <h5><Rating onClick={addFavourite} max={1} emptyIcon={<BiHeart></BiHeart>} icon={<BiSolidHeart></BiSolidHeart>}></Rating>{album.favourited_by} Favourites</h5>
                       <Button variant="info" style={{ textTransform: 'none' }} onClick={handleShow}>Write a Review</Button>
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