import {Container, Row, Col, Button, Card, ListGroup, Modal, Form, Image, Alert} from "react-bootstrap";
import albumImage from "../album-placeholder.png"
import ReactPlayer from 'react-player'
import {Link, useParams, useNavigate} from "react-router-dom";
import{BiStar, BiDislike, BiSolidStar, BiSolidDislike, BiPlayCircle, BiHeart, BiSolidHeart} from "react-icons/bi";
import React, {useEffect, useState, useContext, } from "react";
import {Rating, } from "@mui/material";
import axios from "axios";
import AuthContext from "../AuthProvider";

export const Album = () => {
    const { albumName } = useParams();
    // const { albumId } = useParams();
    const {auth, userId} = useContext(AuthContext);
    const [album, setAlbum] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [show, setShow] = useState(false);
    const [published, setPublished] = useState("");
    const [variant, setVariant]= useState("");
    const [reviewShow, setReviewShow] = useState(false);
    const [invalidRating, setInvalidRating] = useState(true);
    const [reviews, setReviews] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        if(auth) {
            setShow(true);
        }else {
            navigate("/login");
        }

    }

    const [favourite, setFavourite] = useState(false);
    const [dislike, setDislike] = useState(false);

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

    //     const getAlbum = async () => {
            try {
                           // setAlbumName();
                 await axios.get(`http://127.0.0.1:8000/api/album/${albumName}`)
                 .then((res) => {
                     console.log("backend album id is " + res.data.id);
                     setReviewContent({...reviewContent, album: res.data.id});
                     setAlbum(res.data);

                 })
                 // setAlbum(res.data);
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
                            // console.log("reviews for this album: " + res.data.title);
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
        if(favourite) {
            console.log("unfavourited");
        setFavourite(false);
             console.log(favourite);

        }else {
            setFavourite(true);
                 console.log(favourite);
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
            // setReviewContent({...reviewContent, status: 'published'});
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

    function playSong() {
        console.log("Now playing song");
        setPlaying(true);
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
                    <h5> <Rating value={1} max={1} readOnly emptyIcon={<BiSolidStar></BiSolidStar>}></Rating>average star rating</h5>
                    <h5><Rating onClick={addFavourite} max={1} emptyIcon={<BiHeart></BiHeart>} icon={<BiSolidHeart></BiSolidHeart>}></Rating>{album.favourited_by} Favourites</h5>
                    {/*<h5><Rating onClick={addDislike} max={1} emptyIcon={<BiDislike></BiDislike>} icon={<BiSolidDislike></BiSolidDislike>}></Rating>{album.disliked_by} Dislikes</h5>*/}
                       <Button variant="info" style={{ textTransform: 'none' }} onClick={handleShow}>Write a Review</Button>
                </Col>
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
                         {/*<Form.Control name="rating" as={Rating} required onChange={handleChange} />*/}
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

                <Row className="album-pg-row">
                    <Col>
                        {/*<h4>Tracklist</h4>*/}
                        {/*<ListGroup as="ol" numbered>*/}
                        {/*   <ListGroup.Item as="li">Dancer  <Button variant="outline-dark"  className="album-page-icons"  size="lg" onClick={playSong}><BiPlayCircle></BiPlayCircle></Button>*/}
                        {/*          /!*<Button variant="outline-dark"  className="album-page-icons"  size="lg" >   *!/*/}
                        {/*              <Rating onClick={addFavourite} max={1} emptyIcon={<BiHeart></BiHeart>} icon={<BiSolidHeart></BiSolidHeart>}></Rating>*/}
                        {/*          /!*</Button>*!/*/}
                        {/*   </ListGroup.Item>*/}

                        {/*</ListGroup>*/}

                    </Col>
                    <Col>
                      <h4>{reviews.length === 1 ? "1 Review" : `${reviews.length} Reviews`}</h4>
                        {reviews && reviews.map((review, index) => (
                   <Row className="review-row">
                      <Col className="mr-2" sm={3}>
                          {/*<Image src={review.album_data.img_url} style={{width: '10rem'}}></Image>*/}
                          <p><Link to={`/review/${review.id}`}>{review.title}</Link></p>
                          <Rating alt="star-rating"  value={review.rating} readOnly></Rating>
                          <p>{review.content}</p>
                          <Link to={`/profile/${review.user_data.id}`}> <p>- {review.user_data.username}</p></Link>
                       </Col>
                       <Col xs={3}>
                       </Col>
                       {/*<Col className="review-content" sm={5}>*/}
                            </Row>
                    ))}
                    </Col>
                </Row>


                    {/*</Col>*/}

                <Row>
                    <Col>
                          <div className="react-player">

                      {/*<ReactPlayer playing={playing} controls="true" url="https://p.scdn.co/mp3-preview/ecc6383aac4b3f4240ae699324573e61c39e6aaf?cid=b471434334d6439ea71999b5d6294d6a"></ReactPlayer>*/}

                </div>
                    </Col>
                </Row>
                <Row>
                       <Col>
                           {/*<Link to="">Listen to the full album on Spotify</Link>*/}
                    </Col>
                </Row>
                </Card>
        </Container>
    )

}